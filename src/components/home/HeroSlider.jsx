import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

import slide1 from "/assets/andrea-donato-MNu0n-3BIKs-unsplash.jpg";
import slide2 from "/assets/cesar-badilla-miranda-t34TLxxmwws-unsplash.jpg";
import slide3 from "/assets/lindsay-cash-Md_DhaFsnCQ-unsplash.jpg";
import slide4 from "/assets/rosa-rafael-Pe9IXUuC6QU-unsplash.jpg";
import slide5 from "/assets/woman-visiting-cosmetologist-making-rejuvenation-procedures.jpg";

const preloadImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

const OptimizedSlideImage = memo(function OptimizedSlideImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="eager"
      decoding="async"
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
    />
  );
});

OptimizedSlideImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const slides = [
  {
    id: 1,
    image: slide1,
    tagline: "Premium Beauty Experience",
    heading: "Discover Your",
    headingHighlight: "Inner Glow",
    subheading:
      "Where artistry meets elegance. Experience transformative beauty services crafted by master stylists in an atmosphere of refined luxury.",
    buttonText: "Book Your Experience",
    buttonLink: "Booking",
  },
  {
    id: 2,
    image: slide2,
    tagline: "Expert Stylists",
    heading: "Crafted with",
    headingHighlight: "Precision",
    subheading:
      "Our world-class team brings decades of expertise to every appointment. Personalized consultations ensure your unique vision comes to life.",
    buttonText: "Meet Our Team",
    buttonLink: "Barbers",
  },
  {
    id: 3,
    image: slide3,
    tagline: "Exclusive Memberships",
    heading: "Join the",
    headingHighlight: "Glowé Circle",
    subheading:
      "Unlock premium benefits, priority booking, and exclusive member-only treatments. Elevate your beauty routine with our VIP experience.",
    buttonText: "Explore Memberships",
    buttonLink: "Memberships",
  },
  {
    id: 4,
    image: slide4,
    tagline: "Signature Treatments",
    heading: "Radiance",
    headingHighlight: "Redefined",
    subheading:
      "Indulge in our curated selection of premium treatments designed to rejuvenate, refresh, and reveal your natural beauty.",
    buttonText: "View Services",
    buttonLink: "Services",
  },
  {
    id: 5,
    image: slide5,
    tagline: "Spa & Wellness",
    heading: "Relax &",
    headingHighlight: "Rejuvenate",
    subheading:
      "Escape the everyday with our luxurious spa treatments. From facials to full-body therapies, experience complete relaxation and renewal.",
    buttonText: "Book Spa Treatment",
    buttonLink: "Booking",
  },
];

const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.02,
  },
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1,
  },
  exit: {
    zIndex: 0,
    opacity: 0,
    scale: 1.02,
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HeroSlider() {
  const [[page], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideIndex = ((page % slides.length) + slides.length) % slides.length;

  const slideImages = useMemo(() => slides.map((s) => s.image), []);

  useEffect(() => {
    preloadImages(slideImages);
  }, [slideImages]);

  const paginate = useCallback(
    (newDirection) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, paginate]);

  const goToSlide = (index) => {
    const newDirection = index > slideIndex ? 1 : -1;
    setPage([index, newDirection]);
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={page}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.8, ease: "easeInOut" },
            scale: { duration: 1, ease: "easeOut" },
          }}
          className="absolute inset-0"
          style={{
            willChange: "opacity, transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0, 0, 0)",
            WebkitTransform: "translate3d(0, 0, 0)",
          }}
        >
          <motion.div
            key={`ken-burns-${page}`}
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translate3d(0, 0, 0)",
              WebkitTransform: "translate3d(0, 0, 0)",
            }}
          >
            <OptimizedSlideImage
              src={slides[slideIndex].image}
              alt={slides[slideIndex].heading}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-stone-950/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <motion.div
                  custom={0}
                  variants={textVariants}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full backdrop-blur-sm"
                >
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-amber-200 text-sm font-medium tracking-wide">
                    {slides[slideIndex].tagline}
                  </span>
                </motion.div>

                <motion.h1
                  custom={0.1}
                  variants={textVariants}
                  className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight"
                >
                  <span className="font-extralight">
                    {slides[slideIndex].heading}
                  </span>
                  <br />
                  <span className="font-semibold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent">
                    {slides[slideIndex].headingHighlight}
                  </span>
                </motion.h1>

                <motion.p
                  custom={0.2}
                  variants={textVariants}
                  className="text-lg md:text-xl text-stone-300 max-w-xl font-light leading-relaxed"
                >
                  {slides[slideIndex].subheading}
                </motion.p>

                <motion.div
                  custom={0.3}
                  variants={textVariants}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <Link to={createPageUrl(slides[slideIndex].buttonLink)}>
                    <Button
                      size="lg"
                      className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-6 text-base font-medium rounded-full group transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
                    >
                      {slides[slideIndex].buttonText}
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Services")}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 text-base font-medium rounded-full backdrop-blur-sm transition-all duration-300"
                    >
                      View Services
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 z-20 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 pointer-events-auto group"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 pointer-events-auto group"
        >
          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                index === slideIndex
                  ? "w-12 bg-amber-400"
                  : "w-8 bg-white/30 hover:bg-white/50"
              }`}
            />
            {index === slideIndex && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 h-1 rounded-full bg-amber-400"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2">
        <span className="text-4xl font-light text-white">
          {String(slideIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-stone-500">/</span>
        <span className="text-stone-500">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-8 z-20 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-stone-400 uppercase tracking-widest rotate-90 origin-center translate-x-4">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-stone-600 rounded-full flex items-start justify-center p-2">
            <motion.div className="w-1 h-2 bg-amber-400 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
