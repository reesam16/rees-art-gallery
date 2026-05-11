import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import styles from './Gallery.module.css';
import { supabase } from '../../supabaseClient';
// import heroImage from '../../assets/vcp-photo.jpg';

import landscapeHero from '../../assets/paintings/ncw9.jpg';
import stillLifeHero from '../../assets/paintings/slw1.jpg';
import portraitHero from '../../assets/paintings/mcw2.jpg';
import figureHero from '../../assets/paintings/fgw9.jpg';
import defaultHero from '../../assets/vcp-photo.jpg'; // Your fallback

function Gallery() {
  const [allPaintings, setAllPaintings] = useState([]);
  const [indexLb, setIndexLb] = useState(-1);
  const [isAdmin, setIsAdmin] = useState(false); // Same as Blog
  const [searchParams] = useSearchParams();

  // 1. Grab the current URL location
  const location = useLocation();
  // GET THE TYPE FIRST
  const type = searchParams.get('type');

  const heroMap = {
    'landscapes': landscapeHero,
    'still-life': stillLifeHero,
    'portraits': portraitHero,
    'figures': figureHero
  };
  // Select the image based on the URL type, or use the default
  const currentHero = heroMap[type] || defaultHero;

  // --- NEW: TITLE MAPPING ---

  const titleMap = {
    'landscapes': 'Landscape Collection',
    'still-life': 'Still Life Collection',
    'portraits': 'Portrait Collection',
    'figures': 'Figure Collection'
  };
  // Fallback to 'Full Gallery' if no type is selected
  const displayTitle = titleMap[type] || 'Full Gallery';

  // 1. Updated load logic to talk to the Cloud
  const loadPaintings = async () => {
    // Get the type from the URL (e.g., landscapes)
    const queryParams = new URLSearchParams(location.search);
    const typeFilter = queryParams.get('type');

    // Start a query to your Supabase table
    let query = supabase.from('gallery_paintings').select('*');

    // If there is a type in the URL, filter the database results
    if (typeFilter) {
      // NOTE: Make sure 'target_gallery' matches your Supabase column name exactly!
      query = query.eq('target_gallery', typeFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching paintings:", error);
    } else {
      // data is an array of your paintings from the cloud
      setAllPaintings(data);
    }
  };

  useEffect(() => {
    loadPaintings();
  }, [location.search]);

  // Delete logic - Same as Blog's handleDelete
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const { error } = await supabase.from('gallery_paintings').delete().eq('id', id);
    if (!error) loadPaintings(); // Refresh the grid
  };

  const openLightbox = (index) => setIndexLb(index);
  const closeLightbox = () => setIndexLb(-1);

  const nextImage = (e) => {
    e.stopPropagation();
    setIndexLb((prev) => (prev + 1 >= allPaintings.length ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setIndexLb((prev) => (prev - 1 < 0 ? allPaintings.length - 1 : prev - 1));
  };



  return (
    <main>
      <div className={styles.header} style={{
        backgroundImage: `
          linear-gradient(rgba(4, 239, 247, 0.128), transparent 80%), 
          linear-gradient(0deg, #f7f2e89b, transparent 90%),
          url(${currentHero})
        ` }}>
        {/* The Admin Login Toggle from the Blog */}
        <button onClick={() => setIsAdmin(!isAdmin)} className={styles.adminToggle}>
          {isAdmin ? "Exit Admin Mode" : "Admin Login"}
        </button>
        {/* --- DYNAMIC TITLE HERE --- */}
        <h1>{displayTitle}</h1>
      </div>

      {indexLb !== -1 && (
        <div className={styles.lightbox} style={{ display: 'flex' }} onClick={closeLightbox}>
          <div className={styles['lightbox-prev']} onClick={prevImage}>
            <i className="fa fa-angle-left"></i>
          </div>

          <div className={styles['lightbox-content']}>
            <img
              src={allPaintings[indexLb].image_url}
              alt={allPaintings[indexLb].title}
            />
            <div className={styles['lightbox-caption']}>
              <h3>{allPaintings[indexLb].title}</h3>

              {/* Display Medium OR Description */}
              <p>
                {allPaintings[indexLb].medium || allPaintings[indexLb].description || "Original Artwork"}
              </p>

              {/* Display Dimensions if they exist */}
              {allPaintings[indexLb].dimensions && (
                <p className={styles.dimensionsText}>({allPaintings[indexLb].dimensions})</p>
              )}

              {allPaintings[indexLb].price && (
                <p className={styles.priceTag}>${allPaintings[indexLb].price}</p>
              )}
            </div>
          </div>

          <div className={styles['lightbox-next']} onClick={nextImage}>
            <i className="fa fa-angle-right"></i>
          </div>
        </div>
      )}

      <div className={styles['gallery-container']}>
        {allPaintings.map((art, i) => {

          return (
            <div
              key={i}
              className={styles['gallery-item']} onClick={() => openLightbox(i)}>
              <img src={art.image_url} alt={art.title} />
              {/* Only show Delete if Admin is ON and it's a local post */}
              {isAdmin && (
                <button
                  onClick={(e) => handleDelete(e, art.id)}
                  className={styles.adminDeleteBtn}
                >
                  Delete Painting
                </button>
              )}
            </div>
          )

        }

        )}
      </div>
    </main>
  );
}


export default Gallery;