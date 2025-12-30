import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';

function App() {
  const [products, setProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null); // State baru untuk dashboard
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  //State untuk pencarian
  const [search, setSearch] = useState('');

  // Fungsi ambil semua data (Produk & Dashboard)
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const config = { 
        headers: { Authorization: `Bearer ${token}` } ,
        params: { search: search }
      };
      
      // Mengambil dua data sekaligus (Dashboard & Products)
      const [resDashboard, resProducts] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/dashboard', config),
        axios.get('http://127.0.0.1:8000/api/products', config)
      ]);

      setDashboardData(resDashboard.data.data);
      setProducts(resProducts.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const delayDebounce = setTimeout(() => {
        fetchData();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [token, search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) return <Login onLoginSuccess={(newToken) => setToken(newToken)} />;

  return (
    <div className="container">
      <div className="header">
        <h1>🛠️ Dashboard Bengkel</h1>
        <div>
          <button onClick={fetchData} style={{ marginRight: '8px' }} disabled={loading}>🔄 Refresh</button>
          <button onClick={handleLogout} className="btn-logout">🚪 Keluar</button>
        </div>
      </div>

      {/* SEKSI STATISTIK CARD */}
      
      {dashboardData && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="label">Omzet Hari Ini</span>
            <span className="value text-primary">Rp {dashboardData.summary.omzet_hari_ini.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="label">Transaksi Hari Ini</span>
            <span className="value">{dashboardData.summary.transaksi_hari_ini} Nota</span>
          </div>
          <div className="stat-card">
            <span className="label">Omzet Bulan Ini</span>
            <span className="value">Rp {dashboardData.summary.omzet_bulan_ini.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="label">Stok Menipis</span>
            <span className="value text-danger">{dashboardData.summary.stok_menipis_count} Produk</span>
          </div>
        </div>
      )}

      {/* TABEL PRODUK */}
      <div className="card">
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <div className="header" style={{ marginBottom: '15px' }}>
            <h3>📦 Inventori Produk</h3>
          </div>

          <div className="search-container">
            <input 
              type="text"
              className="search-input"
              placeholder="Cari nama produk atau SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                {/* <th>SKU</th> */}
                <th>Stok</th>
                <th>Harga Jual</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  {/* <td>{p.sku}</td> */}
                  <td>{p.stock} unit</td>
                  <td>Rp {p.harga_jual.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${p.stock <= 5 ? 'badge-danger' : 'badge-success'}`}>
                      {p.stock <= 5 ? 'Stok Rendah' : 'Tersedia'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;