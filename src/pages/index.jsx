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

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

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
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split("/").pop();
  if (urlLastPart.includes("?")) {
    urlLastPart = urlLastPart.split("?")[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || "Home";
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />

        <Route path="/barbercalendar" element={<BarberCalendar />} />

        <Route path="/barberprofile" element={<BarberProfile />} />

        <Route path="/barbers" element={<Barbers />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/blogpost" element={<BlogPost />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/bookinghistory" element={<BookingHistory />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/editordashboard" element={<EditorDashboard />} />

        <Route path="/faq" element={<FAQ />} />

        <Route path="/faceanalyzer" element={<FaceAnalyzer />} />

        <Route path="/giftcards" element={<GiftCards />} />

        <Route path="/hairtips" element={<HairTips />} />

        <Route path="/home" element={<Home />} />

        <Route path="/memberships" element={<Memberships />} />

        <Route path="/mymembership" element={<MyMembership />} />

        <Route path="/privacy" element={<Privacy />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/reviews" element={<Reviews />} />

        <Route path="/savedbarbers" element={<SavedBarbers />} />

        <Route path="/servicematch" element={<ServiceMatch />} />

        <Route path="/services" element={<Services />} />

        <Route path="/stylequiz" element={<StyleQuiz />} />

        <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />

        <Route path="/terms" element={<Terms />} />
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
