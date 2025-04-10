import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import user1 from '../assets/he-knows-what-he-wants.webp'; // Replace with your image
import user2 from '../assets/he-knows-what-he-wants.webp'; // Replace with your image
import user3 from '../assets/he-knows-what-he-wants.webp'; // Replace with your image

const Review = () => {
  const testimonials = [
    {
      name: "Anjali Sharma",
      role: "Software Engineer",
      location: "Mumbai",
      rating: 5,
      content: "Solvit helped me manage my work stress and regain my confidence. The counselor was empathetic and truly understood my challenges!",
      image: user1
    },
    {
      name: "Rahul Verma",
      role: "College Student",
      location: "Delhi",
      rating: 5,
      content: "I was lost about my career path, but my coach on Solvit guided me step-by-step. My grades and focus have improved so much!",
      image: user2
    },
    {
      name: "Priya Nair",
      role: "Homemaker",
      location: "Bengaluru",
      rating: 4,
      content: "The platform’s privacy gave me the courage to seek help for my anxiety. It’s been a life-changing experience, happy to spent more time again here!",
      image: user3
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-teal-600">People Across India</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from individuals who found support and growth through Solvit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              
              <FaQuoteLeft className="text-teal-200 text-3xl mb-4" />
              
              <p className="text-gray-700 italic mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-teal-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-all shadow-md"
          >
            Explore More Stories
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Review;