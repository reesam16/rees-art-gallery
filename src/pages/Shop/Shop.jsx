import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import ShopCard from '../../components/ShopCard/ShopCard';
import styles from './Shop.module.css';

function Shop() {
  const [items, setItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadShop = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setItems(data || []);

    // Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
    setLoading(false);
  };

  // ADD THIS FUNCTION
  const toggleSoldStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('shop_items')
      .update({ isSold: !currentStatus })
      .eq('id', id);

    if (!error) loadShop(); // Refresh the grid to show the change
  };

  useEffect(() => {
    loadShop();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from the shop?")) return;

    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id);

    if (!error) loadShop();
  };

  if (loading) return <div className={styles.loader}>Loading Shop...</div>;





  return (
    <main className={styles.shopPage}>
      {isAdmin && (
        <div className={styles.adminBanner}>
          <span>Shop Inventory Admin</span>
          <Link to="/admin" className={styles.dashboardLink}>Go to Dashboard</Link>
        </div>
      )}

      <header className={styles.shopHeader}>
        <h1>Available Work</h1>
        <p>Original paintings and limited edition prints.</p>
      </header>

      <section className={styles.shopGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemWrapper}>
            <ShopCard
              item={item}
              isAdmin={isAdmin}
              onToggleSold={() => toggleSoldStatus(item.id, item.isSold)}
            />

            {isAdmin && (
              <button
                onClick={() => handleDelete(item.id)}
                className={styles.adminDeleteBtn}
              >
                Remove Item
              </button>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

export default Shop;