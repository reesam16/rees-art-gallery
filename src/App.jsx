import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Gallery from './pages/Gallery/Gallery';
import Blog from './pages/Blog/Blog';
import BlogPost from './pages/Blog/BlogPost';
import AdminPages from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Contact from './pages/Contact/Contact';


function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <main>
          <Routes>
            {/* These "Paths" tell the browser what to show based on the URL */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin" element={<AdminPages />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<h2>404: This page doesn't exist!</h2>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;