import { useState, useEffect } from 'react'; // Added useEffect
import formStyles from './AdminForm.module.css';

function BlogEditor() {
  // State for the NEW post you are typing
  const [post, setPost] = useState({
    title: '',
    date: new Date().toLocaleDateString(),
    excerpt: '',
    content: '',
    image: null,
    imagePreview: null
  });

  // NEW: State for the LIST of all posts saved in the browser
  const [allPosts, setAllPosts] = useState([]);

  // Load posts from localStorage when the component first opens
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('journalPosts')) || [];
    setAllPosts(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  // UPDATED: Now uses FileReader (Base64) so images stay forever
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost(prev => ({
          ...prev,
          image: reader.result,
          imagePreview: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingPosts = JSON.parse(localStorage.getItem('journalPosts')) || [];
    const updatedPosts = [post, ...existingPosts];
  
    localStorage.setItem('journalPosts', JSON.stringify(updatedPosts));
    
    // Update the list state immediately so it shows up at the bottom
    setAllPosts(updatedPosts);
    
    alert("Success! Your entry has been published.");
    
    setPost({
      title: '',
      date: new Date().toLocaleDateString(),
      excerpt: '',
      content: '',
      image: null,
      imagePreview: null
    });
  };

  const deletePost = (indexToDelete) => {
    const existingPosts = JSON.parse(localStorage.getItem('journalPosts')) || [];
    const updatedPosts = existingPosts.filter((_, index) => index !== indexToDelete);
    localStorage.setItem('journalPosts', JSON.stringify(updatedPosts));
    setAllPosts(updatedPosts);
  };

  return (
    <div className={formStyles.adminSectionWrapper}>
      <form className={formStyles.editorForm} onSubmit={handleSubmit}>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Painting Image</label>
          <div className={formStyles.imageUploadWrapper}>
            {post.imagePreview && (
              <img src={post.imagePreview} alt="Preview" className={formStyles.previewImage} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={formStyles.fileInput}
            />
          </div>
        </div>

        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Post Title</label>
          <input
            className={formStyles.input}
            type="text"
            name="title"
            placeholder="e.g. Bouguereau After the Bath"
            value={post.title}
            onChange={handleChange}
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Short Snippet (Excerpt)</label>
          <textarea
            className={formStyles.textarea}
            name="excerpt"
            rows="2"
            placeholder="A brief sentence for the main blog page..."
            value={post.excerpt}
            onChange={handleChange}
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Full Story</label>
          <textarea
            className={formStyles.textarea}
            name="content"
            rows="10"
            placeholder="Describe your process, the palette used, etc."
            value={post.content}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={formStyles.saveBtn}>Publish to Journal</button>
      </form>

      {/* NEW: THE DISPLAY LIST BELOW THE FORM */}
      <div className={formStyles.recentPosts}>
        <h3 className={formStyles.recentTitle}>Recently Published</h3>
        <div className={formStyles.postGrid}>
          {allPosts.map((p, index) => (
            <div key={index} className={formStyles.miniCard}>
              {p.imagePreview && <img src={p.imagePreview} alt="" />}
              <h4>{p.title}</h4>
              <p>{p.date}</p>
              <button 
                onClick={() => deletePost(index)} 
                className={formStyles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogEditor;