import { useState, useEffect } from 'react';
import formStyles from './AdminForm.module.css';
import { supabase } from '../../supabaseClient';

function GalleryEditor() {
    const [art, setArt] = useState({
        title: '',
        medium: '',
        dimensions: '',
        price: '',
        category: 'landscapes', // 1. Added default category state
        image: null,
        imagePreview: null
    });

    const [allArt, setAllArt] = useState([]);

    useEffect(() => {
        const fetchArt = async () => {
            const { data, error } = await supabase
                .from('gallery_paintings')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error) setAllArt(data);
        };
        fetchArt();
    }, []);

    // ADDED THIS FUNCTION
    const deleteArt = async (idToDelete) => {
        // This removes it from the screen immediately
        const updated = allArt.filter((item) => item.id !== idToDelete);
        setAllArt(updated);

        // Optional: Add the actual Supabase delete logic here later
        // await supabase.from('gallery_paintings').delete().eq('id', idToDelete);
    };

    // Add a piece of state to track the actual File object
    const [file, setFile] = useState(null);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile); // Store the actual file for Supabase
            const reader = new FileReader();
            reader.onloadend = () => {
                setArt(prev => ({ ...prev, imagePreview: reader.result }));
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) return alert("Please select an image first!");

        try {
            // 1. Upload Image to Storage Bucket
            const fileName = `${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('painting-images') // <--- MUST match your bucket name in Supabase
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get the Public URL for that image
            const { data: urlData } = supabase.storage
                .from('painting-images')
                .getPublicUrl(fileName);

            const publicUrl = urlData.publicUrl;

            // 3. Insert Data into your gallery_paintings table
            const { error: insertError } = await supabase
                .from('gallery_paintings')
                .insert([
                    {
                        title: art.title,
                        medium: art.medium,
                        dimensions: art.dimensions,
                        price: art.price,
                        target_gallery: art.category, // Matches your table column!
                        image_url: publicUrl // The link we just generated
                    }
                ]);

            if (insertError) throw insertError;

            alert("Success! Painting is in the cloud.");
            // Clear form here...
            setArt({
                title: '',
                medium: '',
                dimensions: '',
                price: '',
                category: 'landscapes',
                image: null,
                imagePreview: null
            });
            setFile(null);

        } catch (err) {
            console.error("Supabase Error:", err.message);
            alert("Upload failed: " + err.message);
        }
    };


    return (
        <div className={formStyles.adminSectionWrapper}>
            <form className={formStyles.editorForm} onSubmit={handleSubmit}>
                <h3 className={formStyles.recentTitle}>Add to Gallery</h3>

                {/* IMAGE UPLOAD SECTION */}
                <div className={formStyles.inputGroup}>
                    <label className={formStyles.label}>Painting Image</label>
                    <div className={formStyles.imageUploadWrapper}>
                        {art.imagePreview && (
                            <img src={art.imagePreview} alt="Preview" className={formStyles.previewImage} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={formStyles.fileInput}
                        />
                    </div>
                </div>

                {/* CATEGORY SELECTOR - 3. Added this new section */}
                <div className={formStyles.inputGroup}>
                    <label className={formStyles.label}>Target Gallery</label>
                    <select
                        className={formStyles.input}
                        value={art.category}
                        onChange={(e) => setArt({ ...art, category: e.target.value })}
                        style={{ height: '45px' }} // Optional: match height of text inputs
                    >
                        <option value="">-- Select a Collection --</option>
                        <option value="landscapes">Landscape Collection</option>
                        <option value="still-life">Still Life</option>
                        <option value="portraits">Portraits</option>
                        <option value="figures">Figure Collection</option>
                    </select>
                </div>

                {/* TITLE SECTION */}
                <div className={formStyles.inputGroup}>
                    <label className={formStyles.label}>Painting Title</label>
                    <input
                        className={formStyles.input}
                        type="text"
                        placeholder="e.g. Sunset in Tampa"
                        value={art.title}
                        onChange={(e) => setArt({ ...art, title: e.target.value })}
                    />
                </div>

                {/* MEDIUM SECTION */}
                <div className={formStyles.inputGroup}>
                    <label className={formStyles.label}>Medium</label>
                    <input
                        className={formStyles.input}
                        type="text"
                        placeholder="e.g. Oil on Canvas"
                        value={art.medium}
                        onChange={(e) => setArt({ ...art, medium: e.target.value })}
                    />
                </div>

                {/* DIMENSIONS SECTION */}
                <div className={formStyles.inputGroup}>
                    <label className={formStyles.label}>Dimensions</label>
                    <input
                        className={formStyles.input}
                        type="text"
                        placeholder="e.g. 8x10"
                        value={art.dimensions}
                        onChange={(e) => setArt({ ...art, dimensions: e.target.value })}
                    />
                </div>

                {/* PRICE SECTION */}
                <div className={formStyles.inputGroup}>
                    <label className={formStyles.label}>Price ($)</label>
                    <input
                        className={formStyles.input}
                        type="text"
                        placeholder="0.00"
                        value={art.price}
                        onChange={(e) => setArt({ ...art, price: e.target.value })}
                    />
                </div>

                <button type="submit" className={formStyles.saveBtn}>Add to Gallery</button>
            </form>

            <div className={formStyles.recentPosts}>
                <h3 className={formStyles.recentTitle}>Manage Uploaded Paintings</h3>
                <div className={formStyles.postGrid}>
                    {allArt.map((p, index) => (
                        <div key={p.id || index} className={formStyles.miniCard}>
                            {/* Supabase uses 'image_url', not 'imagePreview' */}
                            {p.image_url && <img src={p.image_url} alt={p.title} />}

                            <h4>{p.title}</h4>

                            {/* Supabase uses 'target_gallery', not 'category' */}
                            <span className={formStyles.categoryTag}>{p.target_gallery}</span>

                            <p>{p.medium} {p.dimensions && `(${p.dimensions})`}</p>
                            <p>${p.price}</p>

                            {/* We will need to update this delete function for Supabase later! */}
                            <button onClick={() => deleteArt(p.id)} className={formStyles.deleteBtn}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GalleryEditor;