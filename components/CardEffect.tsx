'use client'

import { useEffect } from 'react'

export function initializeCardEffects() {
  useEffect(() => {
    const cards = document.querySelectorAll('.card')
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const event = e as MouseEvent
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    })
  }, [])

  return null
} 