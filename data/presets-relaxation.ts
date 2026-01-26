import type { Preset } from '@/types'

export const relaxationPresets: Preset[] = [
  {
    id: 'page-turning',
    name: 'Book Pages',
    description: 'Gentle page turning of an old book',
    prompt:
      'Hands slowly turning pages of an antique leather book, soft paper rustling sounds, warm candlelight, cozy library atmosphere, close-up of aged paper texture, relaxing ASMR',
    category: 'relaxation',
    image: '/presets/book.jpg',
    credits: 5,
  },
  {
    id: 'keyboard-typing',
    name: 'Typing Sounds',
    description: 'Satisfying mechanical keyboard typing',
    prompt:
      'Fingers typing on a mechanical keyboard with satisfying clicky sounds, soft desk lamp lighting, close-up of keycaps, rhythmic typing pattern, work ASMR ambiance',
    category: 'relaxation',
    image: '/presets/keyboard.jpg',
    credits: 5,
  },
]
