import React from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      className="py-12 bg-teal-600 text-white sm:py-16 lg:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 gap-x-8"
          variants={containerVariants}
        >
          {/* Brand Section */}
          <motion.div className="space-y-6" variants={sectionVariants}>
            <motion.div className="flex items-center space-x-3" variants={sectionVariants}>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="bg-white w-5 h-5 rounded-full shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <motion.div
                  className="bg-teal-200 w-3 h-3 rounded-full shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <motion.span
                className="text-2xl font-bold tracking-tight text-white"
                variants={sectionVariants}
              >
                Solvit
              </motion.span>
            </motion.div>
            <motion.p
              className="text-base leading-relaxed text-teal-100"
              variants={sectionVariants}
            >
              Your Partner in Progress—connecting you with expert counselors for life’s challenges.
            </motion.p>
            <motion.ul className="flex items-center space-x-4" variants={containerVariants}>
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, index) => (
                <motion.li
                  key={index}
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 bg-teal-700 rounded-full transition-all duration-300 hover:bg-teal-500"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Support Section */}
          <motion.div variants={sectionVariants}>
            <motion.p
              className="text-sm font-semibold tracking-widest text-teal-100 uppercase"
              variants={sectionVariants}
            >
              Support
            </motion.p>
            <motion.ul className="mt-6 space-y-4" variants={containerVariants}>
              {["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" className="text-base text-teal-50 hover:text-white hover:underline">
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
              className="text-sm font-semibold tracking-widest text-teal-100 uppercase"
              variants={sectionVariants}
            >
              Quick Links
            </motion.p>
            <motion.ul className="mt-6 space-y-4" variants={containerVariants}>
              {["About Us", "Counselors", "Pricing", "Blog"].map((item, index) => (
                <motion.li
                  key={index}
                  variants={listItemVariants}
                  whileHover={{ x: 5 }}
                >
                  <a href="#" className="text-base text-teal-50 hover:text-white hover:underline">
                    {item}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Divider and Copyright */}
        <motion.hr
          className="mt-12 mb-8 border-teal-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.p
          className="text-sm text-center text-teal-100"
          variants={sectionVariants}
        >
          © {new Date().getFullYear()}, All Rights Reserved by Solvit
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Footer;