import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getAnalyticsData, facilities } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Search, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const { isAdmin } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    if (!isAdmin()) return;
    setAnalyticsData(getAnalyticsData());
  }, [isAdmin]);

  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-3">
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
              Data Insights
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Aggregated, anonymized analytics for resource demand and usage patterns
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 card-modern p-5 animate-slide-up">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-modern px-4 py-2.5"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-modern p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Searches</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analyticsData.searchFrequency.reduce((sum, item) => sum + item.searches, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 p-4 rounded-2xl shadow-md">
                <Search className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          <div className="card-modern p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Facilities</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{facilities.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 p-4 rounded-2xl shadow-md">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="card-modern p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg. Searches/Day</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {Math.round(analyticsData.searchFrequency.reduce((sum, item) => sum + item.searches, 0) / 7)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 p-4 rounded-2xl shadow-md">
                <TrendingUp className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Most Searched Resources */}
        <div className="card-modern p-6 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Most Searched Resources</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.searchFrequency.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="resource" 
                angle={-45}
                textAnchor="end"
                height={120}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-prose-bg, white)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
              <Legend 
                wrapperStyle={{ color: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Bar dataKey="searches" fill="#0284c7" name="Number of Searches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Demand by Hour */}
        <div className="card-modern p-6 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Demand Patterns by Hour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.demandByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, fill: 'currentColor' }}
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                label={{ value: 'Search Demand', angle: -90, position: 'insideLeft', fill: 'currentColor' }}
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-prose-bg, white)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
              <Legend 
                wrapperStyle={{ color: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Line 
                type="monotone" 
                dataKey="demand" 
                stroke="#0284c7" 
                strokeWidth={2}
                name="Search Demand"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Facility Utilization */}
        <div className="card-modern p-6 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Facility Utilization</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Searches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Utilization Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.facilityUtilization
                  .sort((a, b) => b.searches - a.searches)
                  .map((facility, index) => {
                    const maxSearches = Math.max(...analyticsData.facilityUtilization.map(f => f.searches));
                    const utilizationPercent = (facility.searches / maxSearches) * 100;
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{facility.facility}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">{facility.searches.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                                style={{ width: `${utilizationPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(utilizationPercent)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="glass bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-600/50 rounded-xl p-5 backdrop-blur-sm animate-fade-in">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">Privacy Notice</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                All analytics data is aggregated and anonymized. No personal medical information is collected or stored. 
                This dashboard provides insights for evidence-based procurement and resource planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;



