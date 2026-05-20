import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Gallery from './pages/Gallery/Gallery';
import Blog from './pages/Blog/Blog';
import BlogPost from './pages/Blog/BlogPost';
import AdminPages from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Contact from './pages/Contact/Contact';
import UpdatePassword from './pages/Admin/UpdatePassword'; 


function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check immediately if the page loaded with a recovery token in the URL hash
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      // If we see an access token coming from a recovery flow, force the view to the form
      navigate('/update-password');
    }

    // 2. Also keep the live listener active to handle session shifts smoothly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth Event Triggered:", event);
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="app-wrapper">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin" element={<AdminPages />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<h2>404: This page doesn't exist!</h2>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// 2. Keep the main App component clean, just wrapping everything in the Router
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;