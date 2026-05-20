import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
// Import Assets
import logo from '../../assets/logo.svg';
import heroBg from "../../assets/vcp.png";
// Import a few slider images
import slide1 from '../../assets/mcw1.jpg';
import slide2 from '../../assets/mcw2.jpg';
import slide3 from '../../assets/mcw3.jpg';
import slide4 from '../../assets/mcw4.jpg';
import slide5 from '../../assets/mcw5.jpg';
import artistPhoto from "../../assets/pw5.jpg";


// THESE: Import the images you want to use for the 4 boxes
import landscapeBg from '../../assets/ncw9.jpg'; // or whatever image you want
import stillLifeBg from '../../assets/slw4.jpg';
import portraitBg from '../../assets/pw7.jpg';   // placeholder image
import figureBg from '../../assets/fgw1.jpg';     //

function Home() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const slides = [slide1, slide2, slide3, slide4, slide5];

  // Slider Logic
  const nextSlide = () => {
    const isMobile = window.innerWidth <= 768;
    const max = isMobile ? 4 : 2;
    setSliderIndex((prev) => (prev < max ? prev + 1 : 0));
  };

  const prevSlide = () => {
    const isMobile = window.innerWidth <= 768;
    const max = isMobile ? 4 : 2;
    setSliderIndex((prev) => (prev > 0 ? prev - 1 : max));
  };

  const moveAmount = window.innerWidth <= 768 ? 100 : 33.333;

  useEffect(() => {
    // Check if the URL has a hash (like #gallery-section)
    if (window.location.hash && !window.location.hash.includes('=')) {
      try {
        const element = document.querySelector(window.location.hash);
        if (element) {
          // Give the browser a split second to render the grid, then scroll
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } catch (err) {
        console.error("Could not scroll to element:", err);
      }
    }
  }, [window.location.hash]); // Runs once when the Home page loads

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <div
        className={styles.hero}
        style={{
          backgroundImage: `
            linear-gradient(rgba(4, 239, 247, 0.128), transparent 80%), 
            linear-gradient(0deg, #f7f2e89b, transparent 90%),
            url(${heroBg})
          `,
          backgroundColor: 'rgba(0, 128, 68, 0.539)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className={styles['hero-container']}>
          <img src={logo} className={styles['full-icon']} alt="my logo" />
          <h3 className={styles.name}>rees mortensen</h3>
        </div>
      </div>

      {/* Grid Container */}
      <div id="gallery-section" className={styles['grid-container']}>

        {/* Slider Section (c1) */}
        <div className={`${styles.c1} ${styles.cont1}`}>
          <div className={styles['slider-container']}>
            <button className={styles['prev-btn']} onClick={prevSlide}>❮</button>
            <button className={styles['next-btn']} onClick={nextSlide}>❯</button>

            <div className={styles['slider-window']}>
              <div
                className={styles['slider-track']}
                style={{ transform: `translateX(-${sliderIndex * moveAmount}%)` }}
              >
                {slides.map((img, i) => (
                  <img key={i} src={img} alt={`Slide ${i}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* // 2. Inside the return, update the Link tags: */}
        {/* Gallery Selection Boxes */}
        <Link
          to="/gallery?type=landscapes"
          className={`${styles.c2} ${styles.cont2} ${styles.heading}`}
          style={{ backgroundImage: ` linear-gradient(#16a0847d, transparent 80%), linear-gradient(0deg,#8080da7c, transparent 80%), url(${landscapeBg})` }}
        >
          <h3>Landscape Collection</h3>
        </Link>

        <Link
          to="/gallery?type=still-life"
          className={`${styles.c3} ${styles.cont3} ${styles.heading}`}
          style={{ backgroundImage: `linear-gradient(#16a0847d, transparent 80%), linear-gradient(0deg,#8080da7c, transparent 80%), url(${stillLifeBg})` }}
        >
          <h3>Still Life</h3>
        </Link>

        <Link
          to="/gallery?type=portraits"
          className={`${styles.c4} ${styles.cont4} ${styles.heading}`}
          style={{ backgroundImage: `linear-gradient(#16a0847d, transparent 80%), linear-gradient(0deg,#8080da7c, transparent 80%), url(${portraitBg})` }}
        >
          <h3>Portraits</h3>
        </Link>

        <Link
          to="/gallery?type=figures"
          className={`${styles.c5} ${styles.cont5} ${styles.heading}`}
          style={{ backgroundImage: `linear-gradient(#16a0847d, transparent 80%), linear-gradient(0deg,#8080da7c, transparent 80%), url(${figureBg})` }}
        >
          <h3>Figure Collection</h3>
        </Link>
      </div>
      <section className={styles['about-section']}>

        <div className={styles['about-container']}>
          <div className={styles['about-image-wrapper']}>
            <img src={artistPhoto} alt="Rees Mortensen" className={styles['about-photo']} />
          </div>
          <div className={styles['about-text']}>
            <h2>About Rees Mortensen</h2>
            <p>
              Rees found his passion while studying at the University of Tampa. Upon completion of his BA in History, he moved out to Seattle, Washington where he studied for 3 years at the Georgetown Atelier.   Merging traditional fine art with modern front-end web development, Rees builds
              custom digital spaces alongside his physical canvas collections. He is available
              for both artwork commissions and digital design projects—please contact for scheduling.
            </p>
          </div>
        </div>

      </section>

    </main>
  );
}

export default Home;