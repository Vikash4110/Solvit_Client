import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaUsers, FaDollarSign } from "react-icons/fa";

const reasons = [
  {
    icon: <FaCheckCircle />,
    title: "Verified Experts",
    description:
      "Connect with certified counselors and coaches across mental health, career, and more, ensuring you get trusted, professional guidance.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: <FaUsers />,
    title: "Personalized Support",
    description:
      "Tailored sessions to fit your unique needs, with flexible one-on-one consultations, bundles, or subscription plans.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <FaDollarSign />,
    title: "Affordable Access",
    description:
      "Break down barriers with budget-friendly pricing tiers, making expert advice accessible to everyone, anytime.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

const WhySolvit = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
  };

  return (
    <motion.section
      className="py-16 bg-gray-100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div className="text-center mb-12" variants={containerVariants}>
          <motion.h2 className="text-4xl font-bold text-gray-800 mb-4" variants={headerVariants}>
            Why Choose Solvit?
          </motion.h2>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto" variants={headerVariants}>
            Empowering you with the right support to overcome life’s challenges—accessible, expert, and tailored to you.
          </motion.p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl ${reason.bgColor} shadow-md transition-shadow duration-300 text-center`}
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-4 mx-auto"
                variants={headerVariants}
              >
                <span className={`text-2xl ${reason.color}`}>{reason.icon}</span>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-800 mb-3"
                variants={headerVariants}
              >
                {reason.title}
              </motion.h3>
              <motion.p className="text-gray-600 text-sm" variants={headerVariants}>
                {reason.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhySolvit;