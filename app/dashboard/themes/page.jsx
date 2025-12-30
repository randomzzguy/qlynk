'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getAllThemes } from '@/lib/themeRegistry';
import ThemeCard from '@/components/ThemeCard';
import { Search } from 'lucide-react';

export default function ThemesPage() {
    const [selectedTheme, setSelectedTheme] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const themes = getAllThemes();

    const filteredThemes = themes.filter(theme =>
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-background">
            <DashboardSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2">Theme Library</h1>
                            <p className="text-gray-400">Browse and preview available themes</p>
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search themes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-gray-700 text-white focus:outline-none focus:border-bright-orange transition-colors placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredThemes.map((theme) => (
                            <ThemeCard
                                key={theme.id}
                                theme={theme}
                                selected={selectedTheme === theme.id}
                                onClick={() => setSelectedTheme(theme.id)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
