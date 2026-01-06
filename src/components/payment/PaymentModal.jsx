import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Loader2, CheckCircle2, AlertCircle, DollarSign, Percent } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PaymentModal({ 
  open, 
  onClose, 
  amount, 
  currency = 'USD',
  type, // 'booking', 'membership', 'giftcard'
  referenceId,
  onSuccess,
  allowPartial = false, // Only for bookings
  metadata = {}
}) {
  const [paymentMethod, setPaymentMethod] = useState('demo');
  const [isFullPayment, setIsFullPayment] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState('');

  const fullAmount = amount;
  const partialAmount = amount * 0.25;
  const discountAmount = isFullPayment ? amount * 0.05 : 0;
  const finalAmount = isFullPayment ? amount - discountAmount : partialAmount;

  const getCurrencySymbol = (curr) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£' };
    return symbols[curr] || '$';
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const user = await base44.auth.me();
      
      // Create payment record
      const paymentData = {
        user_email: user.email,
        type,
        reference_id: referenceId,
        amount: finalAmount,
        currency,
        payment_method: paymentMethod,
        payment_status: 'completed', // Demo mode auto-completes
        transaction_id: `TXN-${Date.now()}`,
        is_full_payment: allowPartial ? isFullPayment : true,
        discount_amount: discountAmount,
        metadata
      };

      await base44.entities.Payment.create(paymentData);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Send confirmation email
      try {
        let emailSubject = '';
        let emailBody = '';

        if (type === 'booking') {
          emailSubject = `Booking Confirmation - Hairy Salon`;
          emailBody = `
            <h2>Your Booking is Confirmed!</h2>
            <p>Thank you for booking with Hairy Salon.</p>
            <p><strong>Amount Paid:</strong> ${getCurrencySymbol(currency)}${finalAmount.toFixed(2)}</p>
            <p><strong>Payment Type:</strong> ${allowPartial && isFullPayment ? 'Full Payment (5% discount applied)' : allowPartial ? '25% Advance Payment' : 'Full Payment'}</p>
            ${metadata.service_name ? `<p><strong>Service:</strong> ${metadata.service_name}</p>` : ''}
            ${metadata.barber_name ? `<p><strong>Stylist:</strong> ${metadata.barber_name}</p>` : ''}
            ${metadata.date ? `<p><strong>Date:</strong> ${metadata.date}</p>` : ''}
            ${metadata.time ? `<p><strong>Time:</strong> ${metadata.time}</p>` : ''}
            <p>We look forward to seeing you!</p>
          `;
        } else if (type === 'membership') {
          emailSubject = `Membership Activated - Hairy Salon`;
          emailBody = `
            <h2>Welcome to Hairy Membership!</h2>
            <p>Your membership has been activated successfully.</p>
            <p><strong>Plan:</strong> ${metadata.plan || 'Premium'}</p>
            <p><strong>Monthly Amount:</strong> ${getCurrencySymbol(currency)}${finalAmount.toFixed(2)}</p>
            <p>Enjoy your exclusive member benefits!</p>
          `;
        } else if (type === 'giftcard') {
          emailSubject = `Gift Card Received - Hairy Salon`;
          emailBody = `
            <h2>You've Received a Hairy Gift Card!</h2>
            <p>Someone special has sent you a gift card.</p>
            <p><strong>Amount:</strong> ${getCurrencySymbol(currency)}${finalAmount.toFixed(2)}</p>
            ${metadata.recipient_name ? `<p><strong>For:</strong> ${metadata.recipient_name}</p>` : ''}
            <p>Use it for any of our premium services!</p>
          `;
        }

        if (user.email) {
          await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: emailSubject,
            body: emailBody
          });
        }

        // Send to recipient for gift cards
        if (type === 'giftcard' && metadata.recipient_email) {
          await base44.integrations.Core.SendEmail({
            to: metadata.recipient_email,
            subject: `You've Received a Gift Card from Hairy Salon!`,
            body: `
              <h2>You've Received a Gift Card!</h2>
              <p>Someone has sent you a Hairy Salon gift card worth ${getCurrencySymbol(currency)}${finalAmount.toFixed(2)}!</p>
              ${metadata.message ? `<p><em>"${metadata.message}"</em></p>` : ''}
              <p>Visit our salon to redeem your gift card and enjoy our premium services.</p>
            `
          });
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      setPaymentComplete(true);
      
      // Call success callback
      setTimeout(() => {
        onSuccess?.({ 
          paymentId: paymentData.transaction_id,
          amount: finalAmount,
          isFullPayment: allowPartial ? isFullPayment : true
        });
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">Complete Payment</DialogTitle>
        </DialogHeader>

        {!paymentComplete ? (
          <div className="space-y-6">
            {/* Payment Amount Options (for bookings only) */}
            {allowPartial && (
              <div className="space-y-3">
                <Label>Payment Option</Label>
                <RadioGroup value={isFullPayment ? 'full' : 'partial'} onValueChange={(v) => setIsFullPayment(v === 'full')}>
                  <Card className={`cursor-pointer transition-all ${isFullPayment ? 'ring-2 ring-stone-900' : 'hover:bg-stone-50'}`} onClick={() => setIsFullPayment(true)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="full" id="full" />
                        <div className="flex-1">
                          <Label htmlFor="full" className="cursor-pointer font-medium flex items-center gap-2">
                            Full Payment
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">5% OFF</span>
                          </Label>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-light">{getCurrencySymbol(currency)}{(fullAmount - discountAmount).toFixed(2)}</span>
                            <span className="text-stone-400 line-through text-sm">{getCurrencySymbol(currency)}{fullAmount.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-stone-500 mt-1">Save {getCurrencySymbol(currency)}{discountAmount.toFixed(2)} with full payment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-all ${!isFullPayment ? 'ring-2 ring-stone-900' : 'hover:bg-stone-50'}`} onClick={() => setIsFullPayment(false)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="partial" id="partial" />
                        <div className="flex-1">
                          <Label htmlFor="partial" className="cursor-pointer font-medium">25% Advance Payment</Label>
                          <div className="mt-2">
                            <span className="text-2xl font-light">{getCurrencySymbol(currency)}{partialAmount.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-stone-500 mt-1">Pay remaining {getCurrencySymbol(currency)}{(fullAmount - partialAmount).toFixed(2)} at salon</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-2">
                  <Card className={`cursor-pointer transition-all ${paymentMethod === 'demo' ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:bg-stone-50'}`} onClick={() => setPaymentMethod('demo')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="demo" id="demo" />
                        <div className="flex-1">
                          <Label htmlFor="demo" className="cursor-pointer font-medium flex items-center gap-2">
                            Demo Payment
                            <span className="px-2 py-0.5 bg-amber-600 text-white text-xs rounded-full">TEST MODE</span>
                          </Label>
                          <p className="text-sm text-stone-500 mt-1">For testing purposes only</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-all opacity-50`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="stripe" id="stripe" disabled />
                        <div className="flex-1">
                          <Label htmlFor="stripe" className="cursor-not-allowed font-medium">Credit/Debit Card (Stripe)</Label>
                          <p className="text-sm text-stone-500 mt-1">Coming soon</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-all opacity-50`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="sslcommerz" id="sslcommerz" disabled />
                        <div className="flex-1">
                          <Label htmlFor="sslcommerz" className="cursor-not-allowed font-medium">SSLCommerz</Label>
                          <p className="text-sm text-stone-500 mt-1">Coming soon</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            {/* Summary */}
            {!allowPartial && (
              <div className="bg-stone-50 rounded-2xl p-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-stone-600">Total Amount</span>
                  <span className="font-medium text-stone-900">{getCurrencySymbol(currency)}{amount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={processing} className="flex-1 rounded-full">
                Cancel
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={processing}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-full"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {getCurrencySymbol(currency)}{finalAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-stone-900 mb-2">Payment Successful!</h3>
            <p className="text-stone-500">Your payment has been processed successfully.</p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}