'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import { BarChart3, TrendingUp, Users, MousePointer2 } from 'lucide-react';

export default function AnalyticsPage() {
    const stats = [
        { label: 'Total Views', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Unique Visitors', value: '856', change: '+8%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Total Clicks', value: '342', change: '+24%', icon: MousePointer2, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Engagement Rate', value: '28%', change: '+2%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="min-h-screen flex bg-background">
            <DashboardSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-black text-white mb-8">Analytics Overview</h1>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={stat.color} size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                                <p className="text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mock Charts Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-card/80 rounded-2xl p-8 shadow-sm border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-6">Traffic Overview</h3>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-500/10 rounded-t-lg relative group">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600"
                                            style={{ height: `${h}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-sm text-gray-400 font-medium">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </div>

                        <div className="bg-card/80 rounded-2xl p-8 shadow-sm border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-6">Top Locations</h3>
                            <div className="space-y-4">
                                {[
                                    { country: 'United States', percentage: 45 },
                                    { country: 'United Kingdom', percentage: 20 },
                                    { country: 'Canada', percentage: 15 },
                                    { country: 'Germany', percentage: 10 },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between font-medium">
                                            <span className="text-white">{item.country}</span>
                                            <span className="text-gray-400">{item.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
