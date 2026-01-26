import type { Preset } from '@/types'

export const naturePresets: Preset[] = [
  {
    id: 'rain-window',
    name: 'Rain on Window',
    description: 'Gentle rain droplets on a cozy window',
    prompt:
      'Close-up of rain droplets on window glass, cozy warm interior lighting, gentle rain sounds, water trickling down, blurred city lights in background, peaceful ASMR',
    category: 'nature',
    image: '/presets/rain_window.jpg',
    credits: 5,
  },
  {
    id: 'forest-stream',
    name: 'Forest Stream',
    description: 'Babbling brook in a peaceful forest',
    prompt:
      'Crystal clear stream flowing over smooth stones in a lush green forest, gentle water sounds, dappled sunlight through leaves, moss covered rocks, nature ASMR',
    category: 'nature',
    image: '/presets/forest_stream.jpeg',
    credits: 5,
  },
]
