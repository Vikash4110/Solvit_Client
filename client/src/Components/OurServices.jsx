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
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    description: [
      "Anxiety & Stress Management",
      "Depression Counseling",
      "Trauma & PTSD Counseling",
      "Grief & Loss Support",
      "Addiction Counseling",
    ],
  },
  {
    title: "Career & Professional Counseling",
    icon: <FaBriefcase />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: [
      "Career Guidance & Job Search Support",
      "Workplace Stress & Burnout Counseling",
      "Leadership & Executive Coaching",
      "Entrepreneurship Coaching",
    ],
  },
  {
    title: "Health & Wellness Counseling",
    icon: <FaHeartbeat />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: [
      "Nutrition & Diet Counseling",
      "Fitness & Lifestyle Coaching",
      "Chronic Illness Support",
    ],
  },
  {
    title: "Life Coaching & Personal Development",
    icon: <FaRocket />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: [
      "Confidence & Self-Esteem Coaching",
      "Goal-Setting & Productivity Coaching",
      "Time Management Counseling",
    ],
  },
  {
    title: "Relationship & Family Counseling",
    icon: <FaUsers />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: [
      "Couples & Marriage Counseling",
      "Divorce & Separation Counseling",
      "Family Therapy",
      "Parenting Guidance",
    ],
  },
  {
    title: "Academic & Student Counseling",
    icon: <FaGraduationCap />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: [
      "Study Skills & Academic Performance Coaching",
      "Stress & Exam Anxiety Management",
      "College & Career Planning",
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
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
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
      className="py-16 bg-gray-100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div className="text-center mb-12" variants={containerVariants}>
          <motion.h2 className="text-4xl font-bold text-gray-800 mb-4" variants={headerVariants}>
            Our Services
          </motion.h2>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto" variants={headerVariants}>
            Discover expert counseling and coaching tailored to your needs, delivered by verified professionals.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl ${service.bgColor} shadow-md transition-shadow duration-300`}
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-4 mx-auto"
                variants={headerVariants}
              >
                <span className={`text-2xl ${service.color}`}>{service.icon}</span>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-800 text-center mb-3"
                variants={headerVariants}
              >
                {service.title}
              </motion.h3>
              <motion.ul className="text-gray-600 space-y-2" variants={containerVariants}>
                {service.description.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="text-sm flex items-start"
                    variants={listItemVariants}
                  >
                    <span className={`mr-2 ${service.color}`}>•</span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div className="text-center mt-12" variants={containerVariants}>
          <motion.a
            href="/client-register"
            className="inline-block px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started Today
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurServices;