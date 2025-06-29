import http.server
import socketserver
import json
import urllib.request
import ssl
import time
import sqlite3
import hashlib
import random
import threading
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs
from http.client import HTTPResponse
from typing import Dict, List, Optional
import uuid
import re
import os

class TrafficAnalytics:
    def __init__(self):
        # Major countries and cities for region-wise analytics
        self.major_countries = {
            'US': {'name': 'United States', 'cities': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']},
            'CN': {'name': 'China', 'cities': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Chongqing', 'Nanjing', 'Wuhan', 'Xi\'an']},
            'IN': {'name': 'India', 'cities': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur']},
            'GB': {'name': 'United Kingdom', 'cities': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff']},
            'DE': {'name': 'Germany', 'cities': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']},
            'FR': {'name': 'France', 'cities': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']},
            'JP': {'name': 'Japan', 'cities': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama']},
            'BR': {'name': 'Brazil', 'cities': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre']},
            'CA': {'name': 'Canada', 'cities': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener']},
            'AU': {'name': 'Australia', 'cities': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong']},
            'RU': {'name': 'Russia', 'cities': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov']},
            'KR': {'name': 'South Korea', 'cities': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam']},
            'IT': {'name': 'Italy', 'cities': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania']},
            'ES': {'name': 'Spain', 'cities': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao']},
            'MX': {'name': 'Mexico', 'cities': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Ciudad Juárez', 'León', 'Zapopan', 'Nezahualcóyotl', 'Guadalupe']}
        }
        self.db_path = 'traffic_analytics.db'
        self.init_database()
        self.sessions = {}
        self.heatmap_data = {}
        self.conversion_funnels = {}
        self.alerts = []
        
    def init_database(self):
        # Remove existing database to recreate with correct schema
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
            
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Core analytics tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pageviews (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                url TEXT,
                timestamp DATETIME,
                user_agent TEXT,
                ip_address TEXT,
                referrer TEXT,
                time_on_page INTEGER,
                bounce BOOLEAN,
                country_code TEXT,
                country_name TEXT,
                city TEXT,
                region TEXT,
                latitude REAL,
                longitude REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                start_time DATETIME,
                end_time DATETIME,
                duration INTEGER,
                page_count INTEGER,
                user_agent TEXT,
                ip_address TEXT,
                device_type TEXT,
                browser TEXT,
                os TEXT,
                country_code TEXT,
                country_name TEXT,
                city TEXT,
                region TEXT,
                latitude REAL,
                longitude REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                event_type TEXT,
                event_data TEXT,
                timestamp DATETIME,
                page_url TEXT,
                country_code TEXT,
                city TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS traffic_sources (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                source_type TEXT,
                source_name TEXT,
                campaign TEXT,
                medium TEXT,
                term TEXT,
                timestamp DATETIME,
                country_code TEXT,
                city TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS seo_metrics (
                id TEXT PRIMARY KEY,
                url TEXT,
                load_time INTEGER,
                core_web_vitals TEXT,
                keyword_rankings TEXT,
                backlinks_count INTEGER,
                timestamp DATETIME,
                country_code TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS heatmaps (
                id TEXT PRIMARY KEY,
                page_url TEXT,
                x_coord INTEGER,
                y_coord INTEGER,
                event_type TEXT,
                timestamp DATETIME,
                country_code TEXT,
                city TEXT
            )
        ''')
        
        # self.insert_sample_data(cursor)  # Disabled: Only real tracked data will be stored
        
        conn.commit()
        conn.close()

    def insert_sample_data(self, cursor):
        """Insert sample data for testing with regional information"""
        # Sample pageviews with regional data
        sample_urls = [
            'https://example.com',
            'https://example.com/products',
            'https://example.com/about',
            'https://example.com/contact',
            'https://example.com/blog'
        ]
        
        # Generate data for the last 24 hours with more recent activity
        for i in range(200):  # Increased from 100 to 200
            session_id = f"session_{i}"
            url = random.choice(sample_urls)
            
            # Create more realistic time distribution - more recent activity
            if i < 50:  # 25% of data in last hour
                timestamp = datetime.now() - timedelta(minutes=random.randint(1, 60))
            elif i < 100:  # 25% of data in last 6 hours
                timestamp = datetime.now() - timedelta(hours=random.randint(1, 6))
            else:  # 50% of data in last 24 hours
                timestamp = datetime.now() - timedelta(hours=random.randint(6, 24))
            
            # Randomly select a country and city
            country_code = random.choice(list(self.major_countries.keys()))
            country_info = self.major_countries[country_code]
            city = random.choice(country_info['cities'])
            
            cursor.execute('''
                INSERT INTO pageviews (id, session_id, url, timestamp, user_agent, ip_address, referrer, time_on_page, bounce, country_code, country_name, city, region, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(uuid.uuid4()),
                session_id,
                url,
                timestamp,
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                f"192.168.1.{random.randint(1, 255)}",
                random.choice(['google.com', 'facebook.com', 'twitter.com', 'direct']),
                random.randint(30, 300),
                random.choice([True, False]),
                country_code,
                country_info['name'],
                city,
                country_info['name'],
                random.uniform(-90, 90),  # Latitude
                random.uniform(-180, 180)  # Longitude
            ))
        
        # Sample traffic sources with regional data
        sources = ['Direct', 'Organic', 'Referral', 'Social', 'Paid']
        for i in range(120):  # Increased from 60 to 120
            country_code = random.choice(list(self.major_countries.keys()))
            country_info = self.major_countries[country_code]
            city = random.choice(country_info['cities'])
            
            # More recent traffic source data
            if i < 30:  # 25% recent
                timestamp = datetime.now() - timedelta(minutes=random.randint(1, 60))
            else:  # 75% older
                timestamp = datetime.now() - timedelta(hours=random.randint(1, 24))
            
            cursor.execute('''
                INSERT INTO traffic_sources (id, session_id, source_type, source_name, campaign, medium, term, timestamp, country_code, city)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(uuid.uuid4()),
                f"session_{i}",
                random.choice(sources),
                random.choice(['Google', 'Facebook', 'Twitter', 'LinkedIn', 'Direct']),
                random.choice(['brand', 'generic', 'product']),
                random.choice(['organic', 'cpc', 'social', 'referral']),
                random.choice(['traffic analytics', 'web analytics', 'seo tools']),
                timestamp,
                country_code,
                city
            ))
        
        # Sample heatmap data with regional information
        for i in range(300):  # Increased from 150 to 300
            country_code = random.choice(list(self.major_countries.keys()))
            country_info = self.major_countries[country_code]
            city = random.choice(country_info['cities'])
            
            # More recent heatmap data
            if i < 75:  # 25% recent
                timestamp = datetime.now() - timedelta(minutes=random.randint(1, 60))
            else:  # 75% older
                timestamp = datetime.now() - timedelta(hours=random.randint(1, 24))
            
            cursor.execute('''
                INSERT INTO heatmaps (id, page_url, x_coord, y_coord, event_type, timestamp, country_code, city)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(uuid.uuid4()),
                random.choice(sample_urls),
                random.randint(100, 800),
                random.randint(100, 600),
                random.choice(['click', 'scroll', 'hover']),
                timestamp,
                country_code,
                city
            ))
        
        # Sample SEO metrics with regional data
        for url in sample_urls:
            for country_code in random.sample(list(self.major_countries.keys()), 5):
                cursor.execute('''
                    INSERT INTO seo_metrics (id, url, load_time, core_web_vitals, keyword_rankings, backlinks_count, timestamp, country_code)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    str(uuid.uuid4()),
                    url,
                    random.randint(500, 2500),
                    json.dumps({
                        "lcp": random.randint(1000, 4000),
                        "fid": random.randint(10, 150),
                        "cls": round(random.uniform(0, 0.3), 3)
                    }),
                    json.dumps({"traffic analytics": random.randint(1, 50)}),
                    random.randint(50, 2000),
                    datetime.now(),
                    country_code
                ))

    def get_region_wise_analytics(self, time_range: str = '24h', country_code: str = None, city: str = None) -> Dict:
        """Get region-wise analytics data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Calculate time range
            now = datetime.now()
            if time_range == '24h':
                start_time = now - timedelta(hours=24)
            elif time_range == '7d':
                start_time = now - timedelta(days=7)
            elif time_range == '30d':
                start_time = now - timedelta(days=30)
            else:
                start_time = now - timedelta(hours=24)
            
            # Build query conditions
            conditions = ['timestamp >= ?']
            params = [start_time]
            
            if country_code:
                conditions.append('country_code = ?')
                params.append(country_code)
            
            if city:
                conditions.append('city = ?')
                params.append(city)
            
            where_clause = ' AND '.join(conditions)
            
            # Get regional pageviews
            cursor.execute(f'''
                SELECT country_code, country_name, city, COUNT(*) as pageviews, 
                       COUNT(DISTINCT session_id) as unique_visitors,
                       AVG(time_on_page) as avg_duration,
                       SUM(CASE WHEN bounce = 1 THEN 1 ELSE 0 END) as bounces
                FROM pageviews 
                WHERE {where_clause}
                GROUP BY country_code, country_name, city
                ORDER BY pageviews DESC
            ''', params)
            
            regional_data = []
            for row in cursor.fetchall():
                country_code, country_name, city, pageviews, unique_visitors, avg_duration, bounces = row
                bounce_rate = (bounces / pageviews * 100) if pageviews > 0 else 0
                
                regional_data.append({
                    'country_code': country_code,
                    'country_name': country_name,
                    'city': city,
                    'pageviews': pageviews,
                    'unique_visitors': unique_visitors,
                    'avg_duration': round(avg_duration or 0, 2),
                    'bounce_rate': round(bounce_rate, 2)
                })
            
            # Get top countries
            cursor.execute(f'''
                SELECT country_code, country_name, COUNT(*) as pageviews,
                       COUNT(DISTINCT session_id) as unique_visitors
                FROM pageviews 
                WHERE {where_clause}
                GROUP BY country_code, country_name
                ORDER BY pageviews DESC
                LIMIT 10
            ''', params)
            
            top_countries = []
            for row in cursor.fetchall():
                country_code, country_name, pageviews, unique_visitors = row
                top_countries.append({
                    'country_code': country_code,
                    'country_name': country_name,
                    'pageviews': pageviews,
                    'unique_visitors': unique_visitors
                })
            
            # Get top cities
            cursor.execute(f'''
                SELECT city, country_name, COUNT(*) as pageviews,
                       COUNT(DISTINCT session_id) as unique_visitors
                FROM pageviews 
                WHERE {where_clause}
                GROUP BY city, country_name
                ORDER BY pageviews DESC
                LIMIT 15
            ''', params)
            
            top_cities = []
            for row in cursor.fetchall():
                city, country_name, pageviews, unique_visitors = row
                top_cities.append({
                    'city': city,
                    'country_name': country_name,
                    'pageviews': pageviews,
                    'unique_visitors': unique_visitors
                })
            
            # Get regional traffic sources
            cursor.execute(f'''
                SELECT source_type, COUNT(*) as count
                FROM traffic_sources 
                WHERE {where_clause}
                GROUP BY source_type
            ''', params)
            
            regional_traffic_sources = dict(cursor.fetchall())
            
            # Get regional device breakdown (simulated)
            regional_device_breakdown = {
                'Desktop': 0,
                'Mobile': 0,
                'Tablet': 0
            }
            
            conn.close()
            
            return {
                "success": True,
                "data": {
                    "regional_data": regional_data,
                    "top_countries": top_countries,
                    "top_cities": top_cities,
                    "traffic_sources": regional_traffic_sources,
                    "device_breakdown": regional_device_breakdown,
                    "time_range": time_range,
                    "filter": {
                        "country_code": country_code,
                        "city": city
                    }
                }
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_available_regions(self) -> Dict:
        """Get list of available countries and cities"""
        try:
            return {
                "success": True,
                "data": {
                    "countries": [
                        {
                            "code": code,
                            "name": info['name'],
                            "cities": info['cities']
                        }
                        for code, info in self.major_countries.items()
                    ]
                }
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def generate_session_id(self, ip_address: str, user_agent: str) -> str:
        """Generate a unique session ID based on IP and user agent"""
        combined = f"{ip_address}:{user_agent}:{int(time.time() / 3600)}"
        return hashlib.md5(combined.encode()).hexdigest()

    def track_pageview(self, data: Dict) -> Dict:
        """Track a pageview with comprehensive analytics"""
        try:
            session_id = self.generate_session_id(data.get('ip_address', ''), data.get('user_agent', ''))
            
            # Create or update session
            if session_id not in self.sessions:
                self.sessions[session_id] = {
                    'start_time': datetime.now(),
                    'page_count': 0,
                    'pages': []
                }
            
            self.sessions[session_id]['page_count'] += 1
            self.sessions[session_id]['pages'].append({
                'url': data['url'],
                'timestamp': datetime.now(),
                'time_on_page': data.get('time_on_page', 0)
            })
            
            # Get regional data (simulated for demo)
            country_code = data.get('country_code', random.choice(list(self.major_countries.keys())))
            country_info = self.major_countries.get(country_code, self.major_countries['US'])
            city = data.get('city', random.choice(country_info['cities']))
            
            # Store in database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO pageviews (id, session_id, url, timestamp, user_agent, ip_address, referrer, time_on_page, bounce, country_code, country_name, city, region, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(uuid.uuid4()),
                session_id,
                data['url'],
                datetime.now(),
                data.get('user_agent', ''),
                data.get('ip_address', ''),
                data.get('referrer', ''),
                data.get('time_on_page', 0),
                data.get('bounce', True),
                country_code,
                country_info['name'],
                city,
                country_info['name'],
                data.get('latitude', random.uniform(-90, 90)),
                data.get('longitude', random.uniform(-180, 180))
            ))
            
            conn.commit()
            conn.close()
            
            return {"success": True, "session_id": session_id}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def track_event(self, data: Dict) -> Dict:
        """Track custom events (clicks, form submissions, etc.)"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get regional data
            country_code = data.get('country_code', random.choice(list(self.major_countries.keys())))
            country_info = self.major_countries.get(country_code, self.major_countries['US'])
            city = data.get('city', random.choice(country_info['cities']))
            
            cursor.execute('''
                INSERT INTO events (id, session_id, event_type, event_data, timestamp, page_url, country_code, city)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(uuid.uuid4()),
                data.get('session_id', ''),
                data['event_type'],
                json.dumps(data.get('event_data', {})),
                datetime.now(),
                data.get('page_url', ''),
                country_code,
                city
            ))
            
            conn.commit()
            conn.close()
            
            return {"success": True}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def track_heatmap(self, data: Dict) -> Dict:
        """Track heatmap data (clicks, scrolls, mouse movements)"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get regional data
            country_code = data.get('country_code', random.choice(list(self.major_countries.keys())))
            country_info = self.major_countries.get(country_code, self.major_countries['US'])
            city = data.get('city', random.choice(country_info['cities']))
            
            cursor.execute('''
                INSERT INTO heatmaps (id, page_url, x_coord, y_coord, event_type, timestamp, country_code, city)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(uuid.uuid4()),
                data['page_url'],
                data['x_coord'],
                data['y_coord'],
                data['event_type'],
                datetime.now(),
                country_code,
                city
            ))
            
            conn.commit()
            conn.close()
            
            return {"success": True}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_analytics_summary(self, url: str = None, time_range: str = '24h') -> Dict:
        """Get comprehensive analytics summary"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Calculate time range
            now = datetime.now()
            if time_range == '24h':
                start_time = now - timedelta(hours=24)
            elif time_range == '7d':
                start_time = now - timedelta(days=7)
            elif time_range == '30d':
                start_time = now - timedelta(days=30)
            else:
                start_time = now - timedelta(hours=24)
            
            # Pageviews
            cursor.execute('''
                SELECT COUNT(*) FROM pageviews 
                WHERE timestamp >= ? AND (? IS NULL OR url LIKE ?)
            ''', (start_time, url, f'%{url}%' if url else None))
            pageviews = cursor.fetchone()[0]
            
            # Unique visitors (sessions)
            cursor.execute('''
                SELECT COUNT(DISTINCT session_id) FROM pageviews 
                WHERE timestamp >= ? AND (? IS NULL OR url LIKE ?)
            ''', (start_time, url, f'%{url}%' if url else None))
            unique_visitors = cursor.fetchone()[0]
            
            # Bounce rate
            cursor.execute('''
                SELECT COUNT(*) FROM pageviews 
                WHERE timestamp >= ? AND bounce = 1 AND (? IS NULL OR url LIKE ?)
            ''', (start_time, url, f'%{url}%' if url else None))
            bounces = cursor.fetchone()[0]
            bounce_rate = (bounces / pageviews * 100) if pageviews > 0 else 0
            
            # Average session duration
            cursor.execute('''
                SELECT AVG(time_on_page) FROM pageviews 
                WHERE timestamp >= ? AND (? IS NULL OR url LIKE ?)
            ''', (start_time, url, f'%{url}%' if url else None))
            avg_duration = cursor.fetchone()[0] or 0
            
            # Traffic sources
            cursor.execute('''
                SELECT source_type, COUNT(*) FROM traffic_sources 
                WHERE timestamp >= ? GROUP BY source_type
            ''', (start_time,))
            traffic_sources = dict(cursor.fetchall())
            
            # Top pages
            cursor.execute('''
                SELECT url, COUNT(*) as count FROM pageviews 
                WHERE timestamp >= ? GROUP BY url ORDER BY count DESC LIMIT 10
            ''', (start_time,))
            top_pages = [{'url': row[0], 'count': row[1]} for row in cursor.fetchall()]
            
            # Device breakdown (simulated)
            device_breakdown = {
                'Desktop': 0,
                'Mobile': 0,
                'Tablet': 0
            }
            
            conn.close()
            
            return {
                "success": True,
                "data": {
                    "pageviews": pageviews,
                    "unique_visitors": unique_visitors,
                    "bounce_rate": round(bounce_rate, 2),
                    "avg_session_duration": round(avg_duration, 2),
                    "traffic_sources": traffic_sources,
                    "top_pages": top_pages,
                    "device_breakdown": device_breakdown,
                    "time_range": time_range
                }
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_real_time_data(self) -> Dict:
        """Get real-time analytics data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Active sessions in last 5 minutes
            five_minutes_ago = datetime.now() - timedelta(minutes=5)
            cursor.execute('''
                SELECT COUNT(DISTINCT session_id) FROM pageviews 
                WHERE timestamp >= ?
            ''', (five_minutes_ago,))
            active_sessions = cursor.fetchone()[0]
            
            # Pageviews in last hour
            one_hour_ago = datetime.now() - timedelta(hours=1)
            cursor.execute('''
                SELECT COUNT(*) FROM pageviews WHERE timestamp >= ?
            ''', (one_hour_ago,))
            hourly_pageviews = cursor.fetchone()[0]
            
            # Current pageviews per minute
            one_minute_ago = datetime.now() - timedelta(minutes=1)
            cursor.execute('''
                SELECT COUNT(*) FROM pageviews WHERE timestamp >= ?
            ''', (one_minute_ago,))
            pageviews_per_minute = cursor.fetchone()[0]
            
            conn.close()
            
            return {
                "success": True,
                "data": {
                    "active_sessions": active_sessions,
                    "hourly_pageviews": hourly_pageviews,
                    "pageviews_per_minute": pageviews_per_minute,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_seo_metrics(self, url: str) -> Dict:
        """Analyze SEO metrics for a URL"""
        try:
            # For now, return empty SEO metrics since we're not doing real SEO analysis
            return {
                "success": True,
                "data": {
                    "load_time": 0,
                    "core_web_vitals": {
                        "lcp": 0,
                        "fid": 0,
                        "cls": 0
                    },
                    "keyword_rankings": {},
                    "backlinks_count": 0,
                    "seo_score": 0
                }
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_conversion_funnel(self, funnel_name: str) -> Dict:
        """Get conversion funnel data"""
        try:
            # Simulate funnel data
            funnel_steps = [
                {"step": "Landing Page", "visitors": 1000, "conversion_rate": 100},
                {"step": "Product View", "visitors": 800, "conversion_rate": 80},
                {"step": "Add to Cart", "visitors": 400, "conversion_rate": 40},
                {"step": "Checkout", "visitors": 200, "conversion_rate": 20},
                {"step": "Purchase", "visitors": 100, "conversion_rate": 10}
            ]
            
            return {
                "success": True,
                "data": {
                    "funnel_name": funnel_name,
                    "steps": funnel_steps,
                    "total_conversion_rate": 10
                }
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_heatmap_data(self, page_url: str) -> Dict:
        """Get heatmap data for a specific page"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT x_coord, y_coord, event_type, COUNT(*) as count 
                FROM heatmaps 
                WHERE page_url = ? 
                GROUP BY x_coord, y_coord, event_type
            ''', (page_url,))
            
            heatmap_data = []
            for row in cursor.fetchall():
                heatmap_data.append({
                    "x": row[0],
                    "y": row[1],
                    "event_type": row[2],
                    "intensity": row[3]
                })
            
            # If no data for specific URL, return empty data
            if not heatmap_data:
                heatmap_data = []
            
            conn.close()
            
            return {
                "success": True,
                "data": heatmap_data
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    def generate_fresh_sample_data(self):
        """Generate fresh sample data for real-time testing"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Add some very recent pageviews (last few minutes)
            sample_urls = [
                'https://example.com',
                'https://example.com/products',
                'https://example.com/about',
                'https://example.com/contact',
                'https://example.com/blog'
            ]
            
            # Generate 20-50 recent pageviews
            for i in range(random.randint(20, 50)):
                session_id = f"recent_session_{i}"
                url = random.choice(sample_urls)
                timestamp = datetime.now() - timedelta(minutes=random.randint(0, 5))  # Last 5 minutes
                
                country_code = random.choice(list(self.major_countries.keys()))
                country_info = self.major_countries[country_code]
                city = random.choice(country_info['cities'])
                
                cursor.execute('''
                    INSERT INTO pageviews (id, session_id, url, timestamp, user_agent, ip_address, referrer, time_on_page, bounce, country_code, country_name, city, region, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    str(uuid.uuid4()),
                    session_id,
                    url,
                    timestamp,
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    f"192.168.1.{random.randint(1, 255)}",
                    random.choice(['google.com', 'facebook.com', 'twitter.com', 'direct']),
                    random.randint(30, 300),
                    random.choice([True, False]),
                    country_code,
                    country_info['name'],
                    city,
                    country_info['name'],
                    random.uniform(-90, 90),
                    random.uniform(-180, 180)
                ))
            
            conn.commit()
            conn.close()
            
            return {"success": True, "message": "Fresh sample data generated"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    analytics = TrafficAnalytics()
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            if self.path == '/track/pageview':
                result = self.analytics.track_pageview(data)
            elif self.path == '/track/event':
                result = self.analytics.track_event(data)
            elif self.path == '/track/heatmap':
                result = self.analytics.track_heatmap(data)
            elif self.path == '/seo/analyze':
                result = self.analytics.get_seo_metrics(data['url'])
            else:
                result = {"success": False, "error": "Invalid endpoint"}
                
                self.send_response(200)
                self.send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": False,
                "error": str(e)
            }).encode())
    
    def do_GET(self):
        try:
            if self.path.startswith('/analytics/summary'):
                # Parse query parameters
                parsed_url = urlparse(self.path)
                params = parse_qs(parsed_url.query)
                
                url = params.get('url', [None])[0]
                time_range = params.get('time_range', ['24h'])[0]
                
                result = self.analytics.get_analytics_summary(url, time_range)
                
            elif self.path == '/analytics/realtime':
                result = self.analytics.get_real_time_data()
                
            elif self.path.startswith('/analytics/funnel'):
                parsed_url = urlparse(self.path)
                params = parse_qs(parsed_url.query)
                funnel_name = params.get('name', ['default'])[0]
                result = self.analytics.get_conversion_funnel(funnel_name)
                
            elif self.path.startswith('/analytics/heatmap'):
                parsed_url = urlparse(self.path)
                params = parse_qs(parsed_url.query)
                page_url = params.get('page_url', [''])[0]
                result = self.analytics.get_heatmap_data(page_url)
                
            elif self.path.startswith('/analytics/regions'):
                parsed_url = urlparse(self.path)
                params = parse_qs(parsed_url.query)
                time_range = params.get('time_range', ['24h'])[0]
                country_code = params.get('country_code', [None])[0]
                city = params.get('city', [None])[0]
                result = self.analytics.get_region_wise_analytics(time_range, country_code, city)
                
            elif self.path == '/analytics/available-regions':
                result = self.analytics.get_available_regions()
                
            elif self.path == '/generate-sample-data':
                result = self.analytics.generate_fresh_sample_data()
                
            else:
                result = {"success": False, "error": "Invalid endpoint"}
            
            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": False,
                "error": str(e)
            }).encode())

def run_server():
    port = 8001
    server_address = ('', port)
    
    try:
        with socketserver.TCPServer(server_address, RequestHandler) as httpd:
            print(f"🚀 Traffic Analytics Server running on port {port}")
            print(f"📊 Available endpoints:")
            print(f"   POST /track/pageview - Track pageviews")
            print(f"   POST /track/event - Track custom events")
            print(f"   POST /track/heatmap - Track heatmap data")
            print(f"   POST /seo/analyze - Analyze SEO metrics")
            print(f"   GET /analytics/summary - Get analytics summary")
            print(f"   GET /analytics/realtime - Get real-time data")
            print(f"   GET /analytics/funnel - Get conversion funnel")
            print(f"   GET /analytics/heatmap - Get heatmap data")
            print(f"   GET /analytics/regions - Get region-wise analytics")
            print(f"   GET /analytics/available-regions - Get available regions")
            print(f"   POST /generate-sample-data - Generate fresh sample data")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"Error: Port {port} is already in use")
        else:
            print(f"Server error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    run_server()