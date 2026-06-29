import './styles/globals.css'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/cart'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Portfolio from './pages/Portfolio.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import ProductSearch from './pages/ProductSearch.jsx'

export default function App() {
  return (
    <CartProvider>
      <Nav />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/accessories" element={<ProductSearch />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </CartProvider>
  )
}