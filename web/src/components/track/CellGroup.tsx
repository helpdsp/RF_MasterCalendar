interface CellGroupProps {
  title: string
  style?: React.CSSProperties
}

export default function CellGroup({ title, style }: CellGroupProps) {
  return (
    <div style={{
      position: 'absolute',
      borderRadius: 16,
      background: 'color-mix(in srgb, var(--primary) 5%, transparent)',
      border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: -12, left: 12,
        background: 'var(--background)',
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: '0.7rem',
        fontWeight: 600,
        color: 'var(--primary)',
        opacity: 0.8,
      }}>{title}</div>
    </div>
  )
}
