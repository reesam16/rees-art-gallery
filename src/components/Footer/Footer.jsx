import { NavLink, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {

  const location = useLocation(); // Hook into the URL

  return (
    <footer className={styles.footer}>
      <div className={styles.desc}>
        <h4>RAMWEB</h4>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved site by Rees.</p>
      </div>
      
      <ul className={styles['footer-links']}>
        <li><NavLink to="/" end className={({ isActive }) => 
              isActive && location.hash === '' ? `${styles.footerLink} active` : styles.footerLink
            }>home</NavLink></li>
        <li><a href="/#gallery-section" className={`${styles.footerLink} ${location.hash === '#gallery-section' ? styles.active : ''}`}>paintings</a></li>
        <li><NavLink to="/blog">blog</NavLink></li>
        <li><NavLink to="/admin">admin</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
        <li><NavLink to="/shop">shop</NavLink></li>
      </ul>
    </footer>
  );
}

export default Footer;