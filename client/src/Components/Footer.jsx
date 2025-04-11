import React from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

// Define social media links (replace with your actual URLs)
const socialLinks = [
  { Icon: FaTwitter, url: "https://x.com/solvitforyou?s=21" },
  { Icon: FaFacebook, url: "https://www.facebook.com/share/12HYipkeXG9/?mibextid=wwXIfr" },
  { Icon: FaInstagram, url: "https://www.instagram.com/solvitcounselling?igsh=MWhuaWNsdHl3Nm4wZA==" },
  { Icon: FaLinkedin, url: "https://www.linkedin.com/company/solvitcounselling/" },
];

const Footer = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Animation variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    hover: { x: 5, transition: { duration: 0.3 } },
  };

  // Animation variants for social icons
  const socialVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.15, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      className="py-16 bg-gradient-to-b from-teal-700 to-teal-900 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 gap-x-12">
          {/* Brand Section */}
          <motion.div className="space-y-6" variants={sectionVariants}>
            <motion.div className="flex items-center space-x-3" variants={sectionVariants}>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="bg-white w-6 h-6 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <motion.div
                  className="bg-teal-300 w-4 h-4 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <motion.span
                className="text-3xl font-extrabold tracking-tight text-white"
                variants={sectionVariants}
              >
                Solvit
              </motion.span>
            </motion.div>
            <motion.p
              className="text-base leading-relaxed text-teal-100"
              variants={sectionVariants}
            >
              Your trusted partner in personal growth—connecting you with expert counselors across India.
            </motion.p>
            {/* Social Media Links */}
            <motion.ul className="flex items-center space-x-5" variants={containerVariants}>
              {socialLinks.map(({ Icon, url }, index) => (
                <motion.li
                  key={index}
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <a
                    href={url}
                    className="flex items-center justify-center w-12 h-12 bg-teal-800 rounded-full hover:bg-teal-600 transition-all duration-300 shadow-md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Support Section */}
          <motion.div variants={sectionVariants}>
            <motion.p
              className="text-sm font-semibold tracking-widest text-teal-200 uppercase"
              variants={sectionVariants}
            >
              Support
            </motion.p>
            <motion.ul className="mt-6 space-y-5" variants={containerVariants}>
              {["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"].map(
                (item, index) => (
                  <motion.li key={index} variants={listItemVariants} whileHover="hover">
                    <a
                      href="#"
                      className="text-base text-teal-100 hover:text-white hover:underline transition-all duration-200"
                    >
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </motion.ul>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div variants={sectionVariants}>
            <motion.p
              className="text-sm font-semibold tracking-widest text-teal-200 uppercase"
              variants={sectionVariants}
            >
              Quick Links
            </motion.p>
            <motion.ul className="mt-6 space-y-5" variants={containerVariants}>
              {["About Us", "Counselors", "Pricing", "Blog"].map((item, index) => (
                <motion.li key={index} variants={listItemVariants} whileHover="hover">
                  <a
                    href="#"
                    className="text-base text-teal-100 hover:text-white hover:underline transition-all duration-200"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div variants={sectionVariants}>
            <motion.p
              className="text-sm font-semibold tracking-widest text-teal-200 uppercase"
              variants={sectionVariants}
            >
              Get in Touch
            </motion.p>
            <motion.ul className="mt-6 space-y-5" variants={containerVariants}>
              <motion.li variants={listItemVariants}>
                <p className="text-base text-teal-100">Email: support@solvit.in</p>
              </motion.li>
              <motion.li variants={listItemVariants}>
                <p className="text-base text-teal-100">Phone: +91 123-456-7890</p>
              </motion.li>
              <motion.li variants={listItemVariants}>
                <p className="text-base text-teal-100">India HQ: Bengaluru, Karnataka</p>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>

        {/* Divider and Copyright */}
        <motion.hr
          className="mt-16 mb-8 border-teal-500 opacity-50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.p
          className="text-sm text-center text-teal-200"
          variants={sectionVariants}
        >
          © {new Date().getFullYear()} Solvit. All Rights Reserved.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Footer;