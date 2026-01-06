import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const galleryItems = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format',
    title: 'Classic Cuts',
    subtitle: 'Timeless elegance'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format',
    title: 'Beard Styling',
    subtitle: 'Precision grooming'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format',
    title: 'Hair Color',
    subtitle: 'Vibrant transformation'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format',
    title: 'Spa Treatment',
    subtitle: 'Ultimate relaxation'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format',
    title: 'Styling',
    subtitle: 'Modern looks'
  }
];

export default function GallerySection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 bg-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Our Craft
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            A glimpse into the artistry that defines Hairy
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Left scroll */}
        <motion.div
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
          className="flex gap-6 mb-6"
        >
          {[...galleryItems, ...galleryItems].map((item, index) => (
            <GalleryCard key={index} item={item} index={index} />
          ))}
        </motion.div>

        {/* Right scroll */}
        <motion.div
          style={{ x: useTransform(scrollYProgress, [0, 1], [-200, 0]) }}
          className="flex gap-6"
        >
          {[...galleryItems.reverse(), ...galleryItems].map((item, index) => (
            <GalleryCard key={index} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function GalleryCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden group cursor-pointer"
    >
      <img
        src={item.src}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-xl font-medium text-white mb-1">{item.title}</h3>
        <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.subtitle}
        </p>
      </div>
    </motion.div>
  );
}