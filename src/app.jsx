import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import Navbar from './components/navbar';
import Loader from './components/loader';
import CustomCursor from './components/customcursor';
import ScrollProgress from './components/scrollprogress';
import CursorBlob from './components/cursorblob';

import { ThemeProvider } from './context/themecontext';

import Contact from './sections/contact';
import Me from './sections/me';
import About from './sections/about';
import Projects from './sections/projects';
import Skills from './sections/skills';
import Experience from './sections/experience';
import Footer from './sections/footer';

import ChatbotPage from './pages/chatbotpage';

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="relative cursor">
      <CursorBlob />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      {/* Uncomment this if you want chatbot button back */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/chatbot")}
          className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 transition"
        >
          <img
            src="/chatbot-icon.png"
            alt="Chatbot"
            className="w-6 h-6"
          />
          <span>Chatbot</span>
        </button>
      </div> */}

      <main className="pt-16 space-y-20">
        <section id="me"><Me /></section>
        <section id="about"><About /></section>
        <section id="projects"><Projects /></section>
        <section id="skills"><Skills /></section>
        <section id="experience"><Experience /></section>
        <section id="contact"><Contact /></section>
      </main>

      <section id="footer"><Footer /></section>
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark'); // ✅ Force dark mode
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
