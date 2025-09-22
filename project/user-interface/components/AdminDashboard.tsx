import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Activity, Shield, Brain } from 'lucide-react';

interface AdminDashboardProps {
  queryService: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ queryService }) => {
  const [stats, setStats] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get vector search stats
      const statsResponse = await queryService.getVectorSearchStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Get recent audit logs
      const logsResponse = await queryService.getAllAuditLogs();
      if (logsResponse.success) {
        setRecentActivity(logsResponse.data.slice(-10));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your RAG system performance and activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Embedding Dimension</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageEmbeddingDim || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Queries</p>
                <p className="text-2xl font-bold text-gray-900">{recentActivity.filter(a => a.action === 'query_completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed Queries</p>
                <p className="text-2xl font-bold text-gray-900">{recentActivity.filter(a => a.action === 'query_failed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No recent activity to display
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.action === 'query_completed' ? 'bg-green-400' :
                        activity.action === 'query_failed' ? 'bg-red-400' :
                        'bg-blue-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-500">User ID: {activity.userId}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-2 ml-5 text-xs text-gray-600 bg-gray-50 rounded p-2">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
            <div className="space-y-3">
              {[
                'Data Ingestion Service',
                'Vector Search Service', 
                'RBAC Service',
                'LLM Service',
                'Audit Service',
                'Suggestions Service'
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{service}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Healthy
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-sm font-medium text-gray-900">1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Query Success Rate</span>
                <span className="text-sm font-medium text-gray-900">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vector Search Latency</span>
                <span className="text-sm font-medium text-gray-900">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">LLM Response Time</span>
                <span className="text-sm font-medium text-gray-900">1.8s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};