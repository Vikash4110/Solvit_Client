import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import OurServices from "../Components/OurServices";
import WhySolvit from "../Components/WhySolvit";
import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: true,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <>
      <HeroSection />
      <OurServices />
      <WhySolvit />
      <Footer />
    </>
  );
};

export default Home;