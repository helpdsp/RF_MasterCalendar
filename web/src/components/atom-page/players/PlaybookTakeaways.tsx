import { motion } from 'framer-motion'
import type { PlaybookContent } from '@/lib/types'

export default function PlaybookTakeaways({ content }: { content: PlaybookContent }) {
  return (
    <div style={{ padding: '0.5rem 0' }}>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1.25rem' }}>
        Key Takeaways
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {content.keyTakeaways.map((point, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '0.875rem 1rem',
              borderRadius: '10px',
              background: 'var(--surface-container-low)',
            }}
          >
            <span style={{
              flexShrink: 0, width: 24, height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: '#fff',
            }}>{i + 1}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--foreground)', lineHeight: 1.6, opacity: 0.9 }}>{point}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
