import { useState, useEffect } from 'react'; // Added useEffect
import { paintings as staticPaintings } from '../../paintingsData';
import styles from './Gallery.module.css';
import heroImage from '../../assets/vcp-photo.jpg';

function Gallery() {
  const [allPaintings, setAllPaintings] = useState([]);
  const [indexLb, setIndexLb] = useState(-1);
  const [isAdmin, setIsAdmin] = useState(false); // Same as Blog

  // Load logic - Same as Blog's loadPosts
  const loadPaintings = () => {
    const localGallery = JSON.parse(localStorage.getItem('galleryItems')) || [];
    setAllPaintings([...localGallery, ...staticPaintings]);
  };

  useEffect(() => {
    loadPaintings();
  }, []);

  // Delete logic - Same as Blog's handleDelete
  const handleDelete = (e, indexInLocal) => {
    e.stopPropagation(); // Stops the Lightbox from opening
    const localItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
    const updated = localItems.filter((_, i) => i !== indexInLocal);
    localStorage.setItem('galleryItems', JSON.stringify(updated));
    loadPaintings(); // Refresh the screen
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
          url(${heroImage})
        ` }}>
        {/* The Admin Login Toggle from the Blog */}
        <button onClick={() => setIsAdmin(!isAdmin)} className={styles.adminToggle}>
          {isAdmin ? "Exit Admin Mode" : "Admin Login"}
        </button>
        <h1>Valle Crucis</h1>
      </div>

      {indexLb !== -1 && (
        <div className={styles.lightbox} style={{ display: 'flex' }} onClick={closeLightbox}>
          <div className={styles['lightbox-prev']} onClick={prevImage}>
            <i className="fa fa-angle-left"></i>
          </div>

          <div className={styles['lightbox-content']}>
            <img
              src={allPaintings[indexLb].imagePreview || allPaintings[indexLb].image}
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
          const isLocal = i < (allPaintings.length - staticPaintings.length);

          return (
            <div
              key={i}
              className={styles['gallery-item']} onClick={() => openLightbox(i)}>
              <img src={art.imagePreview || art.image} alt={art.title} />
              {/* Only show Delete if Admin is ON and it's a local post */}
              {isAdmin && isLocal && (
                <button
                  onClick={(e) => handleDelete(e, i)}
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