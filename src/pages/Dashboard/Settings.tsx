import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, Clock, Tag, MessageSquare, Loader2, Edit } from 'lucide-react';

interface Session {
    id: string;
    name: string;
    time_display: string;
}

interface Category {
    id: string;
    name: string;
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'sessions' | 'categories' | 'template'>('sessions');
    const [loading, setLoading] = useState(true);

    // Data States
    const [sessions, setSessions] = useState<Session[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [templateText, setTemplateText] = useState('');

    // Form States
    const [newSessionName, setNewSessionName] = useState('');
    const [newSessionTime, setNewSessionTime] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Edit States
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessionsRes, categoriesRes, templateRes] = await Promise.all([
                supabase.from('reception_sessions').select('*').order('name', { ascending: true }),
                supabase.from('guest_categories').select('*').order('name', { ascending: true }),
                supabase.from('app_settings').select('value').eq('key', 'wa_template').single()
            ]);

            if (sessionsRes.data) setSessions(sessionsRes.data);
            if (categoriesRes.data) setCategories(categoriesRes.data);
            if (templateRes.data) {
                setTemplateText(templateRes.data.value);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Session Handlers ---
    const handleSaveSession = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = editingSession ? editingSession.name : newSessionName;
        const time = editingSession ? editingSession.time_display : newSessionTime;

        if (!name.trim() || !time.trim()) return;

        setIsSaving(true);
        if (editingSession) {
            const { error } = await supabase
                .from('reception_sessions')
                .update({ name, time_display: time })
                .eq('id', editingSession.id);

            if (error) {
                alert('Gagal update sesi');
            } else {
                setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, name, time_display: time } : s));
                setEditingSession(null);
            }
        } else {
            const { data, error } = await supabase
                .from('reception_sessions')
                .insert([{ name, time_display: time }])
                .select()
                .single();

            if (error) {
                alert('Gagal menambah sesi');
            } else if (data) {
                setSessions([...sessions, data]);
                setNewSessionName('');
                setNewSessionTime('');
            }
        }
        setIsSaving(false);
    };

    const startEditSession = (session: Session) => {
        setEditingSession(session);
        // We use the state in the edit form section or the main form? 
        // Let's reuse the main form inputs or make a specific edit mode. 
        // For simplicity, let's just populate the main form inputs? 
        // No, user wants to edit "data yang sudah ada". 
        // Better UX: Inline edit or populate the 'Add' form and change button to 'Update'.
        // Let's use the Populate 'Add' form approach for simplicity but change label.
        setNewSessionName(session.name);
        setNewSessionTime(session.time_display);
    };

    const cancelEditSession = () => {
        setEditingSession(null);
        setNewSessionName('');
        setNewSessionTime('');
    };

    const handleDeleteSession = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus sesi ini?')) return;

        const { error } = await supabase.from('reception_sessions').delete().eq('id', id);
        if (error) {
            alert('Gagal menghapus sesi. Pastikan tidak ada tamu yang menggunakan sesi ini.');
        } else {
            setSessions(sessions.filter(s => s.id !== id));
        }
    };

    // --- Category Handlers ---
    // --- Category Handlers ---
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = editingCategory ? editingCategory.name : newCategoryName;
        if (!name.trim()) return;

        setIsSaving(true);
        if (editingCategory) {
            const { error } = await supabase
                .from('guest_categories')
                .update({ name })
                .eq('id', editingCategory.id);

            if (error) {
                alert('Gagal update kategori');
            } else {
                setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name } : c));
                setEditingCategory(null);
            }
        } else {
            const { data, error } = await supabase
                .from('guest_categories')
                .insert([{ name }])
                .select()
                .single();

            if (error) {
                alert('Gagal menambah kategori');
            } else if (data) {
                setCategories([...categories, data]);
                setNewCategoryName('');
            }
        }
        setIsSaving(false);
    };

    const startEditCategory = (category: Category) => {
        setEditingCategory(category);
    };

    const cancelEditCategory = () => {
        setEditingCategory(null);
        setNewCategoryName('');
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (!confirm(`Hapus kategori "${name}"?`)) return;

        // Check validation first (optional, backend usually handles constraint errors)
        const { count } = await supabase
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id);

        if (count && count > 0) {
            alert(`Tidak dapat menghapus kategori "${name}" karena sedang digunakan oleh ${count} tamu.`);
            return;
        }

        const { error } = await supabase.from('guest_categories').delete().eq('id', id);
        if (error) alert('Gagal menghapus kategori');
        else setCategories(categories.filter(c => c.id !== id));
    };

    // --- Template Handlers ---
    const handleSaveTemplate = async () => {
        setIsSaving(true);

        // Always usage upsert on app_settings for now
        const { error } = await supabase
            .from('app_settings')
            .upsert({ key: 'wa_template', value: templateText });

        if (error) alert('Gagal menyimpan template');
        else alert('Template berhasil disimpan!');

        setIsSaving(false);
    };


    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-rose-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
                <p className="text-gray-500">Kelola sesi resepsi, kategori tamu, dan template pesan.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200">
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'sessions' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Clock size={16} /> Resepsi
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'categories' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Tag size={16} /> Kategori
                </button>
                <button
                    onClick={() => setActiveTab('template')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'template' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <MessageSquare size={16} /> WA Template
                </button>
            </div>

            {/* Content - Sessions */}
            {activeTab === 'sessions' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Daftar Sesi Resepsi</h2>
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">{session.name}</p>
                                        <p className="text-sm text-gray-500">{session.time_display}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => startEditSession(session)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSession(session.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {sessions.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Belum ada sesi dibuat</p>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">{editingSession ? 'Edit Sesi' : 'Tambah Sesi Baru'}</h3>
                        <form onSubmit={handleSaveSession} className="flex flex-col md:flex-row gap-3 md:items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-gray-500">Nama Sesi</label>
                                <input
                                    type="text"
                                    value={editingSession ? editingSession.name : newSessionName}
                                    onChange={(e) => editingSession ? setEditingSession({ ...editingSession, name: e.target.value }) : setNewSessionName(e.target.value)}
                                    placeholder="Contoh: Sesi 1 / Keluarga"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-gray-500">Jam Display</label>
                                <input
                                    type="text"
                                    value={editingSession ? editingSession.time_display : newSessionTime}
                                    onChange={(e) => editingSession ? setEditingSession({ ...editingSession, time_display: e.target.value }) : setNewSessionTime(e.target.value)}
                                    placeholder="Contoh: 11:00 - 13:00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                {editingSession && (
                                    <button
                                        type="button"
                                        onClick={cancelEditSession}
                                        className="mt-3 md:mt-0 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="mt-3 md:mt-0 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    <Save size={16} /> {editingSession ? 'Update' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content - Categories */}
            {activeTab === 'categories' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Kategori Tamu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="font-medium text-gray-700">{cat.name}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => startEditCategory(cat)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Kategori"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="pt-4 border-t border-gray-100">
                            <form onSubmit={handleSaveCategory} className="flex gap-2">
                                <input
                                    type="text"
                                    value={editingCategory ? editingCategory.name : newCategoryName}
                                    onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategoryName(e.target.value)}
                                    placeholder={editingCategory ? "Edit Nama Kategori" : "Nama Kategori Baru"}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={cancelEditCategory}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSaving || (!newCategoryName && !editingCategory)}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Plus size={18} /> {editingCategory ? 'Update' : 'Tambah'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Content - WA Template */}
            {activeTab === 'template' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Template WhatsApp</h2>
                        <button
                            onClick={handleSaveTemplate}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>

                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4 text-sm">
                        <p className="font-medium mb-1">Panduan Variabel:</p>
                        <ul className="list-disc list-inside space-y-1 opacity-90">
                            <li><code>{'{name}'}</code> : Nama Tamu</li>
                            <li><code>{'{link}'}</code> : Link Undangan Unik</li>
                        </ul>
                    </div>

                    <textarea
                        value={templateText}
                        onChange={(e) => setTemplateText(e.target.value)}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors bg-gray-50 text-base"
                        placeholder="Tulis template pesan di sini..."
                    />
                </div>
            )}
        </div>
    );
}
