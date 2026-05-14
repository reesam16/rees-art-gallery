import styles from './ShopCard.module.css';
import { useNavigate } from 'react-router-dom';

function ShopCard({ item, isAdmin, onToggleSold }) {

    const navigate = useNavigate();

const handleInquiry = () => {
    // This sends the user to /contact?product=Mountain%20Mist
    navigate(`/contact?product=${encodeURIComponent(item.title)}`);
};

  return (
    <div className={`${styles.card} ${item.isSold ? styles.sold : ''}`}>
      <div className={styles.imageWrapper}>
        <img src={item.image_url || item.image} alt={item.title} />
        {item.isSold && <span className={styles.soldBadge}>SOLD</span>}
      </div>
      
      <div className={styles.info}>
        <h3>{item.title}</h3>
        <p>{item.medium} • {item.dimensions}</p>
        
        <div className={styles.footer}>
          {/* Conditional class for line-through */}
          <span className={`${styles.price} ${item.isSold ? styles.strikethrough : ''}`}>
                        ${item.price}
                    </span>
          {!item.isSold && (
            <button className={styles.buyBtn} onClick={handleInquiry}>
            Inquire to Buy
        </button>
          )}
        </div>
        {/* Show toggle button only for Admin */}
        {isAdmin && (
                    <button onClick={onToggleSold} className={styles.adminToggleBtn}>
                        {item.isSold ? "Set to Available" : "Mark as Sold"}
                    </button>
                )}
      </div>
    </div>
  );
}

export default ShopCard;