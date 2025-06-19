import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">About Vin2Grow</h1>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our journey in crafting timeless wooden treasures
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
            {/* Story Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Our Story</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    This handcrafted miniature wooden house showcases the timeless beauty of traditional Indian architecture.
                    Built entirely from natural wood materials, it reflects intricate detailing — from the layered shingle roof to the ornate pillars and doors adorned with colorful tribal patterns.
                    The design evokes a sense of cultural heritage and craftsmanship, celebrating the rich artistry of rural India. 
                    Such pieces not only serve as decorative art but also carry the soul of generations of skilled artisans, making them both nostalgic and unique. 
                    It's a perfect symbol of Vin2Grow’s vision — blending tradition with creative expression through sustainable wooden creations.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    At the heart of our vision is a blend of tradition and modern utility. Every piece crafted tells a story 
                    of skilled hands, sustainable materials, and a deep respect for nature. We offer beautifully handcrafted 
                    wooden products that not only serve a purpose but also add soul to your space.
                  </p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-lg overflow-hidden h-64 group"
                >
                  <img
                    src="https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749717841/cwuak5ryngud40gtpe1c.jpg"
                    alt="Our Story"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Mission, Vision, Values Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Mission */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-700 hover:bg-gray-600 p-6 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/7198/7198217.png" 
                    alt="Our Mission" 
                    className="w-6 h-6 filter invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">Our Mission</h3>
                <p className="text-gray-300">
                  To create handcrafted wooden products that blend traditional craftsmanship with modern 
                  functionality, using sustainable materials and ethical practices.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-700 hover:bg-gray-600 p-6 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/7653/7653862.png" 
                    alt="Our Vision" 
                    className="w-6 h-6 filter invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">Our Vision</h3>
                <p className="text-gray-300">
                  To become a globally recognized brand for premium wooden crafts that preserve traditional 
                  techniques while innovating for contemporary lifestyles.
                </p>
              </motion.div>

              {/* Values */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-700 hover:bg-gray-600 p-6 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/18866/18866935.png" 
                    alt="Our Values" 
                    className="w-6 h-6 filter invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">Our Values</h3>
                <p className="text-gray-300">
                  Craftsmanship, sustainability, authenticity, and customer satisfaction guide our every 
                  decision in creating products that stand the test of time.
                </p>
              </motion.div>
            </motion.div>

            {/* Additional Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">The Vin2Grow Promise</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Every wooden piece carries a heartbeat — a quiet echo of our love for tradition, nature, 
                and the comfort of home. These aren't just products; they're memories carved with care, 
                inspired by the warmth of childhood, and made to last for generations.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-3">Sustainable Materials</h3>
                  <p className="text-gray-300">
                    We source our wood responsibly from sustainable forests, ensuring minimal environmental 
                    impact while maintaining the highest quality standards.
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-3">Artisan Craftsmanship</h3>
                  <p className="text-gray-300">
                    Each product is handcrafted by skilled artisans who combine traditional techniques with 
                    meticulous attention to detail.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
