
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import FeaturedDishes from "./components/Menu/FeaturedDishes";
import Nosotros from "./components/Nosotros/Nosotros";
import Contact from "./components/Contact/Contact";
import AccessibilityWidget from "./components/AccessibilityWidget.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedDishes />
      <Nosotros />
      <Contact />
      <AccessibilityWidget />
    </>
  );
}

export default App;
