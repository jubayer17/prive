import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GenderToggle({ value, onChange, className }) {
  return (
    <div className={cn("relative inline-flex items-center p-1 bg-stone-100 rounded-full", className)}>
      <motion.div
        className="absolute h-[calc(100%-8px)] bg-stone-900 rounded-full"
        initial={false}
        animate={{
          x: value === 'male' ? 4 : '100%',
          width: value === 'male' ? '48%' : '48%'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
      <button
        onClick={() => onChange('male')}
        className={cn(
          "relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
          value === 'male' ? 'text-white' : 'text-stone-600 hover:text-stone-900'
        )}
      >
        Men
      </button>
      <button
        onClick={() => onChange('female')}
        className={cn(
          "relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
          value === 'female' ? 'text-white' : 'text-stone-600 hover:text-stone-900'
        )}
      >
        Women
      </button>
    </div>
  );
}