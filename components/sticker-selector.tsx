import { Button } from "@/components/ui/button"

interface StickerSelectorProps {
  onSelectSticker: (sticker: string) => void
}

const STICKERS = [
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
  "/placeholder.svg?height=40&width=40",
]

export default function StickerSelector({ onSelectSticker }: StickerSelectorProps) {
  return (
    <div className="p-2 w-64">
      <h3 className="font-medium mb-2">Select Sticker</h3>
      <div className="grid grid-cols-4 gap-2">
        {STICKERS.map((sticker, index) => (
          <Button key={index} variant="ghost" className="p-2 h-auto" onClick={() => onSelectSticker(sticker)}>
            <img src={sticker || "/placeholder.svg"} alt={`Sticker ${index + 1}`} className="w-full h-auto" />
          </Button>
        ))}
      </div>
    </div>
  )
}

