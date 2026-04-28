import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import type { PlaybookContent } from '@/lib/types'

interface PlaybookReaderProps {
  content: PlaybookContent
  onCanCompleteChange: (can: boolean) => void
}

export default function PlaybookReader({ content, onCanCompleteChange }: PlaybookReaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [readProgress, setReadProgress] = useState(0)

  // IntersectionObserver: when sentinel (bottom of content) is visible, enable completion
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onCanCompleteChange(true)
          setReadProgress(100)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onCanCompleteChange])

  // Extract TOC from markdown (H2 headings only)
  const toc = [...content.markdown.matchAll(/^## (.+)$/gm)].map((m, i) => ({
    id: m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label: m[1],
    index: i,
  }))

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* TOC - desktop sticky sidebar */}
      {toc.length > 0 && (
        <aside className="hidden lg:block" style={{
          width: 200, flexShrink: 0,
          position: 'sticky', top: 80,
          fontSize: '0.8rem',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--foreground)', opacity: 0.5, marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Contents
          </div>
          {toc.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: 'block', padding: '4px 8px',
                color: 'var(--foreground)', opacity: 0.65,
                textDecoration: 'none', borderRadius: '6px',
                marginBottom: '2px',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.65'; e.currentTarget.style.color = 'var(--foreground)' }}
            >
              {item.label}
            </a>
          ))}

          {/* Read progress */}
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--foreground)', opacity: 0.4 }}>
            {readProgress}% read
          </div>
        </aside>
      )}

      {/* Article content */}
      <article style={{ flex: 1, minWidth: 0 }}>
        <style>{`
          .playbook-content h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 800; color: var(--foreground); margin: 0 0 1rem; }
          .playbook-content h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--foreground); margin: 2rem 0 0.75rem; }
          .playbook-content h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--foreground); margin: 1.5rem 0 0.5rem; }
          .playbook-content p { font-family: 'Inter', sans-serif; font-size: 0.9375rem; line-height: 1.75; color: var(--foreground); opacity: 0.85; margin: 0 0 1rem; }
          .playbook-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: var(--surface-container-high); padding: 2px 6px; border-radius: 4px; }
          .playbook-content pre { background: var(--surface-container-low); border-radius: 10px; padding: 1rem 1.25rem; overflow-x: auto; margin: 1rem 0; }
          .playbook-content pre code { background: none; padding: 0; font-size: 0.85rem; line-height: 1.6; }
          .playbook-content ul, .playbook-content ol { padding-left: 1.5rem; margin: 0 0 1rem; }
          .playbook-content li { font-family: 'Inter', sans-serif; font-size: 0.9375rem; line-height: 1.75; color: var(--foreground); opacity: 0.85; margin-bottom: 0.25rem; }
          .playbook-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
          .playbook-content th { text-align: left; padding: 8px 12px; background: var(--surface-container-high); color: var(--foreground); font-weight: 600; }
          .playbook-content td { padding: 8px 12px; border-bottom: 1px solid color-mix(in srgb, var(--foreground) 8%, transparent); color: var(--foreground); opacity: 0.8; }
          .playbook-content blockquote { border-left: 4px solid var(--primary); margin: 1rem 0; padding: 0.75rem 1rem; background: color-mix(in srgb, var(--primary) 8%, transparent); border-radius: 0 8px 8px 0; }
        `}</style>
        <div className="playbook-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
            {content.markdown}
          </ReactMarkdown>
        </div>
        {/* Sentinel for completion detection */}
        <div ref={sentinelRef} style={{ height: 1, marginTop: '2rem' }} />
      </article>
    </div>
  )
}
