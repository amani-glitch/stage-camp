import { useState, useEffect, useMemo } from 'react';
import { Lock, LogOut, Users, UserCheck, Calendar, BarChart3, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#F97316', '#FB923C', '#EA580C', '#FDBA74', '#FED7AA'];

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026';
    if (pw === expected) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black-primary flex items-center justify-center px-6">
      <form onSubmit={submit} className="bg-black-secondary border border-gray-700 p-10 w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <Lock className="text-orange-primary" size={32} />
        </div>
        <h1 className="font-bebas text-3xl text-center tracking-wider mb-6">ADMIN CD84</h1>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full bg-black-tertiary border border-gray-700 text-white px-4 py-3 mb-4 focus:border-orange-primary focus:outline-none"
        />
        {error && <p className="text-red-500 text-sm mb-4">Mot de passe incorrect</p>}
        <button className="w-full bg-orange-primary text-black-primary font-bold uppercase tracking-widest py-3 text-sm hover:bg-white transition-all">
          Connexion
        </button>
      </form>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-black-secondary border border-gray-700 p-6">
      <Icon className="text-orange-primary mb-3" size={24} />
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-bebas text-4xl tracking-wider ${accent ? 'text-orange-primary' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function DetailModal({ row, onClose }) {
  if (!row) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-black-secondary border border-gray-700 p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bebas text-2xl tracking-wider mb-4 text-orange-primary">Detail inscription</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(row).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-gray-500 w-40 flex-shrink-0">{k}:</span>
              <span className="text-gray-300">{String(v)}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 bg-orange-primary text-black-primary font-bold uppercase tracking-widest px-6 py-2 text-sm hover:bg-white transition-all">
          Fermer
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);
  const perPage = 10;

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/inscriptions`, {
        headers: { 'x-admin-key': import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026' },
      });
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  // Normalize keys from Google Sheets headers to what the dashboard expects
  const normalized = useMemo(() => {
    return data.map((d) => ({
      id: d.ID || d.id || '',
      date_inscription: d.Date || d.date_inscription || '',
      nom: d.Nom_Joueur || d.nom || '',
      prenom: d.Prenom_Joueur || d.prenom || '',
      categorie: d.Categorie || d.categorie || '',
      club: d.Club || d.club || '',
      niveau: d.Niveau || d.niveau || '',
      email: d.Email || d.email || '',
      telephone: d.Telephone || d.telephone || '',
      statut: d.Statut || d.statut || 'en_attente',
      date_naissance: d.Date_Naissance || '',
      poste: d.Poste || '',
      nom_parent: d.Nom_Parent || '',
      prenom_parent: d.Prenom_Parent || '',
      adresse: d.Adresse || '',
      code_postal: d.Code_Postal || '',
      ville: d.Ville || '',
      allergies: d.Allergies || '',
      medical: d.Medical || '',
      source: d.Source || '',
    }));
  }, [data]);

  const filtered = useMemo(() => {
    return normalized.filter((d) => {
      const matchText = !filter || JSON.stringify(d).toLowerCase().includes(filter.toLowerCase());
      const matchStatus = !statusFilter || d.statut === statusFilter;
      return matchText && matchStatus;
    });
  }, [normalized, filter, statusFilter]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const stats = useMemo(() => {
    const cats = {};
    normalized.forEach((d) => {
      const cat = d.categorie || 'Autre';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return {
      total: normalized.length,
      remaining: 40 - normalized.length,
      thisWeek: normalized.filter((d) => {
        const diff = Date.now() - new Date(d.date_inscription).getTime();
        return diff < 7 * 86400000;
      }).length,
      categories: Object.entries(cats).map(([name, value]) => ({ name, value })),
    };
  }, [normalized]);

  const statusCounts = useMemo(() => {
    const s = {};
    normalized.forEach((d) => { s[d.statut] = (s[d.statut] || 0) + 1; });
    return Object.entries(s).map(([name, value]) => ({ name, value }));
  }, [normalized]);

  const updateStatus = async (id, statut) => {
    try {
      await fetch(`${apiUrl}/api/inscriptions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026',
        },
        body: JSON.stringify({ statut }),
      });
    } catch { /* ignore */ }
    setData((prev) => prev.map((d) => (d.ID === id || d.id === id ? { ...d, Statut: statut, statut } : d)));
  };

  const exportCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscriptions_cd84.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-black-primary text-white">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bebas text-2xl tracking-wider">CD</span>
          <span className="font-bebas text-2xl tracking-wider text-orange-primary">84</span>
          <span className="text-gray-500 text-sm ml-4">Admin Dashboard</span>
        </div>
        <button onClick={() => setAuthed(false)} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm">
          <LogOut size={16} /> Deconnexion
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total inscriptions" value={stats.total} />
          <StatCard icon={UserCheck} label="Places restantes" value={stats.remaining} accent />
          <StatCard icon={Calendar} label="Cette semaine" value={stats.thisWeek} />
          <StatCard icon={BarChart3} label="Categories" value={stats.categories.length} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black-secondary border border-gray-700 p-6">
            <h3 className="font-bebas text-lg tracking-wider mb-4">Par categorie</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.categories} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {stats.categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-black-secondary border border-gray-700 p-6">
            <h3 className="font-bebas text-lg tracking-wider mb-4">Par statut</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusCounts}>
                <XAxis dataKey="name" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            placeholder="Rechercher..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(0); }}
            className="bg-black-tertiary border border-gray-700 text-white text-sm px-4 py-2 focus:border-orange-primary focus:outline-none w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="bg-black-tertiary border border-gray-700 text-white text-sm px-4 py-2 focus:border-orange-primary focus:outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirme">Confirme</option>
            <option value="refuse">Refuse</option>
          </select>
          <button onClick={exportCSV} className="ml-auto flex items-center gap-2 bg-orange-primary text-black-primary font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-white transition-all">
            <Download size={14} /> Exporter CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-black-secondary border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">ID</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">Joueur</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">Cat.</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">Club</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">Statut</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr key={row.id} className="border-b border-gray-700/50 hover:bg-black-tertiary/50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{row.id}</td>
                  <td className="px-4 py-3 text-gray-400">{row.date_inscription}</td>
                  <td className="px-4 py-3 text-white">{row.prenom} {row.nom}</td>
                  <td className="px-4 py-3 text-orange-primary">{row.categorie}</td>
                  <td className="px-4 py-3 text-gray-400">{row.club}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.statut}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className="bg-black-tertiary border border-gray-700 text-xs text-white px-2 py-1 focus:outline-none"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirme">Confirme</option>
                      <option value="refuse">Refuse</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetail(row)} className="text-gray-500 hover:text-orange-primary transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!paged.length && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    {loading ? 'Chargement...' : 'Aucune inscription'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-500 text-sm">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <DetailModal row={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function demoData() {
  const cats = ['U11', 'U12', 'U13', 'U15'];
  const clubs = ['Avignon Basket', 'Carpentras BC', 'Orange BC', 'Cavaillon Basket', 'Apt Basket', 'Pertuis BC'];
  const statuts = ['en_attente', 'confirme', 'en_attente', 'confirme', 'en_attente'];
  const prenoms = ['Lucas', 'Emma', 'Noah', 'Lea', 'Hugo', 'Chloe', 'Louis', 'Manon', 'Jules', 'Camille', 'Adam', 'Jade'];
  const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent'];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `SC-${String(i + 1).padStart(3, '0')}`,
    date_inscription: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().slice(0, 10),
    nom: noms[i % noms.length],
    prenom: prenoms[i % prenoms.length],
    categorie: cats[i % cats.length],
    club: clubs[i % clubs.length],
    niveau: i % 2 === 0 ? 'Selection departementale' : 'Niveau regional',
    email: `parent${i + 1}@email.com`,
    telephone: `06 ${String(Math.random()).slice(2, 10)}`,
    statut: statuts[i % statuts.length],
  }));
}
