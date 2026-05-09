import { useState, useEffect } from 'react';
import formStyles from './AdminForm.module.css';

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
        const saved = JSON.parse(localStorage.getItem('galleryItems')) || [];
        setAllArt(saved);
    }, []);

    // ADDED THIS FUNCTION
    const deleteArt = (indexToDelete) => {
        const updated = allArt.filter((_, index) => index !== indexToDelete);
        localStorage.setItem('galleryItems', JSON.stringify(updated));
        setAllArt(updated);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setArt(prev => ({ ...prev, image: reader.result, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Attempting to save painting..."); // This will show in the console

        try {
            const existing = JSON.parse(localStorage.getItem('galleryItems')) || [];

            // We create a clean object to save
            const newEntry = {
                id: Date.now(),
                title: art.title,
                medium: art.medium,
                dimensions: art.dimensions,
                price: art.price,
                category: art.category, // 2. Included category in the saved object
                image: art.image,
                imagePreview: art.image // This is the base64 string from the reader
            };

            const updated = [newEntry, ...existing];
            localStorage.setItem('galleryItems', JSON.stringify(updated));

            setAllArt(updated);
            setArt({
                title: '',
                medium: '',
                dimensions: '',
                price: '',
                category: 'valle-crucis', // Reset to default
                image: null,
                imagePreview: null
            });
            alert("Success! Check Local Storage now.");
        } catch (err) {
            console.error("Save failed:", err);
            alert("Could not save. The image might be too large.");
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
                        type="number"
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
                        <div key={index} className={formStyles.miniCard}>
                            {p.imagePreview && <img src={p.imagePreview} alt="" />}
                            <h4>{p.title}</h4>
                            <span className={formStyles.categoryTag}>{p.category}</span>
                            <p>{p.medium} {p.dimensions && `(${p.dimensions})`}</p> {/* Shows size in parens */}
                            <p>${p.price}</p>
                            <button onClick={() => deleteArt(index)} className={formStyles.deleteBtn}>
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