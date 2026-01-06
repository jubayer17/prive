import Layout from "./Layout.jsx";

import About from "./About";

import AdminDashboard from "./AdminDashboard";

import BarberCalendar from "./BarberCalendar";

import BarberProfile from "./BarberProfile";

import Barbers from "./Barbers";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import Booking from "./Booking";

import BookingHistory from "./BookingHistory";

import Contact from "./Contact";

import EditorDashboard from "./EditorDashboard";

import FAQ from "./FAQ";

import FaceAnalyzer from "./FaceAnalyzer";

import GiftCards from "./GiftCards";

import HairTips from "./HairTips";

import Home from "./Home";

import Memberships from "./Memberships";

import MyMembership from "./MyMembership";

import Privacy from "./Privacy";

import Profile from "./Profile";

import Reviews from "./Reviews";

import SavedBarbers from "./SavedBarbers";

import ServiceMatch from "./ServiceMatch";

import Services from "./Services";

import StyleQuiz from "./StyleQuiz";

import SuperAdminDashboard from "./SuperAdminDashboard";

import Terms from "./Terms";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    About: About,
    
    AdminDashboard: AdminDashboard,
    
    BarberCalendar: BarberCalendar,
    
    BarberProfile: BarberProfile,
    
    Barbers: Barbers,
    
    Blog: Blog,
    
    BlogPost: BlogPost,
    
    Booking: Booking,
    
    BookingHistory: BookingHistory,
    
    Contact: Contact,
    
    EditorDashboard: EditorDashboard,
    
    FAQ: FAQ,
    
    FaceAnalyzer: FaceAnalyzer,
    
    GiftCards: GiftCards,
    
    HairTips: HairTips,
    
    Home: Home,
    
    Memberships: Memberships,
    
    MyMembership: MyMembership,
    
    Privacy: Privacy,
    
    Profile: Profile,
    
    Reviews: Reviews,
    
    SavedBarbers: SavedBarbers,
    
    ServiceMatch: ServiceMatch,
    
    Services: Services,
    
    StyleQuiz: StyleQuiz,
    
    SuperAdminDashboard: SuperAdminDashboard,
    
    Terms: Terms,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<About />} />
                
                
                <Route path="/About" element={<About />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/BarberCalendar" element={<BarberCalendar />} />
                
                <Route path="/BarberProfile" element={<BarberProfile />} />
                
                <Route path="/Barbers" element={<Barbers />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/Booking" element={<Booking />} />
                
                <Route path="/BookingHistory" element={<BookingHistory />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/EditorDashboard" element={<EditorDashboard />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/FaceAnalyzer" element={<FaceAnalyzer />} />
                
                <Route path="/GiftCards" element={<GiftCards />} />
                
                <Route path="/HairTips" element={<HairTips />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Memberships" element={<Memberships />} />
                
                <Route path="/MyMembership" element={<MyMembership />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Reviews" element={<Reviews />} />
                
                <Route path="/SavedBarbers" element={<SavedBarbers />} />
                
                <Route path="/ServiceMatch" element={<ServiceMatch />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/StyleQuiz" element={<StyleQuiz />} />
                
                <Route path="/SuperAdminDashboard" element={<SuperAdminDashboard />} />
                
                <Route path="/Terms" element={<Terms />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}