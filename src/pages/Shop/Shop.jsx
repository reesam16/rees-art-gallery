import { useState, useEffect } from 'react';
import { shopItems as staticItems } from '../../shopData';
import ShopCard from '../../components/ShopCard/ShopCard';
import styles from './Shop.module.css';

function Shop() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    // Load custom shop items from local storage + static items
    const localItems = JSON.parse(localStorage.getItem('shopItems')) || [];
    setInventory([...localItems, ...staticItems]);
  }, []);

  return (
    <main className={styles.shopContainer}>
      <header className={styles.shopHeader}>
        <h1>The Collection</h1>
        <p>Original paintings available for purchase.</p>
      </header>

      <div className={styles.productGrid}>
        {inventory.map((item) => (
          <ShopCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}

export default Shop;