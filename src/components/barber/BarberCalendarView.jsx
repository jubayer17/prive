import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00'
];

export default function BarberCalendarView({ barber }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  const { data: bookings = [] } = useQuery({
    queryKey: ['barber-bookings', barber.id, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => base44.entities.Booking.filter({
      barber_id: barber.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: 'confirmed'
    }),
    enabled: !!barber.id && !!selectedDate
  });

  const bookedTimes = bookings.map(b => b.time);
  const availableTimes = timeSlots.filter(t => !bookedTimes.includes(t));

  const handleBookSlot = () => {
    if (selectedDate && selectedTime) {
      const params = new URLSearchParams({
        barber: barber.id,
        gender: barber.serves_gender === 'both' ? 'male' : barber.serves_gender,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      });
      navigate(`${createPageUrl('Booking')}?${params.toString()}`);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Calendar Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(date) => date < startOfDay(new Date()) || date > addDays(new Date(), 30)}
            className="rounded-xl"
          />
        </CardContent>
      </Card>

      {/* Time Slots Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Available Times - {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Available ({availableTimes.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-stone-300" />
                <span>Booked ({bookedTimes.length})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {timeSlots.map(time => {
              const isBooked = bookedTimes.includes(time);
              const isSelected = selectedTime === time;
              const isAvailable = !isBooked;

              return (
                <motion.button
                  key={time}
                  whileHover={isAvailable ? { scale: 1.05 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  disabled={isBooked}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all relative ${
                    isSelected
                      ? 'bg-amber-500 text-stone-900 ring-2 ring-amber-600'
                      : isBooked
                      ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 absolute top-1 right-1" />
                  )}
                  <Clock className="w-3 h-3 inline mr-1" />
                  {time}
                </motion.button>
              );
            })}
          </div>

          {selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200"
            >
              <p className="text-sm text-amber-800 mb-3">
                <strong>{barber.name}</strong> is available on{' '}
                <strong>{format(selectedDate, 'EEEE, MMMM d')}</strong> at{' '}
                <strong>{selectedTime}</strong>
              </p>
              <Button
                onClick={handleBookSlot}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl"
              >
                Book This Slot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}