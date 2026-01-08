import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Sparkles, ChevronRight, X } from "lucide-react";
import { format, addDays } from "date-fns";

const quickSlots = [
  { label: "Today", date: new Date(), times: ["14:00", "15:30", "17:00"] },
  {
    label: "Tomorrow",
    date: addDays(new Date(), 1),
    times: ["09:30", "11:00", "14:00", "16:30"],
  },
  {
    label: format(addDays(new Date(), 2), "EEE"),
    date: addDays(new Date(), 2),
    times: ["10:00", "13:00", "15:00", "18:00"],
  },
];

const popularServices = [
  { id: "1", name: "Classic Haircut", duration: 30, price: 35 },
  { id: "2", name: "Beard Trim", duration: 20, price: 25 },
  { id: "5", name: "Executive Package", duration: 60, price: 75 },
];

export default function QuickBookWidget({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleBookNow = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService.id);
    if (selectedDate) params.set("date", format(selectedDate, "yyyy-MM-dd"));
    if (selectedTime) params.set("time", selectedTime);

    window.location.href = `${createPageUrl("Booking")}?${params.toString()}`;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-400 text-stone-900 p-4 rounded-full shadow-2xl flex items-center gap-2 ${className}`}
      >
        <Calendar className="w-6 h-6" />
        <span className="font-medium pr-2">Quick Book</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-stone-900">
                  Quick Booking
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Popular Services */}
              <div className="mb-6">
                <p className="text-sm text-stone-500 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Popular Services
                </p>
                <div className="space-y-2">
                  {popularServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedService?.id === service.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-stone-100 hover:border-stone-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-stone-900">
                            {service.name}
                          </p>
                          <p className="text-sm text-stone-500">
                            {service.duration} min
                          </p>
                        </div>
                        <span className="text-lg font-light text-stone-900">
                          ${service.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Time Slots */}
              <div className="mb-6">
                <p className="text-sm text-stone-500 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Available Slots
                </p>
                <div className="space-y-4">
                  {quickSlots.map((slot, index) => (
                    <div key={index}>
                      <p className="text-xs font-medium text-stone-700 mb-2">
                        {slot.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slot.times.map((time) => (
                          <button
                            key={`${index}-${time}`}
                            onClick={() => {
                              setSelectedDate(slot.date);
                              setSelectedTime(time);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              selectedDate === slot.date &&
                              selectedTime === time
                                ? "bg-stone-900 text-white"
                                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link to={createPageUrl("Booking")} className="flex-1">
                  <Button variant="outline" className="w-full rounded-full">
                    Full Booking
                  </Button>
                </Link>
                <Button
                  onClick={handleBookNow}
                  disabled={!selectedService && !selectedTime}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

QuickBookWidget.propTypes = {
  className: PropTypes.string,
};
