import React from 'react';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalyticsSummary {
  pageviews: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  traffic_sources: Record<string, number>;
  top_pages: Array<{ url: string; count: number }>;
  device_breakdown: Record<string, number>;
  time_range: string;
}

interface SEOMetrics {
  load_time: number;
  core_web_vitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  keyword_rankings: Record<string, number>;
  backlinks_count: number;
  seo_score: number;
}

interface ConversionFunnel {
  funnel_name: string;
  steps: Array<{
    step: string;
    visitors: number;
    conversion_rate: number;
  }>;
  total_conversion_rate: number;
}

interface AnalyticsTableProps {
  analyticsSummary: AnalyticsSummary | null;
  seoMetrics: SEOMetrics | null;
  conversionFunnel: ConversionFunnel | null;
  isLoading: boolean;
}

export const AnalyticsTable: React.FC<AnalyticsTableProps> = ({
  analyticsSummary,
  seoMetrics,
  conversionFunnel,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsSummary) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value <= thresholds.poor) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  // Helper to map qualityScore (0-100) to Tailwind width class
  const getWidthClass = (score: number) => {
    if (score >= 95) return 'w-full';
    if (score >= 85) return 'w-5/6';
    if (score >= 75) return 'w-4/6';
    if (score >= 60) return 'w-3/6';
    if (score >= 40) return 'w-2/6';
    if (score >= 20) return 'w-1/6';
    return 'w-1/12';
  };

  return (
    <div className="space-y-6">
      {/* Top Pages Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Top Pages Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pageviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsSummary.top_pages.map((page, index) => {
                const percentage = ((page.count / analyticsSummary.pageviews) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="max-w-xs truncate" title={page.url}>
                        {page.url}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {page.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
                        )}
                        <span className={`text-sm ${index < 3 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {index < 3 ? 'High' : 'Medium'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Sources Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Traffic Sources Analysis
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(analyticsSummary.traffic_sources).map(([source, count], index) => {
                const percentage = ((count / analyticsSummary.unique_visitors) * 100).toFixed(1);
                const qualityScore = source === 'Direct' ? 95 : source === 'Organic' ? 85 : source === 'Referral' ? 75 : 60;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`bg-blue-600 h-2 rounded-full ${getWidthClass(qualityScore)}`}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{qualityScore}/100</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Metrics Table */}
      {seoMetrics && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              SEO Performance Metrics
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Page Load Time
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seoMetrics.load_time}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIcon(seoMetrics.load_time, { good: 1000, poor: 3000 })}
                      <span className={`text-sm ml-1 ${getPerformanceColor(seoMetrics.load_time, { good: 1000, poor: 3000 })}`}>
                        {seoMetrics.load_time <= 1000 ? 'Good' : seoMetrics.load_time <= 3000 ? 'Needs Improvement' : 'Poor'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {seoMetrics.load_time > 1000 ? 'Optimize images and reduce server response time' : 'Excellent performance'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Largest Contentful Paint (LCP)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seoMetrics.core_web_vitals.lcp}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIcon(seoMetrics.core_web_vitals.lcp, { good: 2500, poor: 4000 })}
                      <span className={`text-sm ml-1 ${getPerformanceColor(seoMetrics.core_web_vitals.lcp, { good: 2500, poor: 4000 })}`}>
                        {seoMetrics.core_web_vitals.lcp <= 2500 ? 'Good' : seoMetrics.core_web_vitals.lcp <= 4000 ? 'Needs Improvement' : 'Poor'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {seoMetrics.core_web_vitals.lcp > 2500 ? 'Optimize largest content element loading' : 'Good user experience'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    First Input Delay (FID)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seoMetrics.core_web_vitals.fid}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIcon(seoMetrics.core_web_vitals.fid, { good: 100, poor: 300 })}
                      <span className={`text-sm ml-1 ${getPerformanceColor(seoMetrics.core_web_vitals.fid, { good: 100, poor: 300 })}`}>
                        {seoMetrics.core_web_vitals.fid <= 100 ? 'Good' : seoMetrics.core_web_vitals.fid <= 300 ? 'Needs Improvement' : 'Poor'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {seoMetrics.core_web_vitals.fid > 100 ? 'Reduce JavaScript execution time' : 'Responsive interface'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Cumulative Layout Shift (CLS)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seoMetrics.core_web_vitals.cls}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIcon(seoMetrics.core_web_vitals.cls, { good: 0.1, poor: 0.25 })}
                      <span className={`text-sm ml-1 ${getPerformanceColor(seoMetrics.core_web_vitals.cls, { good: 0.1, poor: 0.25 })}`}>
                        {seoMetrics.core_web_vitals.cls <= 0.1 ? 'Good' : seoMetrics.core_web_vitals.cls <= 0.25 ? 'Needs Improvement' : 'Poor'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {seoMetrics.core_web_vitals.cls > 0.1 ? 'Fix layout shifts and reserve space for images' : 'Stable layout'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Backlinks Count
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seoMetrics.backlinks_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIcon(seoMetrics.backlinks_count, { good: 100, poor: 10 })}
                      <span className={`text-sm ml-1 ${getPerformanceColor(seoMetrics.backlinks_count, { good: 100, poor: 10 })}`}>
                        {seoMetrics.backlinks_count >= 100 ? 'Excellent' : seoMetrics.backlinks_count >= 10 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {seoMetrics.backlinks_count < 100 ? 'Build quality backlinks from authoritative sites' : 'Strong backlink profile'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conversion Funnel Table */}
      {conversionFunnel && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Conversion Funnel Analysis
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funnel Step
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drop-off
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conversionFunnel.steps.map((step, index) => {
                  const dropOff = index === 0 ? 0 : 
                    ((conversionFunnel.steps[index - 1].visitors - step.visitors) / conversionFunnel.steps[index - 1].visitors * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {step.step}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {step.visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {step.conversion_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index === 0 ? '-' : `${dropOff}%`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {step.conversion_rate >= 80 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                          ) : step.conversion_rate >= 50 ? (
                            <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm ${
                            step.conversion_rate >= 80 ? 'text-green-600' : 
                            step.conversion_rate >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {step.conversion_rate >= 80 ? 'Excellent' : 
                             step.conversion_rate >= 50 ? 'Good' : 'Needs Optimization'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Conversion Rate:</span>
              <span className="text-lg font-bold text-blue-600">{conversionFunnel.total_conversion_rate}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};