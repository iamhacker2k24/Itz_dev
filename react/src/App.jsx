import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import DevAI from "./components/dev_ai";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-400 overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <Navbar />
      <Hero />
      <About /> 
      <Services />
      <Projects />
      <Contact />
      <Footer />
      <DevAI />
    </div>
  );
}

export default App;