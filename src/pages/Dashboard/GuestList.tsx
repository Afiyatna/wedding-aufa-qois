import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Trash2, Edit, MessageCircle, FileText, Copy, Check, ChevronUp, ChevronDown, Filter, X, Clock } from 'lucide-react';

type Guest = {
    id: string;
    name: string;
    slug: string;
    phone?: string;

    category?: string;
    rsvp_status?: string;
    session_id?: string;
    reception_sessions?: {
        name: string;
        time_display: string;
    };
};

type Category = {
    id: string;
    name: string;
};

type Session = {
    id: string;
    name: string;
    time_display: string;
};

type SortConfig = {
    key: keyof Guest | 'status';
    direction: 'asc' | 'desc';
};

export default function GuestList() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at' as any, direction: 'desc' });
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', category: 'General', session_id: '' });

    const [waTemplate, setWaTemplate] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Batch Input State
    const [batchGuests, setBatchGuests] = useState<{ name: string; phone: string }[]>(
        Array(5).fill({ name: '', phone: '' })
    );
    const [batchCategory, setBatchCategory] = useState('General');
    const [batchSession, setBatchSession] = useState('');

    useEffect(() => {
        fetchGuests();
        fetchCategories();
        fetchSessions();
        fetchTemplate();
    }, []);

    const fetchTemplate = async () => {
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'wa_template').single();
        if (data && data.value) {
            setWaTemplate(data.value);
        } else {
            // Default fallback if DB is empty
            const defaultTemplate = `Assalamualaikum Wr. Wb.
      
Kepada Yth. Bapak/Ibu/Saudara/i {name},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.

Berikut link undangan untuk info lengkap:
{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Wassalamualaikum Wr. Wb.`;
            setWaTemplate(defaultTemplate);
        }
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from('guest_categories').select('*').order('name', { ascending: true });
        if (data) setCategories(data);
    };

    const fetchSessions = async () => {
        const { data } = await supabase.from('reception_sessions').select('*').order('name', { ascending: true });
        if (data && data.length > 0) {
            setSessions(data);
            // Set default session for batch form if needed
            setBatchSession(data[0].id);
        }
    };

    const fetchGuests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('guests')
            .select('*, reception_sessions(name, time_display)')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching guests:', error);
        if (data) setGuests(data);
        setLoading(false);
    };

    const handleCreateSlug = (name: string) => {
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const randomString = Math.random().toString(36).substring(2, 6);
        return `${baseSlug}-${randomString}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const slug = handleCreateSlug(formData.name);
        const submitData = {
            name: formData.name,
            slug,
            phone: formData.phone || null, // Allow null
            category: formData.category,
            session_id: formData.session_id || null
        };

        if (isEditMode && editId) {
            const { error } = await supabase
                .from('guests')
                .update(submitData)
                .eq('id', editId);
            if (!error) {
                fetchGuests();
                closeModal();
            } else {
                alert('Gagal: ' + error.message);
            }
        } else {
            const { error } = await supabase
                .from('guests')
                .insert([submitData]);
            if (!error) {
                fetchGuests();
                closeModal();
            } else {
                alert('Gagal: ' + error.message);
            }
        }
    };

    const handleBatchChange = (index: number, field: 'name' | 'phone', value: string) => {
        const newBatch = [...batchGuests];
        newBatch[index] = { ...newBatch[index], [field]: value };
        setBatchGuests(newBatch);
    };

    const handleAddRow = () => {
        setBatchGuests([...batchGuests, { name: '', phone: '' }]);
    };

    const handleMultiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const validRows = batchGuests.filter(row => row.name.trim() !== '');

        if (validRows.length === 0) {
            alert('Silakan isi minimal satu nama tamu.');
            setLoading(false);
            return;
        }

        const guestsToInsert = validRows.map(row => ({
            name: row.name.trim(),
            slug: handleCreateSlug(row.name.trim()),
            phone: row.phone.trim() || null,
            category: batchCategory,
            session_id: batchSession || null
        }));

        const { error } = await supabase.from('guests').insert(guestsToInsert);

        if (!error) {
            fetchGuests();
            closeMultiModal();
        } else {
            alert('Gagal: ' + error.message);
        }
        setLoading(false);
    };

    // --- Category & Template Handlers REMOVED (Moved to Settings.tsx) ---

    const closeMultiModal = () => {
        setIsMultiModalOpen(false);
        setBatchGuests(Array(5).fill({ name: '', phone: '' })); // Reset to 5 empty rows
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah anda yakin ingin menghapus tamu ini?')) return;
        const { error } = await supabase.from('guests').delete().eq('id', id);
        if (!error) fetchGuests();
    };

    const openEditModal = (guest: Guest) => {
        setFormData({
            name: guest.name,
            phone: guest.phone || '',
            category: guest.category || 'General',
            session_id: guest.session_id || ''
        });
        setIsEditMode(true);
        setEditId(guest.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', category: 'General', session_id: '' });
        setIsEditMode(false);
        setEditId(null);
    };

    const generateLink = (guestId: string) => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/?u=${guestId}`;
    };

    const generateMessage = (guest: Guest) => {
        const link = generateLink(guest.id);
        let text = waTemplate;
        text = text.replace('{name}', guest.name);
        text = text.replace('{link}', link);
        return text;
    };

    const sendWA = (guest: Guest) => {
        if (!guest.phone) {
            // If no phone, maybe just copy? But user asked for copy button separate.
            // alert('Nomor HP tidak ada!');
            // return;
        }

        const text = generateMessage(guest);
        const encodedText = encodeURIComponent(text);

        if (guest.phone) {
            let phone = guest.phone.replace(/[^0-9]/g, '');
            if (phone.startsWith('0')) phone = '62' + phone.substring(1);
            window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
        } else {
            // Fallback if they click WA icon but no phone -> maybe open WA blank?
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    };

    const handleCopyMessage = (guest: Guest) => {
        const text = generateMessage(guest);
        navigator.clipboard.writeText(text);
        setCopiedId(guest.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'hadir':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hadir</span>;
            case 'tidak_hadir':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Tidak Hadir</span>;
            case 'bimbang':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Mungkin</span>;
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Belum Konfirmasi</span>;
        }
    };

    const handleSort = (key: keyof Guest | 'status') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredGuests = guests
        .filter(g => {
            const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || (g.category || 'General') === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            const aValue = a[sortConfig.key as keyof Guest] || '';
            const bValue = b[sortConfig.key as keyof Guest] || '';

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="hidden sm:inline text-3xl font-black text-gray-900">Daftar Tamu</h2>
                    <h2 className="sm:hidden text-3xl font-black text-gray-900">Tamu</h2>
                    <p className="mt-2 text-sm text-gray-600">Kelola Data Tamu</p>
                </div>
                {/* <div className="flex flex-col md:flex-row gap-2"> */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-rose-700 transition-colors"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Tambah Tamu</span>
                        <span className="sm:hidden">Tambah</span>
                    </button>
                    <button
                        onClick={() => setIsMultiModalOpen(true)}
                        className="bg-white text-gray-700 ring-1 ring-inset ring-gray-300 px-4 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <FileText size={18} />
                        <span className="hidden sm:inline">Batch Input</span>
                        <span className="sm:hidden">Batch</span>
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama tamu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                </div>

                <div className="relative">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full md:w-48 appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
                    >
                        <option value="All">Semua Kategori</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-4 w-16 text-center font-semibold text-gray-600">WA</th>

                                <th
                                    className="px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Nama
                                        {sortConfig.key === 'name' && (
                                            sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                        )}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className="flex items-center gap-1">
                                        Kategori
                                        {sortConfig.key === 'category' && (
                                            sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                        )}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-4 font-semibold text-gray-600 text-center cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                                    onClick={() => handleSort('rsvp_status')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Status
                                        {sortConfig.key === 'rsvp_status' && (
                                            sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                        )}
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold text-gray-600">Sesi</th>

                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Link</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr><td colSpan={6} className="p-6 text-center text-gray-500">Tidak ada data tamu.</td></tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => sendWA(guest)}
                                                title={guest.phone ? "Kirim WA" : "Nomor HP Kosong"}
                                                className={`p-2 rounded-xl transition-colors inline-flex ${guest.phone ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                disabled={!guest.phone}
                                            >
                                                <MessageCircle size={20} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{guest.name}</div>
                                            <div className="text-sm text-gray-500">{guest.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                {guest.category || 'General'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(guest.rsvp_status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {guest.reception_sessions ? (
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <span>{guest.reception_sessions.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCopyMessage(guest)}
                                                    className={`p-1.5 rounded-lg transition-all ${copiedId === guest.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                    title="Copy Pesan WhatsApp"
                                                >
                                                    {copiedId === guest.id ? <Check size={14} /> : <Copy size={14} />}
                                                </button>
                                                <a target="_blank" href={generateLink(guest.id)} className="text-sm text-blue-600 max-w-[150px] truncate md:max-w-[200px] block hover:underline">
                                                    {generateLink(guest.id)}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(guest)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(guest.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Tamu' : 'Tambah Tamu Baru'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tamu</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Contoh: Bpk. Fulan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Opsional)</label>
                                    <input
                                        type="number"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Contoh: 08123456789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none"
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700`} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sesi Resepsi</label>
                                    <div className="relative">
                                        <select
                                            value={formData.session_id}
                                            onChange={e => setFormData({ ...formData, session_id: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none"
                                        >
                                            <option value="">Pilih Sesi</option>
                                            {sessions.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.time_display})</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700`} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Multi Input Modal */}
                {isMultiModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99 py-0 px-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[75vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Input Banyak Tamu</h3>
                                <button onClick={closeMultiModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleMultiSubmit} className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4 border border-blue-200">
                                    <p className="font-semibold mb-1">Panduan:</p>
                                    <ul className="list-disc list-inside">
                                        <li><strong>Nama wajib diisi</strong>. Nomor HP opsional.</li>
                                        <li>Format Nomor HP (08xx, 62xx).</li>
                                        <li>Baris yang kosong akan diabaikan.</li>
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kategori untuk Batch Ini</label>
                                    <div className="relative">
                                        <select
                                            value={batchCategory}
                                            onChange={(e) => setBatchCategory(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white appearance-none"
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700`} />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sesi Resepsi untuk Batch Ini</label>
                                    <div className="relative mb-6">
                                        <select
                                            value={batchSession}
                                            onChange={(e) => setBatchSession(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white appearance-none"
                                        >
                                            <option value="">Pilih Sesi</option>
                                            {sessions.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.time_display})</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700`} />
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 pb-2 border-b">
                                        <div className="col-span-1 text-center">#</div>
                                        <div className="col-span-6">Nama Tamu</div>
                                        <div className="col-span-5">WhatsApp</div>
                                    </div>

                                    {batchGuests.map((guest, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-1 text-center font-mono text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="col-span-6">
                                                <input
                                                    type="text"
                                                    value={guest.name}
                                                    onChange={e => handleBatchChange(index, 'name', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                                                    placeholder="Nama Tamu"
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <input
                                                    type="number"
                                                    value={guest.phone}
                                                    onChange={e => handleBatchChange(index, 'phone', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                                                    placeholder="08xxxxxxxx"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddRow}
                                        className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-rose-500 hover:text-rose-500 transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        <Plus size={18} />
                                        Tambah Tamu
                                    </button>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={closeMultiModal}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium shadow-sm shadow-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Menyimpan...' : 'Simpan Semua'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
