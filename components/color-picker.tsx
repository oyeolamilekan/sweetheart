"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useEffect } from "react"
import { FocusTrap } from "@/components/ui/focus-trap"

interface ColorPickerProps {
  colors: Array<{ name: string; value: string }>
  selectedColor: string
  onColorChange: (color: string) => void
}

export function ColorPicker({ colors, selectedColor, onColorChange }: ColorPickerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const firstRowColors = colors.slice(0, 6)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExpanded && containerRef.current) {
      const firstButton = containerRef.current.querySelector("button")
      if (firstButton) {
        firstButton.focus()
      }
    }
  }, [isExpanded])

  const ColorButton = ({
    color,
    isSelected,
    onClick,
  }: {
    color: { name: string; value: string }
    isSelected: boolean
    onClick: () => void
  }) => (
    <button
      className={cn(
        "w-7 h-7 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
        isSelected && "ring-2 ring-offset-2 ring-blue-500",
      )}
      style={{
        backgroundColor: color.value,
      }}
      onClick={onClick}
    >
      {isSelected && (
        <Check
          className={cn(
            "w-4 h-4 mx-auto",
            ["#ffffff", "#f3f4f6", "#fde047"].includes(color.value) ? "text-gray-800" : "text-white",
          )}
        />
      )}
      <span className="sr-only">{color.name}</span>
    </button>
  )

  return (
    <div className="w-auto">
      <FocusTrap active={isExpanded}>
        <div
          ref={containerRef}
          className={cn(
            "bg-white rounded-xl p-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)] relative transition-all duration-200",
            isExpanded ? "w-[280px]" : "w-[238px]",
          )}
        >
          <div className={cn("grid gap-1.5", isExpanded ? "grid-cols-7" : "grid-cols-7")}>
            {isExpanded
              ? colors.map((color) => (
                  <ColorButton
                    key={color.value}
                    color={color}
                    isSelected={selectedColor === color.value}
                    onClick={() => onColorChange(color.value)}
                  />
                ))
              : [
                  ...firstRowColors.map((color) => (
                    <ColorButton
                      key={color.value}
                      color={color}
                      isSelected={selectedColor === color.value}
                      onClick={() => onColorChange(color.value)}
                    />
                  )),
                  <button
                    key="expand"
                    className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                    onClick={() => setIsExpanded(true)}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                    <span className="sr-only">Show more colors</span>
                  </button>,
                ]}
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}

