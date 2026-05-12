import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import { supabase } from '../../supabaseClient';

import styles from './BlogPost.module.css';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id) // Find the post where the ID matches the URL
        .single();   // Tell Supabase we only expect one result

      if (error) {
        console.error("Error fetching post:", error.message);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <h2 className={styles.loading}>Loading story...</h2>;
  if (!post) return <h2 className={styles.error}>Post not found!</h2>;
  

  // if (!post) return <h2>Post not found!</h2>;

  return (
    <article className={styles.fullPost}>
      <Link to="/blog" className={styles.backLink}>← Back to Journal</Link>
      
      <header className={styles.header}>
        <span className={styles.date}>{new Date(post.created_at).toLocaleDateString()}</span>
        <h1>{post.title}</h1>
      </header>

      <img src={post.image_url} alt={post.title} className={styles.heroImage} />

      <div className={styles.content}>
        {/* This is where your "Full Story" from the data file goes */}
        <p>{post.content}</p> 
      </div>
    </article>
  );
}

export default BlogPost;