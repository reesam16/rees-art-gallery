import { useState, useEffect } from 'react'; // 1. Added useEffect here
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.svg';

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();
  const [hash, setHash] = useState(window.location.hash);

  const toggleMenu = () => setIsActive(!isActive);

  // 2. Updated this function to match the variables below
  const handleLinkClick = (newHash = '') => {
    setIsActive(false); 
    setHash(newHash);   
  };

  useEffect(() => {
    setHash(window.location.hash);
  }, [location]);

  return (
    <header>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.icon} onClick={() => handleLinkClick('')}>
          <img src={logo} className={styles['nav-logo']} alt="my logo" />
        </NavLink>

        <ul className={`${styles['nav-menu']} ${isActive ? styles.active : ''}`}>
          <li className={styles.button}>
            <a
              href="/#gallery-section"
              /* 3. Changed currentHash to hash to match state above */
              className={`${styles.link} ${location.hash === '#gallery-section' ? styles.active : ''}`}
              onClick={() => handleLinkClick('#gallery-section')}
            >
              Paintings
            </a>
          </li>
          <li className={styles.button}>
            <NavLink to="/blog" className={styles.link} onClick={() => handleLinkClick('')}>Blog</NavLink>
          </li>
          <li className={styles.button}>
            <NavLink to="/shop" className={styles.link} onClick={() => handleLinkClick('')}>Shop</NavLink>
          </li>
          <li className={styles.button}>
            <NavLink to="/contact" className={styles.link} onClick={() => handleLinkClick('')}>Contact</NavLink>
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
