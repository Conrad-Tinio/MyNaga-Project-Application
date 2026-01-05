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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Aggregated, anonymized analytics for resource demand and usage patterns
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Time Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analyticsData.searchFrequency.reduce((sum, item) => sum + item.searches, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Facilities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{facilities.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Searches/Day</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round(analyticsData.searchFrequency.reduce((sum, item) => sum + item.searches, 0) / 7)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Most Searched Resources */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Searched Resources</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.searchFrequency.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="resource" 
                angle={-45}
                textAnchor="end"
                height={120}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="searches" fill="#0284c7" name="Number of Searches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Demand by Hour */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Demand Patterns by Hour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.demandByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Search Demand', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Facility Utilization</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Searches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.facilityUtilization
                  .sort((a, b) => b.searches - a.searches)
                  .map((facility, index) => {
                    const maxSearches = Math.max(...analyticsData.facilityUtilization.map(f => f.searches));
                    const utilizationPercent = (facility.searches / maxSearches) * 100;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{facility.facility}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{facility.searches.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${utilizationPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{Math.round(utilizationPercent)}%</span>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Privacy Notice</h3>
              <p className="text-sm text-blue-800">
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



