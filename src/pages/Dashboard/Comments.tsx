import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, MessageSquare, Search } from 'lucide-react';

type Comment = {
    id: string;
    name: string;
    message: string;
    created_at: string;
    attendance: string;
};

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('rsvp_responses')
            .select('*')
            .not('message', 'is', null) // Filter only rows with messages if needed, though usually all RSDP have messages or we handle empty ones
            .neq('message', '')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
        } else {
            setComments(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah anda yakin ingin menghapus ucapan ini?')) return;

        const { error } = await supabase
            .from('rsvp_responses')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Gagal menghapus: ' + error.message);
        } else {
            fetchComments();
        }
    };

    const filteredComments = comments.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ucapan & Doa</h2>
                    <p className="mt-1 text-sm text-gray-600">Kelola ucapan dari tamu undangan</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari nama atau isi pesan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
            </div>

            {/* List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : filteredComments.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">Belum ada ucapan masuk.</p>
                    </div>
                ) : (
                    filteredComments.map((comment) => (
                        <div key={comment.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-900">{comment.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${comment.attendance === 'yes' ? 'bg-green-100 text-green-700' :
                                            comment.attendance === 'no' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {comment.attendance === 'yes' ? 'Hadir' :
                                                comment.attendance === 'no' ? 'Tidak Hadir' : 'Mungkin'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 whitespace-pre-wrap">{comment.message}</p>
                                    <p className="text-xs text-gray-400 mt-3">{formatDate(comment.created_at)}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Ucapan"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
