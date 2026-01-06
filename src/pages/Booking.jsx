import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GenderToggle from '@/components/ui/GenderToggle';
import CurrencySelector, { getCurrencySymbol } from '@/components/ui/CurrencySelector';
import PaymentModal from '@/components/payment/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Clock, 
  Star,
  CalendarIcon,
  User,
  Mail,
  Phone,
  CreditCard,
  Loader2,
  Sparkles
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

const steps = [
  { id: 1, name: 'Gender', icon: User },
  { id: 2, name: 'Service', icon: Sparkles },
  { id: 3, name: 'Stylist', icon: Star },
  { id: 4, name: 'Date & Time', icon: CalendarIcon },
  { id: 5, name: 'Details', icon: Mail },
  { id: 6, name: 'Confirm', icon: CreditCard }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00'
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const [booking, setBooking] = useState({
    gender: 'male',
    service_ids: [], // Changed to array for multiple services
    barber_id: '',
    date: null,
    time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState(null);

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    const barberId = params.get('barber');
    const gender = params.get('gender');
    const dateParam = params.get('date');
    const timeParam = params.get('time');

    if (serviceId) setBooking(b => ({ ...b, service_ids: [serviceId] }));
    if (barberId) setBooking(b => ({ ...b, barber_id: barberId }));
    if (gender) setBooking(b => ({ ...b, gender }));
    if (dateParam) setBooking(b => ({ ...b, date: new Date(dateParam) }));
    if (timeParam) setBooking(b => ({ ...b, time: timeParam }));
    
    if (dateParam && timeParam && barberId) setStep(2); // Skip to service selection
    else if (barberId) setStep(4);
    else if (serviceId) setStep(3);
  }, []);

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ is_active: true })
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ['barbers'],
    queryFn: () => base44.entities.Barber.filter({ is_active: true })
  });

  const { data: existingBookings = [] } = useQuery({
    queryKey: ['bookings', booking.barber_id, booking.date],
    queryFn: () => booking.barber_id && booking.date 
      ? base44.entities.Booking.filter({ 
          barber_id: booking.barber_id, 
          date: format(booking.date, 'yyyy-MM-dd'),
          status: 'confirmed'
        })
      : [],
    enabled: !!booking.barber_id && !!booking.date
  });

  const createBookingMutation = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: (newBooking) => {
      setPendingBookingId(newBooking.id);
      setShowPaymentModal(true);
    }
  });

  const filteredServices = services.filter(s => 
    s.gender === booking.gender || s.gender === 'unisex'
  );

  const filteredBarbers = barbers.filter(b => {
    if (booking.gender === 'male') {
      return b.serves_gender === 'male' || b.serves_gender === 'both';
    } else if (booking.gender === 'female') {
      return b.serves_gender === 'female' || b.serves_gender === 'both';
    }
    return true;
  });

  const selectedServices = services.filter(s => booking.service_ids.includes(s.id));
  const selectedBarber = barbers.find(b => b.id === booking.barber_id);
  
  // Calculate total duration and price with multi-service discount
  const getTotalDuration = () => {
    return selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0);
  };

  const getTotalPrice = () => {
    const basePrice = selectedServices.reduce((sum, s) => sum + getPrice(s), 0);
    // 5% discount for 2+ services
    const discount = selectedServices.length >= 2 ? basePrice * 0.05 : 0;
    return basePrice - discount;
  };

  const getMultiServiceDiscount = () => {
    if (selectedServices.length < 2) return 0;
    const basePrice = selectedServices.reduce((sum, s) => sum + getPrice(s), 0);
    return basePrice * 0.05;
  };

  const bookedTimes = existingBookings.map(b => b.time);
  const availableTimes = timeSlots.filter(t => !bookedTimes.includes(t));

  const getPrice = (service) => {
    if (!service) return 0;
    switch (currency) {
      case 'EUR': return service.price_eur || service.price_usd * 0.92;
      case 'GBP': return service.price_gbp || service.price_usd * 0.79;
      default: return service.price_usd;
    }
  };

  const handleSubmit = () => {
    createBookingMutation.mutate({
      ...booking,
      date: format(booking.date, 'yyyy-MM-dd'),
      service_name: selectedServices.map(s => s.name).join(', '),
      barber_name: selectedBarber?.name,
      duration: getTotalDuration(),
      price: getTotalPrice(),
      currency,
      status: 'pending'
    });
  };

  const handlePaymentSuccess = async ({ isFullPayment }) => {
    // Update booking status
    await base44.entities.Booking.update(pendingBookingId, {
      status: 'confirmed',
      notes: `${booking.notes || ''} ${isFullPayment ? '(Full payment)' : '(25% advance paid)'}`
    });
    setBookingComplete(true);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return booking.gender;
      case 2: return booking.service_ids.length > 0;
      case 3: return booking.barber_id;
      case 4: return booking.date && booking.time;
      case 5: return booking.customer_name && booking.customer_email && booking.customer_phone;
      default: return true;
    }
  };

  if (bookingComplete) {
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
          <h2 className="text-2xl font-medium text-stone-900 mb-3">Booking Confirmed!</h2>
          <p className="text-stone-500 mb-8">
            Your appointment has been scheduled. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-stone-50 rounded-2xl p-6 text-left mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-stone-400">Services</p>
                <p className="font-medium text-stone-900">{selectedServices.map(s => s.name).join(', ')}</p>
              </div>
              <div>
                <p className="text-stone-400">Stylist</p>
                <p className="font-medium text-stone-900">{selectedBarber?.name}</p>
              </div>
              <div>
                <p className="text-stone-400">Date</p>
                <p className="font-medium text-stone-900">{booking.date && format(booking.date, 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-stone-400">Time</p>
                <p className="font-medium text-stone-900">{booking.time}</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <PaymentModal
        open={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingBookingId(null);
        }}
        amount={getTotalPrice()}
        currency={currency}
        type="booking"
        referenceId={pendingBookingId}
        allowPartial={true}
        onSuccess={handlePaymentSuccess}
        metadata={{
          service_name: selectedServices.map(s => s.name).join(', '),
          barber_name: selectedBarber?.name,
          date: booking.date && format(booking.date, 'yyyy-MM-dd'),
          time: booking.time
        }}
      />

      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">Book Your Appointment</h1>
          <p className="text-stone-500">Complete the steps below to schedule your visit</p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isComplete = step > s.id;

              return (
                <React.Fragment key={s.id}>
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isComplete ? 'bg-green-500 text-white' :
                      isActive ? 'bg-amber-500 text-stone-900' :
                      'bg-stone-200 text-stone-500'
                    }`}>
                      {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-2 hidden md:block ${isActive ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                      {s.name}
                    </span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-green-500' : 'bg-stone-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-end mb-6">
          <CurrencySelector value={currency} onChange={setCurrency} className="w-28" />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Gender */}
            {step === 1 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-medium">Select Your Category</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <GenderToggle value={booking.gender} onChange={(v) => setBooking({...booking, gender: v})} />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Service */}
            {step === 2 && (
              <div>
                {selectedServices.length >= 2 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">Multi-Service Discount: 5% OFF</span>
                    </div>
                    <p className="text-amber-600 text-sm mt-1">
                      Save {getCurrencySymbol(currency)}{getMultiServiceDiscount().toFixed(2)} on your booking!
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {filteredServices.map(service => {
                    const isSelected = booking.service_ids.includes(service.id);
                    return (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setBooking(prev => ({
                            ...prev,
                            service_ids: isSelected
                              ? prev.service_ids.filter(id => id !== service.id)
                              : [...prev.service_ids, service.id]
                          }));
                        }}
                        className={`p-6 rounded-2xl cursor-pointer transition-all relative ${
                          isSelected 
                            ? 'bg-stone-900 text-white ring-2 ring-amber-500'
                            : 'bg-white hover:shadow-lg'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-stone-900" />
                          </div>
                        )}
                        <h3 className="font-medium text-lg mb-2">{service.name}</h3>
                        <p className={`text-sm mb-4 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-light">
                            {getCurrencySymbol(currency)}{getPrice(service).toFixed(0)}
                          </span>
                          <span className={`flex items-center text-sm ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-6 bg-stone-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-stone-600">Selected Services ({selectedServices.length})</span>
                      <span className="font-medium text-stone-900">{getCurrencySymbol(currency)}{getTotalPrice().toFixed(2)}</span>
                    </div>
                    {getMultiServiceDiscount() > 0 && (
                      <div className="text-sm text-green-600">
                        You're saving {getCurrencySymbol(currency)}{getMultiServiceDiscount().toFixed(2)}!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Barber */}
            {step === 3 && (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredBarbers.map(barber => (
                  <motion.div
                    key={barber.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setBooking({...booking, barber_id: barber.id})}
                    className={`p-6 rounded-2xl cursor-pointer text-center transition-all ${
                      booking.barber_id === barber.id 
                        ? 'bg-stone-900 text-white ring-2 ring-amber-500'
                        : 'bg-white hover:shadow-lg'
                    }`}
                  >
                    <img
                      src={barber.photo_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200`}
                      alt={barber.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="font-medium mb-1">{barber.name}</h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className={`w-4 h-4 ${booking.barber_id === barber.id ? 'fill-amber-400 text-amber-400' : 'fill-amber-400 text-amber-400'}`} />
                      <span className="text-sm">{barber.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                    <p className={`text-sm ${booking.barber_id === barber.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {barber.experience_years || 5}+ years exp.
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Step 4: Date & Time */}
            {step === 4 && (
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={booking.date}
                      onSelect={(d) => setBooking({...booking, date: d, time: ''})}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                      className="rounded-xl"
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Select Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {booking.date ? (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => {
                          const isBooked = bookedTimes.includes(time);
                          const isSelected = booking.time === time;
                          return (
                            <button
                              key={time}
                              disabled={isBooked}
                              onClick={() => setBooking({...booking, time})}
                              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-amber-500 text-stone-900'
                                  : isBooked
                                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-stone-400 py-12">
                        Please select a date first
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 5: Contact Details */}
            {step === 5 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-stone-600">Full Name</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={booking.customer_name}
                          onChange={(e) => setBooking({...booking, customer_name: e.target.value})}
                          className="pl-12 h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-stone-600">Email</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={booking.customer_email}
                          onChange={(e) => setBooking({...booking, customer_email: e.target.value})}
                          className="pl-12 h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-stone-600">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={booking.customer_phone}
                        onChange={(e) => setBooking({...booking, customer_phone: e.target.value})}
                        className="pl-12 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-stone-600">Special Requests (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests or preferences..."
                      value={booking.notes}
                      onChange={(e) => setBooking({...booking, notes: e.target.value})}
                      className="mt-2 rounded-xl"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Confirm Your Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-stone-50 rounded-2xl p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-stone-400 text-sm mb-1">Services</p>
                        <p className="font-medium text-stone-900">{selectedServices.map(s => s.name).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-sm mb-1">Stylist</p>
                        <p className="font-medium text-stone-900">{selectedBarber?.name}</p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-sm mb-1">Date</p>
                        <p className="font-medium text-stone-900">
                          {booking.date && format(booking.date, 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-sm mb-1">Time</p>
                        <p className="font-medium text-stone-900">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-sm mb-1">Duration</p>
                        <p className="font-medium text-stone-900">{getTotalDuration()} minutes</p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-sm mb-1">Total</p>
                        <p className="font-medium text-2xl text-stone-900">
                          {getCurrencySymbol(currency)}{getTotalPrice().toFixed(2)}
                        </p>
                        {getMultiServiceDiscount() > 0 && (
                          <p className="text-sm text-green-600">5% multi-service discount applied</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-6">
                    <h4 className="font-medium text-stone-900 mb-4">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-stone-400">Name:</span> {booking.customer_name}</p>
                      <p><span className="text-stone-400">Email:</span> {booking.customer_email}</p>
                      <p><span className="text-stone-400">Phone:</span> {booking.customer_phone}</p>
                      {booking.notes && (
                        <p><span className="text-stone-400">Notes:</span> {booking.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="rounded-full px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 6 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-6"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createBookingMutation.isPending}
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full px-8"
            >
              {createBookingMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Confirm Booking
                  <Check className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
        </div>
      </div>
    </>
  );
}