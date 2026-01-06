import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Scissors, 
  Heart, 
  History, 
  User, 
  Crown,
  ChevronRight,
  X,
  Palette,
  Lightbulb,
  Search
} from 'lucide-react';

const sidebarTools = [
  { 
    id: 'quiz', 
    name: 'Style Quiz', 
    icon: Sparkles, 
    description: 'Find your perfect style',
    page: 'StyleQuiz'
  },
  { 
    id: 'analyzer', 
    name: 'Face Shape', 
    icon: Palette, 
    description: 'Discover your face shape',
    page: 'FaceAnalyzer'
  },
  { 
    id: 'tips', 
    name: 'Hair Care Tips', 
    icon: Lightbulb, 
    description: 'Expert grooming advice',
    page: 'HairTips'
  },
  { 
    id: 'match', 
    name: 'Service Match', 
    icon: Search, 
    description: 'Find the right service',
    page: 'ServiceMatch'
  },
  { 
    id: 'history', 
    name: 'Booking History', 
    icon: History, 
    description: 'View past appointments',
    page: 'BookingHistory'
  },
  { 
    id: 'saved', 
    name: 'Saved Stylists', 
    icon: Heart, 
    description: 'Your favorite barbers',
    page: 'SavedBarbers'
  },
  { 
    id: 'membership', 
    name: 'My Membership', 
    icon: Crown, 
    description: 'Manage your plan',
    page: 'MyMembership'
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);

  return (
    <>
      {/* Floating trigger */}
      <motion.div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40"
        initial={{ x: -60 }}
        animate={{ x: isOpen ? -60 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-stone-900 text-white pl-4 pr-3 py-4 rounded-r-2xl shadow-xl hover:bg-stone-800 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-400" />
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      </motion.div>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-stone-900">Style Tools</h2>
                  <p className="text-sm text-stone-500">Personalize your experience</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Tools list */}
              <div className="p-4 space-y-2">
                {sidebarTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={createPageUrl(tool.page)}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        onHoverStart={() => setHoveredTool(tool.id)}
                        onHoverEnd={() => setHoveredTool(null)}
                        className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer group ${
                          hoveredTool === tool.id 
                            ? 'bg-stone-900 text-white' 
                            : 'bg-stone-50 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl transition-colors ${
                            hoveredTool === tool.id 
                              ? 'bg-amber-500' 
                              : 'bg-white shadow-sm'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              hoveredTool === tool.id 
                                ? 'text-stone-900' 
                                : 'text-stone-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium mb-1 ${
                              hoveredTool === tool.id ? 'text-white' : 'text-stone-900'
                            }`}>
                              {tool.name}
                            </h3>
                            <p className={`text-sm ${
                              hoveredTool === tool.id ? 'text-stone-400' : 'text-stone-500'
                            }`}>
                              {tool.description}
                            </p>
                          </div>
                          <ChevronRight className={`w-5 h-5 mt-1 transition-transform ${
                            hoveredTool === tool.id 
                              ? 'text-amber-400 translate-x-1' 
                              : 'text-stone-400'
                          }`} />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="p-6 border-t border-stone-100 mt-auto">
                <Link to={createPageUrl('Profile')} onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-6">
                    <User className="w-5 h-5 mr-2" />
                    My Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}