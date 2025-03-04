import React, { useEffect, useState } from 'react';
import { dashboardApi, DashboardMetrics, DocumentStatus, RecentActivity } from '../services/api';

const DashboardPage: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalDocuments: 0,
        successRate: 0,
        averageProcessingTime: 0,
        documentsToday: 0,
        totalAmount: 0,
    });
    const [status, setStatus] = useState<DocumentStatus>({
        pending: 0,
        processed: 0,
        failed: 0,
        inReview: 0,
    });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [metricsData, statusData, activityData] = await Promise.all([
                dashboardApi.getMetrics(),
                dashboardApi.getDocumentStatus(),
                dashboardApi.getRecentActivity(),
            ]);
            setMetrics(metricsData);
            setStatus(statusData);
            setRecentActivity(activityData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Documents</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{metrics.totalDocuments}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{metrics.successRate}%</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Avg Processing Time</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{metrics.averageProcessingTime}s</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
                                        <dd className="text-lg font-semibold text-gray-900">${metrics.totalAmount.toLocaleString()}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Status */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Document Status</h3>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-yellow-800">Pending</div>
                                <div className="mt-1 text-2xl font-semibold text-yellow-900">{status.pending}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-green-800">Processed</div>
                                <div className="mt-1 text-2xl font-semibold text-green-900">{status.processed}</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-red-800">Failed</div>
                                <div className="mt-1 text-2xl font-semibold text-red-900">{status.failed}</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-blue-800">In Review</div>
                                <div className="mt-1 text-2xl font-semibold text-blue-900">{status.inReview}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {recentActivity.map((activity, index) => (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                            {index !== recentActivity.length - 1 && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                        activity.status === 'success' ? 'bg-green-500' :
                                                        activity.status === 'failed' ? 'bg-red-500' :
                                                        activity.status === 'pending' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                                    }`}>
                                                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            {activity.status === 'success' ? (
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            ) : activity.status === 'failed' ? (
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            ) : activity.status === 'pending' ? (
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                            ) : (
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                            )}
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.documentName}
                                                            {activity.amount && <span className="font-medium text-gray-900"> - ${activity.amount.toLocaleString()}</span>}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(activity.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {activity.error && (
                                                        <div className="text-sm text-red-500">
                                                            {activity.error}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 