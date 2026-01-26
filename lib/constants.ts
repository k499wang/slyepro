/**
 * Application Constants
 *
 * Note: Credit costs are now defined in lib/generations/config.ts
 * Use getCreditCost(type) from that module instead of CREDIT_COSTS directly.
 */

export const APP_NAME = 'Slye'
export const APP_DOMAIN = 'slye.pro'
export const APP_DESCRIPTION = 'Generate AI ASMR videos with powerful presets'

/**
 * @deprecated Use getCreditCost(type) from '@/lib/generations' instead.
 * This is kept for backwards compatibility but the source of truth
 * is now in lib/generations/config.ts
 */
export const CREDIT_COSTS = {
  asmr_video: 5,
} as const

export const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 50, price: 499 },
  { id: 'popular', name: 'Popular', credits: 150, price: 999 },
  { id: 'pro', name: 'Pro', credits: 500, price: 2499 },
] as const

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Generate', href: '/dashboard/generate', icon: 'Sparkles' },
  { name: 'History', href: '/dashboard/history', icon: 'Clock' },
  { name: 'Credits', href: '/dashboard/credits', icon: 'Coins' },
] as const
