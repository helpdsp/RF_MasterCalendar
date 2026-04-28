import type { TaskContent } from '@/lib/types'

export default function TaskInstructions({ content }: { content: TaskContent }) {
  return (
    <div>
      <style>{`
        .task-instructions h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--foreground); margin: 0 0 0.875rem; }
        .task-instructions h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 600; color: var(--foreground); margin: 1.5rem 0 0.5rem; }
        .task-instructions p { font-family: 'Inter', sans-serif; font-size: 0.9375rem; line-height: 1.7; color: var(--foreground); opacity: 0.85; margin: 0 0 1rem; }
        .task-instructions ul, .task-instructions ol { padding-left: 1.5rem; margin: 0 0 1rem; }
        .task-instructions li { font-size: 0.9375rem; line-height: 1.7; color: var(--foreground); opacity: 0.85; margin-bottom: 0.25rem; }
        .task-instructions pre { background: var(--surface-container-low); border-radius: 10px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .task-instructions code { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; background: var(--surface-container-high); padding: 2px 6px; border-radius: 4px; }
        .task-instructions pre code { background: none; padding: 0; }
      `}</style>
      <div
        className="task-instructions"
        dangerouslySetInnerHTML={{ __html: content.instructionsHtml }}
      />
      {content.referenceImageUrl && (
        <img
          src={content.referenceImageUrl}
          alt="Reference"
          style={{ marginTop: '1rem', maxWidth: '100%', borderRadius: '10px' }}
        />
      )}
    </div>
  )
}
