import http.server
import socketserver
import json
import urllib.request
import ssl
import time
from urllib.parse import urlparse
from http.client import HTTPResponse
from typing import Dict, List

class TrafficAnalyzer:
    def __init__(self):
        self.traffic_data = []
        self.context = ssl.create_default_context()
        self.context.check_hostname = False
        self.context.verify_mode = ssl.CERT_NONE

    def analyze_url(self, url: str) -> Dict:
        start_time = time.time()
        try:
            parsed_url = urlparse(url)
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError("Invalid URL format")
                
            protocol = parsed_url.scheme.upper()
            
            # Set up request headers to mimic a browser
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            req = urllib.request.Request(url, headers=headers)
            
            if protocol == "HTTPS":
                response = urllib.request.urlopen(req, context=self.context, timeout=10)
            else:
                response = urllib.request.urlopen(req, timeout=10)
            
            end_time = time.time()
            response_time = int((end_time - start_time) * 1000)
            
            entry = {
                "id": str(int(time.time() * 1000)),
                "domain": parsed_url.netloc,
                "protocol": protocol,
                "requestCount": 1,
                "responseTime": response_time,
                "status": response.status,
                "timestamp": time.strftime("%H:%M:%S")
            }
            
            self.traffic_data.insert(0, entry)
            self.traffic_data = self.traffic_data[:10]
            
            return {"success": True, "data": entry}
            
        except ValueError as e:
            return {
                "success": False,
                "error": str(e)
            }
        except urllib.error.URLError as e:
            return {
                "success": False,
                "error": f"Failed to connect: {str(e.reason)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"An error occurred: {str(e)}"
            }

    def get_traffic_data(self) -> List[Dict]:
        return self.traffic_data

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    analyzer = TrafficAnalyzer()
    
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
            
            if self.path == '/analyze':
                result = self.analyzer.analyze_url(data['url'])
                
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
        if self.path == '/data':
            data = self.analyzer.get_traffic_data()
            
            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        else:
            super().do_GET()

def run_server():
    port = 8000
    server_address = ('', port)
    
    try:
        with socketserver.TCPServer(server_address, RequestHandler) as httpd:
            print(f"Server running on port {port}")
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