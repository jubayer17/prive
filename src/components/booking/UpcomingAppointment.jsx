import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, MapPin, Bell, X } from "lucide-react";
import { format, differenceInHours, differenceInDays } from "date-fns";

export default function UpcomingAppointment({
  appointment = {
    id: "1",
    service: "Classic Haircut",
    barber: "James Wilson",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    time: "14:30",
    location: "123 Style Street",
  },
  onDismiss,
  className = "",
}) {
  if (!appointment) return null;

  const hoursUntil = differenceInHours(appointment.date, new Date());
  const daysUntil = differenceInDays(appointment.date, new Date());

  const getUrgencyColor = () => {
    if (hoursUntil <= 24) return "bg-amber-500";
    if (daysUntil <= 3) return "bg-stone-800";
    return "bg-stone-600";
  };

  const getTimeText = () => {
    if (hoursUntil <= 0) return "Now";
    if (hoursUntil < 24) return `In ${hoursUntil} hours`;
    if (daysUntil === 1) return "Tomorrow";
    return `In ${daysUntil} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-2xl ${className}`}
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      )}

      <div className="p-6">
        {/* Header with urgency badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`px-3 py-1 ${getUrgencyColor()} rounded-full flex items-center gap-2`}
          >
            <Bell className="w-3 h-3" />
            <span className="text-xs font-medium">{getTimeText()}</span>
          </div>
          <span className="text-white/60 text-sm">Upcoming Appointment</span>
        </div>

        {/* Service and barber */}
        <h3 className="text-xl font-medium mb-1">{appointment.service}</h3>
        <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
          <User className="w-4 h-4" />
          <span>with {appointment.barber}</span>
        </div>

        {/* Date, time, location */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{format(appointment.date, "MMM d")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="truncate">Main St</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to={createPageUrl("BookingHistory")} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 rounded-full"
            >
              View Details
            </Button>
          </Link>
          <Button className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full">
            Add to Calendar
          </Button>
        </div>

        {/* Add to calendar reminder */}
        <p className="text-center text-white/50 text-xs mt-4">
          📱 We&apos;ll send you a reminder 1 hour before
        </p>
      </div>
    </motion.div>
  );
}

UpcomingAppointment.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string,
    service: PropTypes.string,
    barber: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    time: PropTypes.string,
    location: PropTypes.string,
  }),
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};
