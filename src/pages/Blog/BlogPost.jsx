import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../../blogData';
import styles from './BlogPost.module.css';

function BlogPost() {
  const { id } = useParams();
  // Find the specific post that matches the ID in the URL
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) return <h2>Post not found!</h2>;

  return (
    <article className={styles.fullPost}>
      <Link to="/blog" className={styles.backLink}>← Back to Journal</Link>
      
      <header className={styles.header}>
        <span className={styles.date}>{post.date}</span>
        <h1>{post.title}</h1>
      </header>

      <img src={post.image} alt={post.title} className={styles.heroImage} />

      <div className={styles.content}>
        {/* This is where your "Full Story" from the data file goes */}
        <p>{post.content}</p> 
      </div>
    </article>
  );
}

export default BlogPost;