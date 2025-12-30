'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import { Save, User, Mail, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen flex bg-background">
            <DashboardSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-black text-white mb-8">Settings</h1>

                    <div className="space-y-6">
                        {/* Profile Settings */}
                        <div className="bg-card/80 rounded-2xl p-8 shadow-sm border border-gray-700">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                                    <p className="text-gray-400 text-sm">Manage your personal information</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-bright-orange" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-bright-orange" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Bio</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-bright-orange h-32" placeholder="Tell us about yourself..." />
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="bg-card/80 rounded-2xl p-8 shadow-sm border border-gray-700">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Account & Security</h2>
                                    <p className="text-gray-400 text-sm">Update your password and security</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                        <input type="email" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-bright-orange" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">New Password</label>
                                    <input type="password" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-bright-orange" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button className="flex items-center gap-2 px-8 py-3 bg-bright-orange text-white rounded-xl font-bold hover:bg-bright-orange/90 transition-all hover:shadow-lg shadow-bright-orange/20">
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
