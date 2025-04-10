import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart,
  FaLock,
  FaGlobeAsia,
  FaHandsHelping,
  FaUserShield,
  FaUserCheck,
  FaWallet
} from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import teamPlaceholder from '../assets/vecteezy_two-women-sitting-in-chairs-talking_57226176.png'; // Replace with your image
import aboutHero from '../assets/vecteezy_wonderful-traditional-group-of-students-studying-together-in_57440118.png'; // Replace with your image

const AboutUs = () => {
  const stats = [
    { value: '10K+', label: 'Lives Touched', icon: <FaHeart className="text-teal-600 text-3xl" /> },
    { value: '500+', label: 'Verified Experts', icon: <FaUserCheck className="text-teal-600 text-3xl" /> },
    { value: '100%', label: 'Confidential', icon: <FaLock className="text-teal-600 text-3xl" /> },
    { value: '24/7', label: 'Support Available', icon: <FaHandsHelping className="text-teal-600 text-3xl" /> },
  ];

  const values = [
    {
      title: "Empathy First",
      description: "We listen without judgment and meet you where you are in your journey.",
      icon: <FaHeart className="text-teal-500 text-2xl" />
    },
    {
      title: "Privacy Matters",
      description: "Your sessions are completely secure and confidential with end-to-end encryption.",
      icon: <FaLock className="text-teal-500 text-2xl" />
    },
    {
      title: "Holistic Help",
      description: "Mental, emotional, academic, and career guidance — all under one roof.",
      icon: <GiBrain className="text-teal-500 text-2xl" />
    },
    {
      title: "Made for India",
      description: "Built with understanding of local needs, languages, and cultural context.",
      icon: <FaGlobeAsia className="text-teal-500 text-2xl" />
    }
  ];

  const whyChooseUs = [
    {
      title: "Verified Experts",
      description: "Connect with certified counselors and coaches ensuring trusted, professional guidance.",
      icon: <FaUserShield className="text-teal-500 text-2xl" />
    },
    {
      title: "Personalized Support",
      description: "Tailored sessions to fit your unique needs with flexible consultation options.",
      icon: <FaHandsHelping className="text-teal-500 text-2xl" />
    },
    {
      title: "Affordable Access",
      description: "Budget-friendly pricing tiers making expert advice accessible to everyone.",
      icon: <FaWallet className="text-teal-500 text-2xl" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-700 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHero} 
            alt="Mental health support" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Your Partner in Personal Growth
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              We believe everyone deserves access to the right support at the right time.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-teal-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Find Your Expert
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={teamPlaceholder} 
                  alt="Our team" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-100 rounded-full opacity-20 blur-xl"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-teal-600">Mission</span> at Solvit
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Solvit was founded to break down barriers to mental health and personal development support in India. We recognized the stigma, high costs, and lack of accessibility preventing people from getting the help they need.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Today, we've created a safe space where individuals can connect with certified professionals across mental health, relationships, career, academics, and wellness - all from the comfort and privacy of their homes.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-all shadow-md"
              >
                Meet Our Experts
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We <span className="text-teal-600">Stand For</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do at Solvit to ensure you get the best support possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why <span className="text-teal-600">Choose Solvit</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering you with the right support to overcome life's challenges—accessible, expert, and tailored to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-t-4 border-teal-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Take the First Step?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Join thousands who've found support and guidance through Solvit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-teal-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Connect with an Expert
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Learn How It Works
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;