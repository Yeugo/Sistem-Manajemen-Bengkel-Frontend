import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // Mencegah refresh halaman otomatis
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password
      });

      console.log("Respon Full dari Laravel:", response.data);
      
      const token = response.data.token;
      console.log("Token yang didapat:", token);

      // 1. Simpan ke LocalStorage agar saat refresh tidak logout
      localStorage.setItem('token', token);

      // 2. Panggil fungsi dari parent (App.jsx) untuk update state UI secara instan
      onLoginSuccess(token);

    } catch (err) {
      setError('Email atau Password salah!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login Admin Bengkel</h2>
        <p>Silakan masuk untuk mengelola stok</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Menghubungkan...' : 'Masuk Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}

// WAJIB ADA agar App.jsx bisa mengenali file ini
export default Login;