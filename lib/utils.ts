import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  const trimmed = str.trim()
  if (!trimmed) return ''
  return trimmed[0].toUpperCase() + trimmed.slice(1)
}
