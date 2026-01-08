import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { Users, Scissors, Award, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const stats = [
  {
    icon: Users,
    value: 10000,
    label: "Happy Clients",
    prefix: "",
    suffix: "+",
    format: true,
  },
  {
    icon: Scissors,
    value: 50000,
    label: "Haircuts Done",
    prefix: "",
    suffix: "+",
    format: true,
  },
  {
    icon: Award,
    value: 15,
    label: "Years Experience",
    prefix: "",
    suffix: "+",
    format: false,
  },
  {
    icon: Calendar,
    value: 99,
    label: "Booking Rate",
    prefix: "",
    suffix: "%",
    format: false,
  },
];

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  format = false,
  delay = 0,
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, motionValue, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const roundedValue = Math.round(latest);
        const displayValue = format
          ? roundedValue.toLocaleString()
          : roundedValue.toString();
        ref.current.textContent = `${prefix}${displayValue}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, format]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

AnimatedNumber.propTypes = {
  value: PropTypes.number.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  format: PropTypes.bool,
  delay: PropTypes.number,
};

export default function StatsSection() {
  return (
    <section className="py-20 bg-stone-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-4">
                  <Icon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-4xl md:text-5xl font-light text-white mb-2">
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    format={stat.format}
                    delay={index * 0.1}
                  />
                </div>
                <div className="text-stone-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
