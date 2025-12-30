import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login'; // Pastikan path-nya benar

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // Mengambil nilai awal token dari LocalStorage
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Fungsi ambil data
  const fetchProducts = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      // Jika token expired (401), otomatis logout
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetchProducts setiap kali state 'token' berubah
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProducts([]);
  };

  // LOGIKA NAVIGASI: Jika tidak ada token, tampilkan halaman Login
  if (!token) {
    return <Login onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  // JIKA ADA TOKEN, TAMPILKAN DASHBOARD
  return (
    <div className="container">
      <div className="header">
        <h1>🛠️ Inventori Bengkel</h1>
        <div>
          <button onClick={fetchProducts} disabled={loading} style={{ background: '#7674ffff', color: 'white', border: 'none', marginRight: '10px', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>
            {loading ? '...' : '🔄 Refresh'}
          </button>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>
            🚪 Keluar
          </button>
        </div>
      </div>

      <div className="card">
        {loading && products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Memuat data stok...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>SKU</th>
                <th>Stok</th>
                <th>Harga Jual</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong></td>
                    <td><code>{product.sku}</code></td>
                    <td>{product.stock} unit</td>
                    <td>Rp {product.harga_jual.toLocaleString()}</td>
                    <td>
                      {product.stock <= 5 ? (
                        <span className="badge badge-danger">Stok Rendah</span>
                      ) : (
                        <span className="badge badge-success">Tersedia</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    Data produk kosong atau belum dimuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;