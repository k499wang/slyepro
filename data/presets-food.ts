import type { Preset } from '@/types'

export const foodPresets: Preset[] = [
  {
    id: 'honey-drip',
    name: 'Honey Dripping',
    description: 'Golden honey flowing in slow motion',
    prompt:
      'Thick golden honey dripping from a wooden honey dipper in slow motion, glistening in warm sunlight, viscous flowing texture, satisfying dripping sounds, food ASMR',
    category: 'food',
    image: '/presets/honey.jpeg',
    credits: 5,
  },
  {
    id: 'crispy-frying',
    name: 'Crispy Frying',
    description: 'Sizzling crispy food being fried',
    prompt:
      'Close-up of crispy food sizzling in hot oil, golden bubbling sounds, steam rising, crunchy coating forming, satisfying frying ASMR, warm kitchen lighting',
    category: 'food',
    image: '/presets/fried_food.jpg',
    credits: 5,
  },
]
