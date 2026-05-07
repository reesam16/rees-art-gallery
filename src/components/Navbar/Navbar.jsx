import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.svg';

function Navbar() {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => setIsActive(!isActive);
  const closeMenu = () => setIsActive(false);

  return (
    <header>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.icon} onClick={closeMenu}>
          <img src={logo} className={styles['nav-logo']} alt="my logo" />
        </NavLink>

        <ul className={`${styles['nav-menu']} ${isActive ? styles.active : ''}`}>
          <li className={styles.button}>
            <NavLink to="/gallery" className={styles.link} onClick={closeMenu}>Paintings</NavLink>
          </li>
          <li className={styles.button}>
            <NavLink to="/blog" className={styles.link} onClick={closeMenu}>Blog</NavLink>
          </li>
          <li className={styles.button}>
            <NavLink to="/shop" className={styles.link} onClick={closeMenu}>Shop</NavLink>
          </li>
          <li className={styles.button}>
            <NavLink to="/contact" className={styles.link} onClick={closeMenu}>Contact</NavLink>
          </li>
        </ul>

        <div 
          className={`${styles.hamburger} ${isActive ? styles.active : ''}`} 
          onClick={toggleMenu}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;