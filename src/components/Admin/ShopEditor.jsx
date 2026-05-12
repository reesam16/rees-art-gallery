import { useState, useEffect } from 'react';
import formStyles from './AdminForm.module.css';
import { supabase } from '../../supabaseClient';

function ShopEditor() {
    const [item, setItem] = useState({
        title: '',
        medium: '',
        dimensions: '',
        price: '',
        isSold: false,
        image: null,
        imagePreview: null
    });

    const [allShopItems, setAllShopItems] = useState([]);
    const [file, setFile] = useState(null);

   // 1. Fetch items from Supabase on load
   const fetchShopItems = async () => {
    const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching shop items:", error.message);
    } else {
        setAllShopItems(data || []);
    }
};

useEffect(() => {
    fetchShopItems();
}, []);

const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setItem(prev => ({ ...prev, imagePreview: reader.result }));
        };
        reader.readAsDataURL(selectedFile);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Ensure a file was selected
    if (!file) return alert("Please upload a product image!");

    try {
        // 2. Upload Image to the shop-images bucket
        const fileName = `shop_${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('shop-images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 3. Get the Public URL for the uploaded image
        const { data: urlData } = supabase.storage
            .from('shop-images')
            .getPublicUrl(fileName);

        // 4. Insert the new item into the shop_items table
        const { error: insertError } = await supabase
            .from('shop_items')
            .insert([{
                title: item.title,
                medium: item.medium,
                dimensions: item.dimensions,
                price: parseFloat(item.price), // Essential for the numeric column
                isSold: item.isSold,
                image_url: urlData.publicUrl
            }]);

        if (insertError) throw insertError;

        alert("Item successfully listed in the shop!");
        
        // 5. Reset form and refresh list
        setItem({ title: '', medium: '', dimensions: '', price: '', isSold: false, imagePreview: null });
        setFile(null);
        e.target.reset(); // Resets the file input field
        fetchShopItems();

    } catch (err) {
        alert("Failed to add item: " + err.message);
    }
};

const deleteItem = async (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this item from inventory?");
    if (confirmed) {
        const { error } = await supabase
            .from('shop_items')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchShopItems();
        } else {
            alert("Error deleting: " + error.message);
        }
    }
};


    return (
        <div className={formStyles.adminSectionWrapper}>
    <form className={formStyles.editorForm} onSubmit={handleSubmit}>
        <h3 className={formStyles.recentTitle}>Add New Shop Item</h3>

        {/* IMAGE SECTION */}
        <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>Product Image</label>
            <div className={formStyles.imageUploadWrapper}>
                {item.imagePreview && (
                    <img src={item.imagePreview} className={formStyles.previewImage} alt="Preview" />
                )}
                <input 
                    type="file" 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className={formStyles.fileInput}
                />
            </div>
        </div>

        {/* TITLE SECTION */}
        <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>Item Title</label>
            <input 
                type="text" 
                className={formStyles.input}
                placeholder="e.g. Original Oil Study" 
                value={item.title} 
                onChange={e => setItem({...item, title: e.target.value})} 
                required
            />
        </div>

        {/* MEDIUM SECTION */}
        <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>Medium</label>
            <input 
                type="text" 
                className={formStyles.input}
                placeholder="Oil on Wood Panel" 
                value={item.medium} 
                onChange={e => setItem({...item, medium: e.target.value})} 
            />
        </div>

        {/* ROW FOR DIMENSIONS & PRICE */}
        <div className={formStyles.formRow} style={{ display: 'flex', gap: '20px' }}>
            <div className={formStyles.inputGroup} style={{ flex: 1 }}>
                <label className={formStyles.label}>Size</label>
                <input 
                    type="text" 
                    className={formStyles.input}
                    placeholder="11x14" 
                    value={item.dimensions} 
                    onChange={e => setItem({...item, dimensions: e.target.value})} 
                />
            </div>
            <div className={formStyles.inputGroup} style={{ flex: 1 }}>
                <label className={formStyles.label}>Price ($)</label>
                <input 
                    type="number" 
                    className={formStyles.input}
                    placeholder="0.00" 
                    value={item.price} 
                    onChange={e => setItem({...item, price: e.target.value})} 
                    required
                />
            </div>
        </div>

        <button type="submit" className={formStyles.saveBtn}>List Item</button>
    </form>

    {/* INVENTORY MANAGEMENT SECTION */}
    <div className={formStyles.recentPosts}>
        <h3 className={formStyles.recentTitle}>Manage Shop Inventory</h3>
        <div className={formStyles.postGrid}>
            {allShopItems.map((i) => (
                <div key={i.id} className={formStyles.miniCard}>
                    <img src={i.image_url} alt={i.title} />
                    <h4>{i.title}</h4>
                    <p>${i.price}</p>
                    <button onClick={() => deleteItem(i.id)} className={formStyles.deleteBtn}>
                        Remove Item
                    </button>
                </div>
            ))}
        </div>
    </div>
</div>
    );
}

export default ShopEditor;