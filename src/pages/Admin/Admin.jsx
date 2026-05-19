import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import BlogEditor from '../../components/Admin/BlogEditor';
import GalleryEditor from '../../components/Admin/GalleryEditor';
import ShopEditor from '../../components/Admin/ShopEditor';
import styles from './Admin.module.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('blog');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // 1. Check if you are already logged in when the page loads
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 2. THE GATEKEEPER: If no user, show the clean Login Form instead of the dashboard
  if (!user) {
    return (
      <div className={styles.loginWrapper}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2>RAMWEB Admin Login</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>RAMWEB Admin</h2>
        <nav className={styles.nav}>
          <button
            className={activeTab === 'blog' ? styles.active : ''}
            onClick={() => setActiveTab('blog')}
          >
            Blog Posts
          </button>
          <button
            className={activeTab === 'gallery' ? styles.active : ''}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery updates
          </button>
          <button
            className={activeTab === 'shop' ? styles.active : ''}
            onClick={() => setActiveTab('shop')}
          >
            Shop Management
          </button>
        </nav>
        {/* Added a Logout button at the bottom of your sidebar */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <main className={styles.workspace}>
        <header className={styles.header}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
        </header>

        <div className={styles.editorContainer}>
          {/* Each one only shows if the activeTab matches exactly */}
          {activeTab === 'blog' && <BlogEditor />}
          {activeTab === 'gallery' && <GalleryEditor />}
          {activeTab === 'shop' && <div><ShopEditor /></div>}
        </div>
      </main>
    </div>
  );
}

export default Admin;