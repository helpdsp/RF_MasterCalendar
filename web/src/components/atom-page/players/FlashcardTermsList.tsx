import type { FlashcardContent } from '@/lib/types'

export default function FlashcardTermsList({ content }: { content: FlashcardContent }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr
            style={{
              borderBottom: '2px solid color-mix(in srgb, var(--foreground) 10%, transparent)',
            }}
          >
            <th
              style={{
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                color: 'var(--foreground)',
                opacity: 0.7,
              }}
            >
              Term
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                color: 'var(--foreground)',
                opacity: 0.7,
              }}
            >
              Definition
            </th>
          </tr>
        </thead>
        <tbody>
          {content.cards.map((card, i) => (
            <tr
              key={card.id}
              style={{
                borderBottom:
                  '1px solid color-mix(in srgb, var(--foreground) 5%, transparent)',
                background:
                  i % 2 === 0 ? 'transparent' : 'var(--surface-container-low)',
              }}
            >
              <td
                style={{
                  padding: '0.625rem 0.75rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  verticalAlign: 'top',
                  whiteSpace: 'nowrap',
                }}
              >
                {card.front}
              </td>
              <td
                style={{
                  padding: '0.625rem 0.75rem',
                  color: 'var(--foreground)',
                  opacity: 0.8,
                  lineHeight: 1.5,
                }}
              >
                {card.back}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
