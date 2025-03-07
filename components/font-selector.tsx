import { Button } from "@/components/ui/button"

interface FontSelectorProps {
  currentFont: string
  onSelectFont: (font: string) => void
}

const FONTS = [
  "Gloria Hallelujah",
  "Caveat",
  "Indie Flower",
  "Shadows Into Light",
  "Pacifico",
  "Architects Daughter",
  "Comic Neue",
  "Kalam",
  "Patrick Hand",
  "Satisfy",
]

export default function FontSelector({ currentFont, onSelectFont }: FontSelectorProps) {
  return (
    <div className="p-2 w-64">
      <h3 className="font-medium mb-2">Select Font</h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {FONTS.map((font) => (
          <Button
            key={font}
            variant={currentFont === font ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectFont(font)}
            style={{ fontFamily: font }}
          >
            <span>{font}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

