import { ShieldCheck, Star, Crown, Award } from "lucide-react"

type BadgeType = "original" | "staff_pick" | "featured" | "verified" | "admin"

interface VirexBadgeProps {
  type: BadgeType
  size?: "sm" | "md" | "lg"
}

const badgeConfig: Record<
  BadgeType,
  { label: string; icon: typeof ShieldCheck; bgClass: string; textClass: string }
> = {
  original: {
    label: "VirexBooks Original",
    icon: ShieldCheck,
    bgClass: "bg-primary/15",
    textClass: "text-primary",
  },
  staff_pick: {
    label: "Staff Pick",
    icon: Star,
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-500",
  },
  featured: {
    label: "Featured",
    icon: Award,
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-500",
  },
  verified: {
    label: "Verified Author",
    icon: ShieldCheck,
    bgClass: "bg-primary/15",
    textClass: "text-primary",
  },
  admin: {
    label: "VirexBooks Staff",
    icon: Crown,
    bgClass: "bg-red-500/15",
    textClass: "text-red-400",
  },
}

const sizeClasses = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
}

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
}

export function VirexBadge({ type, size = "md" }: VirexBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgClass} ${config.textClass} ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  )
}
