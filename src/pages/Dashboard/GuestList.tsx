import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Trash2, Edit, MessageCircle, FileText } from 'lucide-react';

type Guest = {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    category?: string;
    rsvp_status?: string;
};

export default function GuestList() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', category: 'General' });
    const [waTemplate, setWaTemplate] = useState('');
    const [templateText, setTemplateText] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Batch Input State
    const [batchGuests, setBatchGuests] = useState<{ name: string; phone: string }[]>(
        Array(5).fill({ name: '', phone: '' })
    );

    useEffect(() => {
        fetchGuests();
        fetchTemplate();
    }, []);

    const fetchTemplate = async () => {
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'wa_template').single();
        if (data && data.value) {
            setWaTemplate(data.value);
            setTemplateText(data.value);
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
            setTemplateText(defaultTemplate);
        }
    };

    const fetchGuests = async () => {
        setLoading(true);
        const { data } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
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

        if (isEditMode && editId) {
            const { error } = await supabase
                .from('guests')
                .update({ name: formData.name, slug, phone: formData.phone, category: formData.category })
                .eq('id', editId);
            if (!error) {
                fetchGuests();
                closeModal();
                // alert('Data tamu berhasil diperbarui.');
            } else {
                if (error.code === '23505') {
                    if (error.message.includes('phone')) alert('Gagal: Nomor WhatsApp sudah digunakan tamu lain.');
                    else alert('Gagal: Data duplikat.');
                } else {
                    alert('Terjadi kesalahan: ' + error.message);
                }
            }
        } else {
            const { error } = await supabase
                .from('guests')
                .insert([{ name: formData.name, slug, phone: formData.phone, category: formData.category }]);
            if (!error) {
                fetchGuests();
                closeModal();
                // alert('Tamu berhasil ditambahkan.');
            } else {
                if (error.code === '23505') {
                    if (error.message.includes('phone')) alert('Gagal: Nomor WhatsApp sudah terdaftar.');
                    else alert('Gagal: Data duplikat.');
                } else {
                    alert('Terjadi kesalahan: ' + error.message);
                }
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

        // Filter out empty rows
        const validRows = batchGuests.filter(row => row.name.trim() !== '' || row.phone.trim() !== '');

        if (validRows.length === 0) {
            alert('Silakan isi minimal satu data tamu.');
            setLoading(false);
            return;
        }

        // Validate mandatory fields
        const invalidRow = validRows.find(row => row.name.trim() === '' || row.phone.trim() === '');
        if (invalidRow) {
            alert('Gagal: Nama dan Nomor HP wajib diisi untuk setiap baris yang digunakan.');
            setLoading(false);
            return;
        }

        const guestsToInsert = validRows.map(row => ({
            name: row.name.trim(),
            slug: handleCreateSlug(row.name.trim()),
            phone: row.phone.trim(),
            category: 'General'
        }));

        const { error } = await supabase.from('guests').insert(guestsToInsert);

        if (!error) {
            fetchGuests();
            closeMultiModal();
            // alert('Batch input berhasil!');
        } else {
            console.error(error);
            if (error.code === '23505') {
                if (error.message.includes('phone')) {
                    alert('Gagal: Salah satu Nomor WhatsApp sudah terdaftar.');
                } else {
                    alert('Gagal: Data duplikat ditemukan.');
                }
            } else {
                alert('Terjadi kesalahan: ' + error.message);
            }
        }
        setLoading(false);
    };

    const handleSaveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase
            .from('app_settings')
            .upsert({ key: 'wa_template', value: templateText });

        if (!error) {
            setWaTemplate(templateText);
            setIsTemplateModalOpen(false);
            // alert('Template berhasil disimpan!');
        } else {
            alert('Error saving template: ' + error.message);
        }
        setLoading(false);
    };

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
        setFormData({ name: guest.name, phone: guest.phone || '', category: guest.category || 'General' });
        setIsEditMode(true);
        setEditId(guest.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', category: 'General' });
        setIsEditMode(false);
        setEditId(null);
    };

    const generateLink = (guestId: string) => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/?u=${guestId}`;
    };

    const sendWA = (guest: Guest) => {
        if (!guest.phone) return alert('Nomor HP tidak ada!');

        const link = generateLink(guest.id);

        let text = waTemplate;
        text = text.replace('{name}', guest.name);
        text = text.replace('{link}', link);

        const encodedText = encodeURIComponent(text);
        // Ensure phone number has country code. Remove leading 0 and add 62
        let phone = guest.phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
        }

        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
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

    const filteredGuests = guests.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="hidden sm:inline text-3xl font-black text-gray-900">Daftar Tamu</h2>
                    <h2 className="sm:hidden text-3xl font-black text-gray-900">Tamu</h2>
                    <p className="mt-2 text-sm text-gray-600">Kelola Data Tamu</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-rose-600 transition-colors"
                    >
                        {/* <Plus size={18} /> */}
                        <span className="hidden sm:inline">Tambah Tamu</span>
                        <span className="sm:hidden">Tambah</span>
                    </button>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => setIsTemplateModalOpen(true)}
                            // inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-2 text-md bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4 py-2 flex-1
                            className="bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4 py-2 flex-1 rounded-lg flex items-center gap-2 transition-colors"
                            title="Edit Template WA"
                        >
                            {/* <Edit size={18} /> */}
                            <span className="hidden sm:inline">Template WA</span>
                            <span className="sm:hidden">Template</span>
                        </button>
                        <button
                            onClick={() => setIsMultiModalOpen(true)}
                            className="bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            {/* <FileText size={18} /> */}
                            <span className="hidden sm:inline">Batch Input</span>
                            <span className="sm:hidden">Batch</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari nama tamu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-4 w-16 text-center font-semibold text-gray-600">WA</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Nama</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Link</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Tidak ada data tamu.</td></tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => sendWA(guest)}
                                                title="Kirim WA"
                                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors inline-flex"
                                            >
                                                <MessageCircle size={20} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{guest.name}</div>
                                            <div className="text-sm text-gray-500">{guest.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(guest.rsvp_status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a target="_blank" href={generateLink(guest.id)} className="text-sm text-blue-600 max-w-[150px] md:max-w-[250px] block truncate">
                                                {generateLink(guest.id)}
                                            </a>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>
                            {/* Category Hidden
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="General">General</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Keluarga">Keluarga</option>
                                    <option value="Teman Kantor">Teman Kantor</option>
                                </select>
                            </div> */}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Input Banyak Tamu</h3>
                            <button onClick={closeMultiModal} className="text-gray-400 hover:text-gray-600">
                                <Trash2 size={20} className="transform rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleMultiSubmit} className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4 border border-blue-200">
                                <p className="font-semibold mb-1">Panduan:</p>
                                <ul className="list-disc list-inside">
                                    <li>Nama dan Nomor HP <strong>wajib diisi</strong>.</li>
                                    <li>Baris yang kosong akan diabaikan.</li>
                                    <li>Format Nomor HP (08xx, 62xx).</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
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
                                                type="text"
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
                                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium shadow-sm shadow-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Semua'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Template Modal */}
            {isTemplateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Edit Template WhatsApp</h3>
                            <button onClick={() => setIsTemplateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Trash2 size={20} className="transform rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTemplate} className="space-y-4">
                            <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                                <p className="font-semibold">Variabel yang tersedia:</p>
                                <ul className="list-disc list-inside mt-1">
                                    <li><code>{'{name}'}</code> : Nama Tamu</li>
                                    <li><code>{'{link}'}</code> : Link Undangan</li>
                                </ul>
                            </div>

                            <div>
                                <textarea
                                    required
                                    value={templateText}
                                    onChange={e => setTemplateText(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-64 font-mono text-sm"
                                    placeholder="Tulis template pesan disini..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsTemplateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                                >
                                    Simpan Template
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
