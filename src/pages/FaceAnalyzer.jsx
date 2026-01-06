import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Palette, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What's the length of your face?",
    options: [
      { id: 'long', label: 'Longer than it is wide', emoji: '📏' },
      { id: 'equal', label: 'About the same length and width', emoji: '⬜' },
      { id: 'short', label: 'Wider than it is long', emoji: '➖' }
    ]
  },
  {
    id: 2,
    question: "How would you describe your jawline?",
    options: [
      { id: 'angular', label: 'Sharp and Angular', emoji: '◆' },
      { id: 'rounded', label: 'Soft and Rounded', emoji: '○' },
      { id: 'square', label: 'Square and Strong', emoji: '◼' },
      { id: 'pointed', label: 'Pointed Chin', emoji: '▼' }
    ]
  },
  {
    id: 3,
    question: "What about your forehead?",
    options: [
      { id: 'wide', label: 'Wider than my cheeks', emoji: '🔼' },
      { id: 'equal', label: 'Same width as cheeks', emoji: '▫️' },
      { id: 'narrow', label: 'Narrower than my cheeks', emoji: '🔽' }
    ]
  }
];

const faceShapes = {
  'long-angular-wide': { shape: 'Oblong', styles: ['Side Part', 'Textured Crop', 'Side Swept Fringe'] },
  'long-rounded-wide': { shape: 'Oval', styles: ['Almost Any Style', 'Pompadour', 'Quiff'] },
  'equal-square-equal': { shape: 'Square', styles: ['Textured Top', 'Side Part', 'Messy Fringe'] },
  'equal-rounded-equal': { shape: 'Round', styles: ['High Volume Top', 'Angular Cuts', 'Height on Top'] },
  'short-angular-narrow': { shape: 'Triangle', styles: ['Volume on Top', 'Side Part', 'Textured Layers'] },
  'long-pointed-narrow': { shape: 'Heart', styles: ['Side Fringe', 'Layered Cuts', 'Side Part'] },
  'default': { shape: 'Balanced', styles: ['Classic Cuts', 'Modern Styles', 'Versatile Looks'] }
};

export default function FaceAnalyzer() {
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

  const getResult = () => {
    const key = `${answers[1]}-${answers[2]}-${answers[3]}`;
    return faceShapes[key] || faceShapes.default;
  };

  if (complete) {
    const result = getResult();
    
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-stone-900" />
            </div>
            <h1 className="text-3xl font-light text-stone-900 mb-4">Your Face Shape</h1>
            <p className="text-5xl font-light text-amber-600 mb-4">{result.shape}</p>
            <p className="text-stone-500">
              Based on your answers, here are the best styles for you
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <h2 className="text-lg font-medium text-stone-900 mb-6">Recommended Styles</h2>
              <div className="space-y-4">
                {result.styles.map((style, index) => (
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
                Book Your Consultation
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
          <h1 className="text-3xl font-light text-stone-900 mb-2">Face Shape Analyzer</h1>
          <p className="text-stone-500">Discover your face shape and ideal styles</p>
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