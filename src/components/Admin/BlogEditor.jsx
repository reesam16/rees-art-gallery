import { useState, useEffect } from 'react'; // Added useEffect
import formStyles from './AdminForm.module.css';
import { supabase } from '../../supabaseClient';

function BlogEditor() {
  // State for the NEW post you are typing
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: null,
    imagePreview: null
  });

  // NEW: State for the LIST of all posts saved in the browser
  const [allPosts, setAllPosts] = useState([]);
  const [file, setFile] = useState(null);

    // 1. Fetch existing posts on load
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (!error) setAllPosts(data);
    };

    useEffect(() => {
      fetchPosts();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  // UPDATED: Now uses FileReader (Base64) so images stay forever
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost(prev => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a featured image!");

    try {
      // 2. Upload Image to Storage
      const fileName = `blog_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images') // Reusing your existing bucket
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      // 3. Insert into the blog_posts table
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          image_url: urlData.publicUrl
        }]);

      if (insertError) throw insertError;

      alert("Blog entry published!");
      
      // Clear form
      setPost({ title: '', excerpt: '', content: '', imagePreview: null });
      setFile(null);
      e.target.reset(); // Reset the file input manually if needed
      fetchPosts(); // Refresh list

    } catch (err) {
      alert("Publishing failed: " + err.message);
    }
  };

  const deletePost = async (id) => {
    const confirmed = window.confirm("Delete this post permanently?");
    if (confirmed) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (!error) fetchPosts();
    }
  };

  return (
    <div className={formStyles.adminSectionWrapper}>
      <form className={formStyles.editorForm} onSubmit={handleSubmit}>
        <h3 className={formStyles.recentTitle}>New Blog Entry</h3>
        
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Featured Image</label>
          <div className={formStyles.imageUploadWrapper}>
            {post.imagePreview && (
              <img src={post.imagePreview} alt="Preview" className={formStyles.previewImage} />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className={formStyles.fileInput} />
          </div>
        </div>

        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Post Title</label>
          <input className={formStyles.input} type="text" name="title" value={post.title} onChange={handleChange} />
        </div>

        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Short Snippet (Excerpt)</label>
          <textarea className={formStyles.textarea} name="excerpt" rows="2" value={post.excerpt} onChange={handleChange} />
        </div>

        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Full Story</label>
          <textarea className={formStyles.textarea} name="content" rows="10" value={post.content} onChange={handleChange} />
        </div>

        <button type="submit" className={formStyles.saveBtn}>Publish to Journal</button>
      </form>

      <div className={formStyles.recentPosts}>
        <h3 className={formStyles.recentTitle}>Recently Published</h3>
        <div className={formStyles.postGrid}>
          {allPosts.map((p) => (
            <div key={p.id} className={formStyles.miniCard}>
              <img src={p.image_url} alt="" />
              <h4>{p.title}</h4>
              <p>{new Date(p.created_at).toLocaleDateString()}</p>
              <button onClick={() => deletePost(p.id)} className={formStyles.deleteBtn}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogEditor;