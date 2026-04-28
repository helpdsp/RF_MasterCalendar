import { type EdgeProps, getStraightPath, BaseEdge } from '@xyflow/react'

export default function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: 'var(--primary-dim)',
          strokeWidth: 2,
          strokeDasharray: 6,
          strokeDashoffset: 0,
          opacity: 0.5,
          animation: 'dashmove 2s linear infinite',
        }}
      />
      <style>{`@keyframes dashmove { to { stroke-dashoffset: -12; } }`}</style>
    </>
  )
}
