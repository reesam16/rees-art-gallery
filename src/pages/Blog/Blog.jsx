import { useState, useEffect } from 'react'; // Added these

import styles from './Blog.module.css';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; 

function Blog() {
  const [allPosts, setAllPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // The "Admin Mode" toggle

   // Load posts from Supabase
   const loadPosts = async () => {
    // 1. Get the data from our new table
    const { data, error } = await supabase
      .from('blog_posts') // The "s" we added!
      .select('*')
      .order('created_at', { ascending: false }); // Show newest first

    if (error) {
      console.error("Error fetching blogs:", error.message);
    } else {
      // 2. Combine them with your static posts if you still want those
      setAllPosts(data || []);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    // A quick confirmation so you don't accidentally delete your hard work!
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Could not delete post: " + error.message);
    } else {
      loadPosts(); 
    }
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
        {allPosts.length === 0 ? (
          <p className={styles.noPosts}>No blog posts found. Time to write something!</p>
        ) : (
          allPosts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <div className={styles.imageWrapper}>
                {/* Now only using the Supabase column name */}
                <img src={post.image_url} alt={post.title} />
              </div>

              <div className={styles.postContent}>
                <span className={styles.date}>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(post.id)}
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
          ))
        )}
      </section>
    </main>
  );
}

export default Blog;