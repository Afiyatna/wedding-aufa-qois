import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export default function Overview() {
    const [stats, setStats] = useState({
        totalGuests: 0,
        totalComments: 0,
        attending: 0,
        notAttending: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch guests count
            const { count: guestCount } = await supabase
                .from('guests')
                .select('*', { count: 'exact', head: true });

            // Fetch responses
            const { data: responses } = await supabase
                .from('rsvp_responses')
                .select('attendance, message');

            const totalComments = responses?.filter(r => r.message && r.message.trim() !== '').length || 0;
            const attending = responses?.filter(r => r.attendance === 'yes').length || 0;
            const notAttending = responses?.filter(r => r.attendance === 'no').length || 0;
            const pending = responses?.filter(r => r.attendance === 'maybe').length || 0;

            setStats({
                totalGuests: guestCount || 0,
                totalComments,
                attending,
                notAttending,
                pending
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tamu"
                    value={stats.totalGuests}
                    icon={<Users size={24} className="text-blue-500" />}
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Hadir"
                    value={stats.attending}
                    icon={<CheckCircle size={24} className="text-green-500" />}
                    bg="bg-green-50"
                />
                <StatCard
                    title="Tidak Hadir"
                    value={stats.notAttending}
                    icon={<XCircle size={24} className="text-red-500" />}
                    bg="bg-red-50"
                />
                <StatCard
                    title="Ucapan Masuk"
                    value={stats.totalComments}
                    icon={<MessageSquare size={24} className="text-purple-500" />}
                    bg="bg-purple-50"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex justify-between">
                <p className="text-2xl font-bold text-gray-900 mt-1 self-center">{value}</p>
                <div className={`p-3 rounded-lg ${bg} self-end`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
