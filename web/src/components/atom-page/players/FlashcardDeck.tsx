import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'
import type { FlashcardContent } from '@/lib/types'

interface FlashcardDeckProps {
  content: FlashcardContent
  onCanCompleteChange: (can: boolean) => void
}

export default function FlashcardDeck({ content, onCanCompleteChange }: FlashcardDeckProps) {
  const [cards, setCards] = useState(content.cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [viewed, setViewed] = useState<Set<string>>(new Set())

  const card = cards[index]

  function flip() {
    setFlipped(f => !f)
    setViewed(prev => {
      const next = new Set(prev)
      next.add(card.id)
      if (next.size === cards.length) onCanCompleteChange(true)
      return next
    })
  }

  function prev() {
    setIndex(i => Math.max(0, i - 1))
    setFlipped(false)
  }

  function next() {
    setIndex(i => Math.min(cards.length - 1, i + 1))
    setFlipped(false)
  }

  function shuffle() {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setIndex(0)
    setFlipped(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1rem 0',
      }}
    >
      {/* Progress indicator */}
      <div style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.5 }}>
        {index + 1} / {cards.length} · {viewed.size} viewed
      </div>

      {/* Card */}
      <div
        onClick={flip}
        style={{
          width: '100%',
          maxWidth: 480,
          height: 240,
          cursor: 'pointer',
          perspective: 1000,
          position: 'relative',
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* Front */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '16px',
              background: 'var(--surface-bright)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  opacity: 0.7,
                }}
              >
                TERM
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--foreground)',
                }}
              >
                {card.front}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--foreground)',
                  opacity: 0.4,
                  marginTop: '1rem',
                }}
              >
                Click to reveal
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '16px',
              background: 'color-mix(in srgb, var(--primary) 10%, var(--surface-bright))',
              border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  opacity: 0.7,
                }}
              >
                DEFINITION
              </div>
              <div
                style={{ fontSize: '1rem', color: 'var(--foreground)', lineHeight: 1.6 }}
              >
                {card.back}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={prev}
          disabled={index === 0}
          style={{
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--surface-container-low)',
            border: 'none',
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            opacity: index === 0 ? 0.3 : 0.8,
            color: 'var(--foreground)',
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={shuffle}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'var(--surface-container-low)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--foreground)',
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
          }}
        >
          <Shuffle size={14} /> Shuffle
        </button>
        <button
          onClick={next}
          disabled={index === cards.length - 1}
          style={{
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--surface-container-low)',
            border: 'none',
            cursor: index === cards.length - 1 ? 'not-allowed' : 'pointer',
            opacity: index === cards.length - 1 ? 0.3 : 0.8,
            color: 'var(--foreground)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* All-viewed confirmation */}
      {viewed.size === cards.length && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: 'var(--success, #69f6b8)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          All cards reviewed — ready to complete!
        </motion.div>
      )}
    </div>
  )
}
