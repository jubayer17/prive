import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Sparkles, Droplets, Sun, Wind, Scissors } from 'lucide-react';

const tips = {
  all: [
    { icon: Droplets, title: 'Stay Hydrated', tip: 'Drink plenty of water daily for healthy hair from the inside out. Hydration is key to maintaining hair moisture and shine.' },
    { icon: Scissors, title: 'Regular Trims', tip: 'Get a trim every 6-8 weeks to prevent split ends and maintain your style. This keeps your hair looking fresh and healthy.' },
    { icon: Sun, title: 'UV Protection', tip: 'Protect your hair from sun damage with leave-in treatments or wear a hat during prolonged sun exposure.' },
    { icon: Wind, title: 'Avoid Over-Washing', tip: "Wash your hair 2-3 times per week max. Over-washing strips natural oils and can damage your hair's health." }
  ],
  straight: [
    { icon: Sparkles, title: 'Volume Boost', tip: 'Use volumizing products at the roots and blow-dry upside down for extra lift and body.' },
    { icon: Droplets, title: 'Light Products', tip: 'Use lightweight styling products to avoid weighing down straight hair. Less is more!' },
    { icon: Wind, title: 'Cool Rinse', tip: 'Finish your shower with a cool water rinse to seal the cuticles and add shine.' }
  ],
  wavy: [
    { icon: Droplets, title: 'Scrunch & Air Dry', tip: 'Scrunch in a curl-enhancing cream and let it air dry for natural, beautiful waves.' },
    { icon: Sparkles, title: 'Sea Salt Spray', tip: 'Use sea salt spray for beachy texture and definition. Perfect for that effortless look.' },
    { icon: Wind, title: 'Diffuser Technique', tip: 'If blow-drying, use a diffuser on low heat to maintain wave pattern without frizz.' }
  ],
  curly: [
    { icon: Droplets, title: 'Deep Conditioning', tip: 'Deep condition weekly to maintain moisture. Curly hair needs extra hydration to stay healthy.' },
    { icon: Sparkles, title: 'Finger Coiling', tip: 'Define curls by coiling small sections around your finger when hair is wet and product is applied.' },
    { icon: Wind, title: 'No Towel Rubbing', tip: 'Use a microfiber towel or t-shirt to gently squeeze water out. Never rub curls dry!' }
  ],
  color: [
    { icon: Droplets, title: 'Color-Safe Products', tip: 'Always use color-safe shampoo and conditioner to maintain vibrancy and prevent fading.' },
    { icon: Sun, title: 'Minimize Heat', tip: 'Reduce heat styling as much as possible. Heat can cause color to fade faster.' },
    { icon: Sparkles, title: 'Gloss Treatments', tip: 'Use a color gloss treatment every few weeks to maintain shine and refresh your color.' }
  ]
};

export default function HairTips() {
  const [category, setCategory] = useState('all');

  const currentTips = [...(tips[category] || []), ...tips.all];

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-stone-900" />
          </div>
          <h1 className="text-3xl font-light text-stone-900 mb-4">Hair Care Tips</h1>
          <p className="text-stone-500 mb-8">
            Expert advice to keep your hair looking its best
          </p>

          <div className="flex justify-center">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-64 rounded-full">
                <SelectValue placeholder="Select hair type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hair Types</SelectItem>
                <SelectItem value="straight">Straight Hair</SelectItem>
                <SelectItem value="wavy">Wavy Hair</SelectItem>
                <SelectItem value="curly">Curly Hair</SelectItem>
                <SelectItem value="color">Color-Treated Hair</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {currentTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-stone-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-900 mb-2">{tip.title}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed">{tip.tip}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="border-0 shadow-lg bg-stone-900 text-white">
            <CardContent className="p-8">
              <h3 className="text-xl font-medium mb-3">Need Personalized Advice?</h3>
              <p className="text-stone-400 mb-6">
                Book a consultation with our experts for customized hair care recommendations
              </p>
              <Button className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full px-8">
                Book Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}