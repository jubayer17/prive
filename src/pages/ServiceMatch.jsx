import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Search, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What's your main goal today?",
    options: [
      { id: 'haircut', label: 'Get a fresh haircut', emoji: '✂️' },
      { id: 'color', label: 'Change my hair color', emoji: '🎨' },
      { id: 'maintenance', label: 'Maintain current style', emoji: '💈' },
      { id: 'special', label: 'Special occasion styling', emoji: '✨' }
    ]
  },
  {
    id: 2,
    question: "How much time do you have?",
    options: [
      { id: 'quick', label: 'Under 1 hour', emoji: '⚡' },
      { id: 'moderate', label: '1-2 hours', emoji: '⏱️' },
      { id: 'extended', label: '2+ hours', emoji: '🕐' }
    ]
  },
  {
    id: 3,
    question: "What's your budget range?",
    options: [
      { id: 'basic', label: 'Under $50', emoji: '💵' },
      { id: 'standard', label: '$50-$100', emoji: '💳' },
      { id: 'premium', label: '$100-$200', emoji: '💎' },
      { id: 'luxury', label: '$200+', emoji: '👑' }
    ]
  }
];

const serviceRecommendations = {
  'haircut-quick-basic': ['Classic Haircut', 'Beard Trim', 'Quick Cut & Style'],
  'haircut-quick-standard': ['Signature Fade', 'Textured Crop', 'Classic Cut with Styling'],
  'haircut-moderate-standard': ['Signature Fade', 'Beard Sculpting', 'Full Grooming Package'],
  'haircut-moderate-premium': ['Premium Cut & Style', 'Hot Towel Shave', 'Deluxe Grooming'],
  'color-extended-premium': ['Color Treatment', 'Highlights', 'Balayage Consultation'],
  'color-extended-luxury': ['Balayage', 'Full Color Transformation', 'Color Correction'],
  'maintenance-quick-basic': ['Beard Trim', 'Line Up', 'Touch-Up Cut'],
  'maintenance-moderate-standard': ['Beard Sculpting', 'Style Refresh', 'Treatment'],
  'special-moderate-premium': ['Special Occasion Styling', 'Premium Cut & Style', 'Hair Spa'],
  'special-extended-luxury': ['Bridal Styling', 'Complete Makeover', 'VIP Package'],
  'default': ['Classic Haircut', 'Signature Style', 'Consultation']
};

export default function ServiceMatch() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);

  const currentQuestion = questions[step];

  const handleAnswer = (optionId) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
    
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setComplete(true);
    }
  };

  const getRecommendations = () => {
    const key = `${answers[1]}-${answers[2]}-${answers[3]}`;
    return serviceRecommendations[key] || serviceRecommendations.default;
  };

  if (complete) {
    const recs = getRecommendations();
    
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-stone-900" />
            </div>
            <h1 className="text-3xl font-light text-stone-900 mb-4">Perfect Match Found!</h1>
            <p className="text-stone-500">
              Based on your needs, here are our recommendations
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <h2 className="text-lg font-medium text-stone-900 mb-6">Recommended Services</h2>
              <div className="space-y-4">
                {recs.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-stone-900">{service}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link to={createPageUrl('Services')} className="flex-1">
              <Button variant="outline" className="w-full rounded-full py-6">
                Browse All Services
              </Button>
            </Link>
            <Link to={createPageUrl('Booking')} className="flex-1">
              <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">Service Match</h1>
          <p className="text-stone-500">Find the perfect service for you</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-stone-500 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-stone-900"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-stone-900">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.id)}
                      className={`p-5 rounded-xl text-left transition-all ${
                        answers[currentQuestion.id] === option.id
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-stone-400 text-sm flex items-center">
            {Object.keys(answers).length} / {questions.length} answered
          </span>
        </div>
      </div>
    </div>
  );
}