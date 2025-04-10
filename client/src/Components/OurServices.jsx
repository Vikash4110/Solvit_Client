import React from "react";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaBriefcase,
  FaHeartbeat,
  FaRocket,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";

const services = [
  {
    title: "Mental Health Counseling",
    icon: <FaBrain />,
    color: "text-teal-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-teal-100",
    borderColor: "border-teal-200",
    description: [
      "Anxiety & Stress Management",
      "Depression Counseling",
      "Trauma & PTSD Support",
      "Grief & Loss Guidance",
      "Addiction Recovery",
    ],
  },
  {
    title: "Career & Professional Coaching",
    icon: <FaBriefcase />,
    color: "text-indigo-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    borderColor: "border-indigo-200",
    description: [
      "Career Path Guidance",
      "Workplace Stress Relief",
      "Leadership Development",
      "Entrepreneurship Support",
    ],
  },
  {
    title: "Health & Wellness Coaching",
    icon: <FaHeartbeat />,
    color: "text-red-500",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    borderColor: "border-red-200",
    description: [
      "Nutrition & Diet Plans",
      "Fitness Lifestyle Coaching",
      "Chronic Illness Care",
    ],
  },
  {
    title: "Life & Personal Development",
    icon: <FaRocket />,
    color: "text-purple-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    description: [
      "Confidence Building",
      "Goal Setting & Productivity",
      "Time Management Skills",
    ],
  },
  {
    title: "Relationship & Family Therapy",
    icon: <FaUsers />,
    color: "text-orange-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    description: [
      "Couples Counseling",
      "Divorce & Separation Support",
      "Family Dynamics Therapy",
      "Parenting Strategies",
    ],
  },
  {
    title: "Academic & Student Support",
    icon: <FaGraduationCap />,
    color: "text-green-500",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    borderColor: "border-green-200",
    description: [
      "Study Skills Enhancement",
      "Exam Anxiety Management",
      "College & Career Prep",
    ],
  },
];

const OurServices = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: {
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      className="py-20 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div className="text-center mb-16" variants={containerVariants}>
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600"
            variants={headerVariants}
          >
            Our Services
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
            variants={headerVariants}
          >
            Explore a wide range of expert counseling and coaching services, crafted to empower your personal and professional growth.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-2xl ${service.bgColor} border ${service.borderColor} shadow-lg transition-all duration-300`}
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md mb-6 mx-auto"
                variants={headerVariants}
              >
                <span className={`text-3xl ${service.color}`}>
                  {service.icon}
                </span>
              </motion.div>
              <motion.h3
                className="text-2xl font-semibold text-gray-900 text-center mb-4"
                variants={headerVariants}
              >
                {service.title}
              </motion.h3>
              <motion.ul
                className="text-gray-600 space-y-3"
                variants={containerVariants}
              >
                {service.description.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="text-base flex items-start"
                    variants={listItemVariants}
                  >
                    <span className={`mr-2 ${service.color} text-lg`}>•</span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          variants={containerVariants}
        >
          <motion.a
            href="/client-register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-teal-600 hover:to-indigo-700 transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Start Your Journey Today
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurServices;