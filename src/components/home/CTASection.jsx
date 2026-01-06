import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { ArrowRight, Calendar, Loader2 } from 'lucide-react';

export default function CTASection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    service: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate(createPageUrl('Booking') + `?prefill=true&service=${formData.service}`);
    }, 500);
  };

  return (
    <section className="py-32 px-6 bg-stone-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-stone-700/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Ready for Your
            <br />
            <span className="font-medium bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Transformation?
            </span>
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Take the first step towards your new look. Our experts are waiting to craft your perfect style.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-stone-400 text-sm mb-2 block">Your Name</label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white/10 border-white/10 text-white placeholder:text-stone-500 h-12 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-stone-400 text-sm mb-2 block">Phone or Email</label>
              <Input
                placeholder="your@email.com"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="bg-white/10 border-white/10 text-white placeholder:text-stone-500 h-12 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-stone-400 text-sm mb-2 block">Preferred Service</label>
              <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
                <SelectTrigger className="bg-white/10 border-white/10 text-white h-12 rounded-xl">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haircut">Haircut</SelectItem>
                  <SelectItem value="styling">Styling</SelectItem>
                  <SelectItem value="beard">Beard Grooming</SelectItem>
                  <SelectItem value="color">Hair Color</SelectItem>
                  <SelectItem value="spa">Hair Spa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-6 text-base font-medium rounded-full group w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}