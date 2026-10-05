/**
 * Threat Level Calculation & Standardized Security Indicators
 * 
 * Application-defined threat thresholds:
 * 0 - 30%: LOW
 * 30 - 60%: MEDIUM
 * 60 - 80%: HIGH
 * 80 - 100%: CRITICAL
 */

export function calculateThreatLevel(fakeProbability) {
  const probPercent = (fakeProbability || 0) * 100;

  if (probPercent >= 80) {
    return {
      level: "CRITICAL",
      color: "red",
      textColor: "text-red-400",
      bgColor: "bg-red-950/40",
      borderColor: "border-red-500/50",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/40",
      glowColor: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
      alertTitle: "SECURITY ALERT",
      alertMessage: "Potential synthetic speech detected.",
      actionRequired: "Do not authenticate the caller using voice alone.",
      label: "Application-defined threat level"
    };
  } else if (probPercent >= 60) {
    return {
      level: "HIGH",
      color: "orange",
      textColor: "text-amber-400",
      bgColor: "bg-amber-950/40",
      borderColor: "border-amber-500/50",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/40",
      glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      alertTitle: "SECURITY ALERT",
      alertMessage: "Potential synthetic speech detected.",
      actionRequired: "Do not authenticate the caller using voice alone.",
      label: "Application-defined threat level"
    };
  } else if (probPercent >= 30) {
    return {
      level: "MEDIUM",
      color: "yellow",
      textColor: "text-yellow-300",
      bgColor: "bg-yellow-950/40",
      borderColor: "border-yellow-500/40",
      badgeColor: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
      glowColor: "shadow-[0_0_20px_rgba(234,179,8,0.2)]",
      alertTitle: "REVIEW RECOMMENDED",
      alertMessage: "Audio parameters warrant manual review.",
      actionRequired: "Use another verification method to confirm identity.",
      label: "Application-defined threat level"
    };
  } else {
    return {
      level: "LOW",
      color: "green",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-950/40",
      borderColor: "border-emerald-500/50",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40",
      glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
      alertTitle: "AUDIO APPEARS BONAFIDE",
      alertMessage: "Audio classified as likely bonafide speech.",
      actionRequired: "Continue normal verification procedures when appropriate.",
      label: "Application-defined threat level"
    };
  }
}
