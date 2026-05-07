import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.desc}>
        <h4>RAMWEB</h4>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved site by Rees.</p>
      </div>
      
      <ul className={styles['footer-links']}>
        <li><NavLink to="/">home</NavLink></li>
        <li><NavLink to="/gallery">paintings</NavLink></li>
        <li><NavLink to="/blog">blog</NavLink></li>
        <li><NavLink to="/admin">admin</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
        <li><NavLink to="/shop">shop</NavLink></li>
      </ul>
    </footer>
  );
}

export default Footer;