import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Gift, Crown, Sparkles, TrendingUp } from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    points: 0,
    color: "from-amber-700 to-amber-600",
    benefits: ["5% off products"],
  },
  {
    name: "Silver",
    points: 500,
    color: "from-stone-400 to-stone-300",
    benefits: ["10% off products", "Priority booking"],
  },
  {
    name: "Gold",
    points: 1000,
    color: "from-amber-400 to-amber-300",
    benefits: ["15% off everything", "Free hot towel"],
  },
  {
    name: "Platinum",
    points: 2500,
    color: "from-stone-600 to-stone-400",
    benefits: ["20% off everything", "VIP access", "Free products"],
  },
];

export default function LoyaltyCard({ points = 750, className = "" }) {
  const currentTier = tiers.reduce(
    (acc, tier) => (points >= tier.points ? tier : acc),
    tiers[0]
  );
  const nextTier = tiers.find((tier) => tier.points > points);
  const progress = nextTier
    ? ((points - currentTier.points) / (nextTier.points - currentTier.points)) *
      100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl ${className}`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTier.color}`}
      />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {currentTier.name} Member
              </span>
            </div>
            <h3 className="text-4xl font-light text-white">
              {points.toLocaleString()}
            </h3>
            <p className="text-white/70 text-sm">Loyalty Points</p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-white/80 mb-2">
              <span>Progress to {nextTier.name}</span>
              <span>{nextTier.points - points} pts to go</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}

        {/* Current Benefits */}
        <div className="mb-6">
          <p className="text-white/70 text-xs uppercase tracking-wider mb-2">
            Your Benefits
          </p>
          <div className="flex flex-wrap gap-2">
            {currentTier.benefits.map((benefit, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Earn More Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Earn 1 pt per $1 spent</span>
          </div>
          <Link to={createPageUrl("Memberships")}>
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
            >
              <Gift className="w-4 h-4 mr-2" />
              Redeem
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

LoyaltyCard.propTypes = {
  points: PropTypes.number,
  className: PropTypes.string,
};
