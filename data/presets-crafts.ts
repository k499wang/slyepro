import type { Preset } from '@/types'

export const craftsPresets: Preset[] = [
  {
    id: 'brush-painting',
    name: 'Brush Strokes',
    description: 'Soft brush painting on canvas',
    prompt:
      'Artist brush gliding across textured canvas with soft brush strokes, paint mixing and blending, close-up of bristles, soothing painting sounds, art studio ASMR',
    category: 'crafts',
    image: '/presets/paint_brush.jpg',
    credits: 5,
  },
  {
    id: 'scissors-cutting',
    name: 'Paper Cutting',
    description: 'Crisp scissors cutting through paper',
    prompt:
      'Sharp scissors cutting through crisp paper, satisfying snipping sounds, paper curls falling, close-up of clean cuts, craft room lighting, paper crafts ASMR',
    category: 'crafts',
    image: '/presets/paper_cutting.jpg',
    credits: 5,
  },
]
