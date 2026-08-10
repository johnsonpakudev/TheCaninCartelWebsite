import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HomeClassic from './pages/HomeClassic';
import Method from './pages/Method';
import Classes from './pages/Classes';
import Booking from './pages/Booking';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './styles/chrome.css';

function AppShell() {
    const { pathname } = useLocation();
    const isFullBleed =
      pathname === '/' || pathname === '/programs' || pathname === '/about' || pathname === '/booking';

    return (
        <div className="app-container">
            <Navbar />
            <main className={isFullBleed ? 'site-main' : 'content'}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home-classic" element={<HomeClassic />} />
                    <Route path="/about" element={<Method />} />
                    <Route path="/programs" element={<Classes />} />
                    <Route path="/booking" element={<Booking />} />
                </Routes>
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AppShell />
        </Router>
    );
}

export default App;
