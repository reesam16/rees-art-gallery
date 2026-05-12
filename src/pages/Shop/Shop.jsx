import { useState, useEffect } from 'react';

import { supabase } from '../../supabaseClient'; 
import ShopCard from '../../components/ShopCard/ShopCard';
import styles from './Shop.module.css';

function Shop() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

 // Define the "What"
 const fetchInventory = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setInventory(data || []);
  } catch (err) {
    console.error("Error loading shop:", err.message);
  } finally {
    setLoading(false);
  }
};

// Define the "When"
useEffect(() => {
  fetchInventory();
}, []);

  return (
    <main className={styles.shopContainer}>
      <header className={styles.shopHeader}>
        <h1>The Collection</h1>
        <p>Original paintings available for purchase.</p>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading the collection...</p>
      ) : (
        <div className={styles.productGrid}>
          {inventory.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>
      )}
      
      {!loading && inventory.length === 0 && (
        <p style={{ textAlign: 'center' }}>No items currently in the shop. Check back soon!</p>
      )}
    </main>
  );
}

export default Shop;