import { useState, useEffect } from 'react'; // Added these
import { blogPosts as staticPosts } from '../../blogData'; // Renamed for clarity
import styles from './Blog.module.css';
import { Link } from 'react-router-dom';

function Blog() {
  const [allPosts, setAllPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // The "Admin Mode" toggle

  // Load posts
  const loadPosts = () => {
    const localPosts = JSON.parse(localStorage.getItem('journalPosts')) || [];
    setAllPosts([...localPosts, ...staticPosts]);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = (indexInLocal) => {
    const localPosts = JSON.parse(localStorage.getItem('journalPosts')) || [];
    // We only delete from the localPosts array
    const updated = localPosts.filter((_, i) => i !== indexInLocal);
    localStorage.setItem('journalPosts', JSON.stringify(updated));
    loadPosts(); // Refresh the screen
  };

  return (
    <main className={styles.blogPage}>
      {/* A temporary "Secret" button to toggle Admin Mode */}
      <button 
        onClick={() => setIsAdmin(!isAdmin)} 
        className={styles.adminToggle}
      >
        {isAdmin ? "Exit Admin Mode" : "Admin Login"}
      </button>

      <section className={styles.postList}>
        {allPosts.map((post, index) => {
          // Check if this post is from localStorage (static posts won't have an index in localPosts)
          const isLocal = index < (allPosts.length - staticPosts.length);

          return (
            <article key={`${post.title}-${index}`} className={styles.blogCard}>
              <div className={styles.imageWrapper}>
                <img src={post.imagePreview || post.image} alt={post.title} />
              </div>

              <div className={styles.postContent}>
                <span className={styles.date}>{post.date}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                
                {/* Only show Delete if Admin Mode is ON and it's a local post */}
                {isAdmin && isLocal && (
                  <button 
                    onClick={() => handleDelete(index)}
                    className={styles.adminDeleteBtn}
                  >
                    Delete Post
                  </button>
                )}

                <Link to={`/blog/${post.id}`} className={styles.readMore}>
                  Read More —
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Blog;