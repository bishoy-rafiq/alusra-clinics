import {
  Smile,
  HeartPulse,
  Sparkles,
  Baby,
  Activity,
  ShieldPlus,
  Sun,
  Droplet,
  Sparkle,
  Stethoscope,
  Star,
} from "lucide-react";

export const ICONS = {
  smile: Smile,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  baby: Baby,
  activity: Activity,
  "shield-plus": ShieldPlus,
  sun: Sun,
  droplet: Droplet,
  sparkle: Sparkle,
  stethoscope: Stethoscope,
};

export function getServiceIcon(key) {
  return ICONS[key] || Star;
}
