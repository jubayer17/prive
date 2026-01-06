import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CurrencySelector, { getCurrencySymbol } from '@/components/ui/CurrencySelector';
import PaymentModal from '@/components/payment/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, ArrowRight, Check, Loader2, Sparkles, Download } from 'lucide-react';

const presetAmounts = [50, 100, 150, 200, 250, 500];

export default function GiftCards() {
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    message: ''
  });
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingGiftCard, setPendingGiftCard] = useState(null);
  const [completedGiftCard, setCompletedGiftCard] = useState(null);

  const generateCode = () => {
    return 'HAIRY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createGiftCardMutation = useMutation({
    mutationFn: async () => {
      const code = generateCode();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const giftCard = await base44.entities.GiftCard.create({
        code,
        amount: amount,
        currency,
        balance: amount,
        purchaser_email: formData.senderName,
        recipient_name: formData.recipientName,
        recipient_email: formData.recipientEmail,
        message: formData.message,
        expiry_date: expiryDate.toISOString().split('T')[0],
        status: 'pending'
      });

      return giftCard;
    },
    onSuccess: (giftCard) => {
      setPendingGiftCard(giftCard);
      setShowPaymentModal(true);
    }
  });

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    if (value) {
      setAmount(parseFloat(value) || 0);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!pendingGiftCard) return;

    await base44.entities.GiftCard.update(pendingGiftCard.id, {
      status: 'active'
    });

    // Send gift card email to recipient
    try {
      await base44.integrations.Core.SendEmail({
        to: formData.recipientEmail,
        subject: `🎁 You've Received a Hairy Salon Gift Card!`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1c1917; font-size: 28px;">You've Received a Gift Card!</h1>
            <p style="font-size: 16px; color: #44403c;">
              Someone special has sent you a <strong>Hairy Salon</strong> gift card worth <strong>${getCurrencySymbol(currency)}${amount}</strong>!
            </p>
            
            ${formData.message ? `
              <div style="background: #f5f5f4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="font-style: italic; color: #57534e; margin: 0;">"${formData.message}"</p>
              </div>
            ` : ''}
            
            <div style="background: linear-gradient(135deg, #1c1917, #44403c); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">
              <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #fbbf24;">GIFT CARD CODE</h2>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 2px; margin: 10px 0; font-family: monospace;">${pendingGiftCard.code}</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #d6d3d1;">Value: ${getCurrencySymbol(currency)}${amount}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #a8a29e;">Valid until: ${pendingGiftCard.expiry_date}</p>
            </div>
            
            <p style="font-size: 14px; color: #57534e;">
              Visit any Hairy Salon location and present this code to redeem your gift card for premium grooming services.
            </p>
            
            <p style="font-size: 14px; color: #78716c; margin-top: 30px;">
              Questions? Contact us at info@hairysalon.com
            </p>
          </div>
        `
      });
    } catch (error) {
      console.error('Failed to send gift card email:', error);
    }

    setCompletedGiftCard(pendingGiftCard);
    setPurchaseComplete(true);
    setFormData({
      recipientName: '',
      recipientEmail: '',
      senderName: '',
      message: ''
    });
    setAmount(100);
    setStep(1);
    setPendingGiftCard(null);
  };

  const downloadGiftCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');

    // Premium gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 750);
    gradient.addColorStop(0, '#0f0f0f');
    gradient.addColorStop(0.5, '#1c1917');
    gradient.addColorStop(1, '#292524');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 750);

    // Gold accent border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 690);
    
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 1;
    ctx.strokeRect(35, 35, 1130, 680);

    // Decorative corners
    const drawCornerDecoration = (x, y, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 40);
      ctx.stroke();
      ctx.restore();
    };
    
    drawCornerDecoration(50, 50, 0);
    drawCornerDecoration(1150, 50, Math.PI / 2);
    drawCornerDecoration(1150, 700, Math.PI);
    drawCornerDecoration(50, 700, -Math.PI / 2);

    // Luxury shimmer effect
    const shimmer = ctx.createLinearGradient(0, 0, 1200, 0);
    shimmer.addColorStop(0, 'rgba(251, 191, 36, 0)');
    shimmer.addColorStop(0.3, 'rgba(251, 191, 36, 0.05)');
    shimmer.addColorStop(0.7, 'rgba(251, 191, 36, 0.05)');
    shimmer.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, 1200, 750);

    // Brand name with shadow
    ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Georgia, serif';
    ctx.fillText('HAIRY', 80, 140);
    
    ctx.shadowBlur = 0;
    ctx.font = '28px Arial';
    ctx.fillStyle = '#a8a29e';
    ctx.fillText('LUXURY GROOMING', 80, 180);

    // Decorative line
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(350, 210);
    ctx.stroke();

    // Gift Card label
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('Premium Gift Card', 80, 260);

    // Amount - large and prominent
    ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 120px Arial';
    ctx.fillText(`${getCurrencySymbol(currency)}${completedGiftCard?.amount || 0}`, 80, 400);

    // Code section with box
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
    ctx.fillRect(80, 440, 500, 80);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 440, 500, 80);

    ctx.fillStyle = '#d6d3d1';
    ctx.font = '18px Arial';
    ctx.fillText('GIFT CARD CODE', 100, 470);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(completedGiftCard?.code || '', 100, 505);

    // Recipient info
    ctx.fillStyle = '#d6d3d1';
    ctx.font = '20px Arial';
    ctx.fillText('FOR:', 80, 580);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText(completedGiftCard?.recipient_name || 'Someone Special', 80, 620);

    // Valid until
    ctx.fillStyle = '#a8a29e';
    ctx.font = '18px Arial';
    ctx.fillText(`Valid until: ${completedGiftCard?.expiry_date || ''}`, 80, 670);

    // Right side decorative element
    ctx.fillStyle = 'rgba(251, 191, 36, 0.05)';
    ctx.beginPath();
    ctx.arc(1000, 375, 250, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(1000, 375, 200, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(1000, 375, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Gift icon (simplified)
    ctx.fillStyle = '#fbbf24';
    ctx.font = '100px Arial';
    ctx.fillText('🎁', 950, 410);

    // Footer text
    ctx.fillStyle = '#78716c';
    ctx.font = '16px Arial';
    ctx.fillText('Redeem at any Hairy Salon location', 80, 715);

    // Download
    const link = document.createElement('a');
    link.download = `hairy-giftcard-${completedGiftCard?.code}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  if (purchaseComplete) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-lg shadow-xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-medium text-stone-900 mb-3">Gift Card Purchased!</h2>
          <p className="text-stone-500 mb-6">
            Your gift card has been sent to the recipient
          </p>
          
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-8 h-8 text-amber-400" />
              <span className="text-sm text-stone-400">Gift Card</span>
            </div>
            <div className="text-left mb-4">
              <p className="text-stone-400 text-xs">Code</p>
              <p className="text-xl font-mono tracking-wider">{completedGiftCard?.code}</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-stone-400 text-xs">Value</p>
                <p className="text-2xl font-light">{getCurrencySymbol(currency)}{completedGiftCard?.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-stone-400 text-xs">For</p>
                <p className="font-light">{completedGiftCard?.recipient_name}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={downloadGiftCard}
              variant="outline"
              className="flex-1 rounded-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Card
            </Button>
            <Button 
              onClick={() => {
                setPurchaseComplete(false);
                setCompletedGiftCard(null);
              }}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-full"
            >
              Purchase Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Gift Cards</h1>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Give the gift of luxury grooming to someone special
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Currency */}
        <div className="flex justify-end mb-8">
          <CurrencySelector value={currency} onChange={setCurrency} className="w-28" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-2xl font-medium text-stone-900 mb-6">Choose Amount</h2>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {presetAmounts.map(value => (
                      <button
                        key={value}
                        onClick={() => handleAmountSelect(value)}
                        className={`py-4 rounded-xl font-medium transition-all ${
                          amount === value && !customAmount
                            ? 'bg-stone-900 text-white'
                            : 'bg-white hover:bg-stone-100 text-stone-900'
                        }`}
                      >
                        {getCurrencySymbol(currency)}{value}
                      </button>
                    ))}
                  </div>

                  <div className="mb-8">
                    <Label className="text-stone-600">Custom Amount</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                        {getCurrencySymbol(currency)}
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className="pl-8 h-12 rounded-xl"
                        min="10"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!amount || amount < 10}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-6"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-2xl font-medium text-stone-900 mb-6">Recipient Details</h2>

                  <div className="space-y-4 mb-8">
                    <div>
                      <Label className="text-stone-600">Recipient's Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-600">Recipient's Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-600">Your Name</Label>
                      <Input
                        placeholder="Your name"
                        value={formData.senderName}
                        onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-600">Personal Message (Optional)</Label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="mt-2 rounded-xl"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-xl"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => createGiftCardMutation.mutate()}
                      disabled={!formData.recipientName || !formData.recipientEmail || createGiftCardMutation.isPending}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl"
                    >
                      {createGiftCardMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-32 h-fit">
            <h3 className="text-lg font-medium text-stone-900 mb-4">Preview</h3>
            
            <motion.div
              animate={{ rotateY: step === 2 ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative"
              style={{ perspective: 1000 }}
            >
              <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-8 shadow-2xl aspect-[1.6/1] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4 w-16 h-16">
                  <div className="w-full h-full border-2 border-amber-400/30 rounded-full" />
                  <div className="absolute inset-2 border border-amber-400/20 rounded-full" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-stone-900" />
                      </div>
                      <span className="text-white/80 text-sm font-light tracking-widest uppercase">Gift Card</span>
                    </div>
                    <h3 className="text-3xl font-light text-white">Hairy</h3>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-stone-400 text-xs mb-1">Value</p>
                      <p className="text-3xl font-light text-white">
                        {getCurrencySymbol(currency)}{amount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-400 text-xs mb-1">For</p>
                      <p className="text-white font-light">
                        {formData.recipientName || 'Someone Special'}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400/50 rounded-full"
                />
              </div>

              <div className="absolute -bottom-4 -right-4 w-full h-full bg-stone-200 rounded-3xl -z-10" />
            </motion.div>

            {formData.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-white rounded-xl border border-stone-200"
              >
                <p className="text-stone-400 text-xs mb-1">Your message</p>
                <p className="text-stone-600 text-sm italic">"{formData.message}"</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingGiftCard(null);
        }}
        amount={amount}
        currency={currency}
        type="giftcard"
        referenceId={pendingGiftCard?.id}
        allowPartial={false}
        onSuccess={handlePaymentSuccess}
        metadata={{
          recipient_name: formData.recipientName,
          recipient_email: formData.recipientEmail
        }}
      />
    </div>
  );
}