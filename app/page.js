import Image from "next/image";
import Hero from "./components/Hero";
import About from "./components/About";
import JoinUs from "./components/JoinUs";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <JoinUs />
      <Services />
      <Contact />
      <Carousel />
      <Footer />
    </>
  );
}
