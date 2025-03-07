import { Button } from "@/components/ui/button"

interface PaperStyleSelectorProps {
  currentStyle: string
  onSelectStyle: (style: string) => void
}

const PAPER_STYLES = [
  { id: "default", name: "Default" },
  { id: "lined-paper", name: "Lined Paper" },
  { id: "grid-paper", name: "Grid Paper" },
  { id: "dotted-paper", name: "Dotted Paper" },
  { id: "vintage-paper", name: "Vintage Paper" },
  { id: "kraft-paper", name: "Kraft Paper" },
]

export default function PaperStyleSelector({ currentStyle, onSelectStyle }: PaperStyleSelectorProps) {
  return (
    <div className="p-2 w-64">
      <h3 className="font-medium mb-2">Select Paper Style</h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {PAPER_STYLES.map((style) => (
          <Button
            key={style.id}
            variant={currentStyle === style.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectStyle(style.id)}
          >
            <span>{style.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

