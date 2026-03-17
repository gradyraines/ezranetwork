import { useEffect, useRef, useCallback } from 'react'
import cytoscape, { type Core } from 'cytoscape'
import { useNetworkStore } from '../../store/useNetworkStore'
import { buildElements } from '../../lib/graphBuilder'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STYLESHEET: any[] = [
  {
    selector: 'node[?isEgo]',
    style: {
      'background-color': '#1e293b',
      label: 'data(label)',
      width: 50,
      height: 50,
      'font-size': '12px',
      'font-weight': 'bold',
      color: '#1e293b',
      'text-valign': 'bottom',
      'text-margin-y': 8,
    },
  },
  {
    selector: 'node[!isEgo]',
    style: {
      'background-color': 'data(color)',
      label: 'data(label)',
      width: 30,
      height: 30,
      'font-size': '10px',
      color: '#475569',
      'text-valign': 'bottom',
      'text-margin-y': 6,
    },
  },
  {
    selector: 'edge[?isEgoEdge]',
    style: {
      width: 'data(weight)',
      'line-color': '#94a3b8',
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'edge[!isEgoEdge]',
    style: {
      width: 'data(weight)',
      'line-color': '#cbd5e1',
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'edge[tieStrength = "weak"]',
    style: {
      'line-style': 'dashed',
    },
  },
  {
    selector: '.dimmed',
    style: {
      opacity: 0.15,
    },
  },
  {
    selector: '.highlighted',
    style: {
      opacity: 1,
      'border-width': 3,
      'border-color': '#f59e0b',
    },
  },
]

interface NetworkGraphProps {
  height?: string
  highlightNodeIds?: string[]
  highlightEdgeIds?: string[]
  onCyReady?: (cy: Core) => void
}

export function NetworkGraph({
  height = '100%',
  highlightNodeIds,
  highlightEdgeIds,
  onCyReady,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)

  const connections = useNetworkStore((s) => s.connections)
  const matrix = useNetworkStore((s) => s.matrix)
  const studentName = useNetworkStore((s) => s.studentName)

  const initCy = useCallback(() => {
    if (!containerRef.current) return
    if (cyRef.current) {
      cyRef.current.destroy()
    }

    const elements = buildElements(connections, matrix, studentName)

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: STYLESHEET,
      layout: {
        name: elements.length > 1 ? 'cose' : 'grid',
        animate: false,
        nodeDimensionsIncludeLabels: true,
        ...(elements.length > 1
          ? {
              idealEdgeLength: 120,
              nodeRepulsion: 8000,
              gravity: 0.3,
            }
          : {}),
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    })

    cyRef.current = cy
    onCyReady?.(cy)
  }, [connections, matrix, studentName, onCyReady])

  useEffect(() => {
    initCy()
    return () => {
      cyRef.current?.destroy()
      cyRef.current = null
    }
  }, [initCy])

  // Handle highlights
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.elements().removeClass('dimmed highlighted')

    if (highlightNodeIds?.length || highlightEdgeIds?.length) {
      cy.elements().addClass('dimmed')
      if (highlightNodeIds) {
        for (const id of highlightNodeIds) {
          cy.getElementById(id).removeClass('dimmed').addClass('highlighted')
        }
      }
      if (highlightEdgeIds) {
        for (const id of highlightEdgeIds) {
          cy.getElementById(id).removeClass('dimmed').addClass('highlighted')
        }
      }
    }
  }, [highlightNodeIds, highlightEdgeIds])

  const namedCount = connections.filter((c) => c.name.trim()).length

  return (
    <div style={{ height, position: 'relative' }}>
      {namedCount === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          Add connections to see your network
        </div>
      ) : null}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {namedCount > 0 && (
        <div className="absolute bottom-2 left-2 flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Same team
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Same org
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            Different org
          </span>
        </div>
      )}
    </div>
  )
}
