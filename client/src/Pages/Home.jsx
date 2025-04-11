import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import OurServices from "../Components/OurServices";
import WhySolvit from "../Components/WhySolvit";
import OurMission from "../Components/OurMission";
import HowItWorks from "../Components/HowItWorks";
import Review from "../Components/Review";
import Faq from "../Components/Faq";
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
      {/* <OurMission /> */}
      <HowItWorks />
      <WhySolvit />
      <Review />
      <Faq />
      <Footer />
    </>
  );
};

export default Home;