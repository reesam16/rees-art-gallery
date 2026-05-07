import { useState, useEffect } from 'react';
import formStyles from './AdminForm.module.css';

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

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('shopItems')) || [];
        setAllShopItems(saved);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setItem(prev => ({ ...prev, image: reader.result, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const existing = JSON.parse(localStorage.getItem('shopItems')) || [];
        const newEntry = { ...item, id: Date.now() };
        
        const updated = [newEntry, ...existing];
        localStorage.setItem('shopItems', JSON.stringify(updated));
        setAllShopItems(updated);
        
        // Reset form
        setItem({ title: '', medium: '', dimensions: '', price: '', isSold: false, image: null, imagePreview: null });
        alert("Item added to shop!");
    };

    const deleteItem = (id) => {
        const updated = allShopItems.filter(i => i.id !== id);
        localStorage.setItem('shopItems', JSON.stringify(updated));
        setAllShopItems(updated);
    };

    return (
        <div className={formStyles.adminSectionWrapper}>
            <form className={formStyles.editorForm} onSubmit={handleSubmit}>
                <h3>Add New Shop Item</h3>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                {item.imagePreview && <img src={item.imagePreview} className={formStyles.previewImage} alt="Preview" />}
                
                <input type="text" placeholder="Title" value={item.title} onChange={e => setItem({...item, title: e.target.value})} />
                <input type="text" placeholder="Medium" value={item.medium} onChange={e => setItem({...item, medium: e.target.value})} />
                <input type="text" placeholder="Dimensions" value={item.dimensions} onChange={e => setItem({...item, dimensions: e.target.value})} />
                <input type="number" placeholder="Price" value={item.price} onChange={e => setItem({...item, price: e.target.value})} />
                
                <button type="submit" className={formStyles.saveBtn}>List Item</button>
            </form>

            <div className={formStyles.recentPosts}>
                <h3>Manage Shop Inventory</h3>
                <div className={formStyles.postGrid}>
                    {allShopItems.map((i) => (
                        <div key={i.id} className={formStyles.miniCard}>
                            <img src={i.imagePreview || i.image} alt="" />
                            <h4>{i.title}</h4>
                            <p>${i.price}</p>
                            <button onClick={() => deleteItem(i.id)} className={formStyles.deleteBtn}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShopEditor;