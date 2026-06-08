import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display',
        'text-h1',
        'text-h2',
        'text-h3',
        'text-body',
        'text-body-sm',
        'text-small',
      ],
    },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
