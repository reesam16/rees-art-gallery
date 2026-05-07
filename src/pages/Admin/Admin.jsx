import { useState } from 'react';
import BlogEditor from '../../components/Admin/BlogEditor';
// If you have a separate Gallery tool, import it here too
import GalleryEditor from '../../components/Admin/GalleryEditor';
import ShopEditor from '../../components/Admin/ShopEditor';
import styles from './Admin.module.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('blog');

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
      </aside>

      <main className={styles.workspace}>
        <header className={styles.header}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
        </header>

        <div className={styles.editorContainer}>
          {/* Each one only shows if the activeTab matches exactly */}
          {activeTab === 'blog' && <BlogEditor />}
          {activeTab === 'gallery' && <GalleryEditor />}
          {activeTab === 'shop' && <div><ShopEditor/></div>}
        </div>
      </main>
    </div>
  );
}

export default Admin;