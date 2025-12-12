import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, Home, LogOut, MessageSquare } from 'lucide-react';

export default function DashboardLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check auth status
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/login');
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Wedding Dashboard</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-rose-50 text-rose-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Home size={20} />
                        <span className="font-medium">Overview</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/guests"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-rose-50 text-rose-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Users size={20} />
                        <span className="font-medium">Buku Tamu</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/comments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-rose-50 text-rose-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <span className="flex-shrink-0"><MessageSquare size={20} /></span>
                        <span className="font-medium">Ucapan</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-50 px-4 py-5 flex justify-center items-center">
                <h1 className="font-bold text-gray-800">Wedding Dashboard</h1>
                <button onClick={handleLogout} className="text-red-600 absolute right-4">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 mb-20 md:mb-0 overflow-y-auto">
                <Outlet />
            </main>

            {/* Mobile Bottom Navbar */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center px-4 py-3 pb-safe">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive
                            ? 'text-rose-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`
                    }
                >
                    <Home size={24} strokeWidth={2} />
                    <span>Overview</span>
                </NavLink>

                <NavLink
                    to="/dashboard/guests"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive
                            ? 'text-rose-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`
                    }
                >
                    <Users size={24} strokeWidth={2} />
                    <span>Tamu</span>
                </NavLink>

                <NavLink
                    to="/dashboard/comments"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive
                            ? 'text-rose-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`
                    }
                >
                    <MessageSquare size={24} strokeWidth={2} />
                    <span>Ucapan</span>
                </NavLink>
            </nav>
        </div>
    );
}
