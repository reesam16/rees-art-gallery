import { useState, useEffect } from 'react'; 
import styles from './Blog.module.css';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; 

function Blog() {
  const [allPosts, setAllPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 

   // Load posts from Supabase
   const loadContent= async () => {
    // 1. Get the data from our new table
    const { data, error } = await supabase
      .from('blog_posts') // The "s" we added!
      .select('*')
      .order('created_at', { ascending: false }); // Show newest first

    if (error) {
      console.error("Error fetching blogs:", error.message);
    } else {
      setAllPosts(data || []);
      // Check if a user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session); // If session exists, isAdmin = true
    }
  };

  useEffect(() => {
    loadContent();
  // 2. Listen for Auth changes (in case you log out in another tab)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsAdmin(!!session);
  });

  return () => subscription.unsubscribe();
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
      loadContent(); 
    }
  };

  return (
    <main className={styles.blogPage}>
      {/* 3. The "Secret" button now ONLY shows up if you are actually logged in */}
      {isAdmin && (
        <div className={styles.adminBanner}>
          <span>Admin Mode Active</span>
          <Link to="/admin" className={styles.dashboardLink}>Go to Dashboard</Link>
        </div>
      )}

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