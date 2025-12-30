import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const token = '1|qOI5HgPntmzrQGp3yFDk9J2CtjkkSxlF7uFCluz59ec9f5eb' 
      const response = await axios.get('http://127.0.0.1:8000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Gagal mengambil data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="container">
      <div className="header">
        <h1>🛠️ Inventori Bengkel</h1>
        <button onClick={fetchProducts} style={{ cursor: 'pointer', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          🔄 Refresh Data
        </button>
      </div>

      <div className="card">
        {loading ? (
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
              {products.map((product) => (
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App