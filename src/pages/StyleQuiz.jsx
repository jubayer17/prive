import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What's your hair texture?",
    options: [
      { id: 'straight', label: 'Straight', emoji: '〰️' },
      { id: 'wavy', label: 'Wavy', emoji: '🌊' },
      { id: 'curly', label: 'Curly', emoji: '➰' },
      { id: 'coily', label: 'Coily', emoji: '🔄' }
    ]
  },
  {
    id: 2,
    question: "How much time do you spend on styling?",
    options: [
      { id: 'minimal', label: '5 minutes or less', emoji: '⚡' },
      { id: 'moderate', label: '10-15 minutes', emoji: '⏱️' },
      { id: 'detailed', label: '20+ minutes', emoji: '🎨' }
    ]
  },
  {
    id: 3,
    question: "What's your preferred style vibe?",
    options: [
      { id: 'classic', label: 'Classic & Timeless', emoji: '👔' },
      { id: 'modern', label: 'Modern & Trendy', emoji: '✨' },
      { id: 'edgy', label: 'Edgy & Bold', emoji: '🔥' },
      { id: 'natural', label: 'Natural & Relaxed', emoji: '🌿' }
    ]
  },
  {
    id: 4,
    question: "What's your hair concern?",
    options: [
      { id: 'volume', label: 'Need more volume', emoji: '📈' },
      { id: 'frizz', label: 'Frizz control', emoji: '🌀' },
      { id: 'thinning', label: 'Thinning hair', emoji: '💇' },
      { id: 'none', label: 'No major concerns', emoji: '✅' }
    ]
  },
  {
    id: 5,
    question: "How often do you get haircuts?",
    options: [
      { id: 'weekly', label: 'Every 2-3 weeks', emoji: '📅' },
      { id: 'monthly', label: 'Monthly', emoji: '🗓️' },
      { id: 'quarterly', label: 'Every 2-3 months', emoji: '📆' },
      { id: 'rarely', label: 'When I remember', emoji: '😅' }
    ]
  }
];

const recommendations = {
  straight: {
    classic: ['Classic Taper', 'Side Part', 'Slick Back'],
    modern: ['Textured Crop', 'French Crop', 'Curtain Bangs'],
    edgy: ['Undercut', 'Hard Part', 'Buzz Cut'],
    natural: ['Grown Out Layers', 'Messy Fringe', 'Natural Flow']
  },
  wavy: {
    classic: ['Medium Waves', 'Pompadour', 'Side Swept'],
    modern: ['Textured Waves', 'Modern Quiff', 'Beach Waves'],
    edgy: ['Disconnected Undercut', 'Mohawk Fade', 'Asymmetric Cut'],
    natural: ['Surfer Style', 'Loose Waves', 'Air-Dried Look']
  },
  curly: {
    classic: ['Classic Curls', 'Defined Curls', 'Short Curly Top'],
    modern: ['Curly Fringe', 'Tapered Curls', 'Curly Fade'],
    edgy: ['Curly Mohawk', 'High Top', 'Bold Volume'],
    natural: ['Free Curls', 'Natural Afro', 'Curl Enhancement']
  },
  coily: {
    classic: ['Shape Up', 'Classic Fade', 'Defined Coils'],
    modern: ['High Top Fade', 'Temple Fade', 'Twist Out'],
    edgy: ['Design Lines', 'Bold Patterns', 'High Volume'],
    natural: ['Natural Coils', 'Free Form', 'Coil Out']
  }
};

export default function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (optionId) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
    
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setComplete(true);
    }
  };

  const getRecommendations = () => {
    const texture = answers[1] || 'straight';
    const vibe = answers[3] || 'modern';
    return recommendations[texture]?.[vibe] || recommendations.straight.modern;
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
              <Sparkles className="w-10 h-10 text-stone-900" />
            </div>
            <h1 className="text-3xl font-light text-stone-900 mb-4">Your Style Profile</h1>
            <p className="text-stone-500">
              Based on your answers, here are our recommendations
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <h2 className="text-lg font-medium text-stone-900 mb-6">Recommended Styles</h2>
              <div className="space-y-4">
                {recs.map((style, index) => (
                  <motion.div
                    key={style}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-stone-900">{style}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to={createPageUrl('Booking')}>
              <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 py-6 text-base">
                Book Your Style Consultation
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
          <h1 className="text-3xl font-light text-stone-900 mb-2">Style Quiz</h1>
          <p className="text-stone-500">Find your perfect hairstyle</p>
        </div>

        <Progress value={progress} className="h-2 mb-8" />

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
                  <span className="text-sm text-stone-400 mb-2 block">
                    Question {step + 1} of {questions.length}
                  </span>
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