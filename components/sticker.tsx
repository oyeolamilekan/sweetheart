"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Trash2, RotateCcw } from "lucide-react"

interface StickerProps {
  id: string
  src: string
  initialPosition: { x: number; y: number }
  initialRotation: number
  initialSize: number
  onPositionChange: (x: number, y: number) => void
  onRotationChange: (rotation: number) => void
  onSizeChange: (size: number) => void
  onDelete: () => void
  isSelected: boolean
  onSelect: () => void
}

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right"

export default function Sticker({
  id,
  src,
  initialPosition,
  initialRotation,
  initialSize,
  onPositionChange,
  onRotationChange,
  onSizeChange,
  onDelete,
  isSelected,
  onSelect,
}: StickerProps) {
  const [position, setPosition] = useState(initialPosition)
  const [rotation, setRotation] = useState(initialRotation)
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizingCorner, setResizingCorner] = useState<Corner | null>(null)
  const stickerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number; size: number } | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        const newX = position.x + dx
        const newY = position.y + dy
        setPosition({ x: newX, y: newY })
        onPositionChange(newX, newY)
        dragStartRef.current = { x: e.clientX, y: e.clientY, size: dragStartRef.current.size }
      } else if (isRotating && stickerRef.current) {
        const rect = stickerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
        const newRotation = angle * (180 / Math.PI)
        setRotation(newRotation)
        onRotationChange(newRotation)
      } else if (isResizing && dragStartRef.current && resizingCorner) {
        const rect = stickerRef.current?.getBoundingClientRect()
        if (!rect) return

        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y

        // Calculate diagonal movement for proportional resizing
        const diagonal = Math.sqrt(dx * dx + dy * dy)
        const direction = dx + dy > 0 ? 1 : -1

        const newSize = Math.max(20, Math.min(dragStartRef.current.size + diagonal * direction, 200))
        setSize(newSize)
        onSizeChange(newSize)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsRotating(false)
      setIsResizing(false)
      setResizingCorner(null)
      dragStartRef.current = null
    }

    if (isDragging || isRotating || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isRotating, isResizing, position, onPositionChange, onRotationChange, onSizeChange, resizingCorner])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY, size }
    onSelect()
  }

  const handleRotateStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsRotating(true)
  }

  const handleResizeStart = (e: React.MouseEvent, corner: Corner) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizingCorner(corner)
    dragStartRef.current = { x: e.clientX, y: e.clientY, size }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
  }

  return (
    <div
      id={`sticker-${id}`}
      ref={stickerRef}
      className={`absolute cursor-move group select-none`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
        width: `${size}px`,
        height: `${size}px`,
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      role="img"
      aria-label="Draggable sticker"
      tabIndex={0}
    >
      <img
        src={src || "/placeholder.svg"}
        alt="Sticker"
        className="w-full h-full object-contain pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg?height=50&width=50"
          e.currentTarget.alt = "Failed to load sticker"
        }}
      />

      {/* Selection border and resize handles */}
      {isSelected && (
        <>
          {/* Blue border */}
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />

          {/* Resize handles */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
            <div
              key={corner}
              className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-nw-resize
                ${corner === "top-left" ? "top-0 left-0 -translate-x-1/2 -translate-y-1/2" : ""}
                ${corner === "top-right" ? "top-0 right-0 translate-x-1/2 -translate-y-1/2" : ""}
                ${corner === "bottom-left" ? "bottom-0 left-0 -translate-x-1/2 translate-y-1/2" : ""}
                ${corner === "bottom-right" ? "bottom-0 right-0 translate-x-1/2 translate-y-1/2" : ""}
              `}
              onMouseDown={(e) => handleResizeStart(e, corner as Corner)}
            />
          ))}

          {/* Control buttons */}
          <button
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={handleDelete}
            aria-label="Delete sticker"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            onMouseDown={handleRotateStart}
            aria-label="Rotate sticker"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  )
}

