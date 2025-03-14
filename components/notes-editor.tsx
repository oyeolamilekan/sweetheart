"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import type { Note, Sticker as StickerType } from "@/types"
import { Type, Image as ImageIcon, Palette, PenTool, Download, FileType, StickerIcon, Info } from "lucide-react"
import PaperBackground from "./paper-background"
import Sticker from "./sticker"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ExportDialog from "./export-dialog"
import { ColorPicker } from "./color-picker"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NotesEditorProps {
  note: Note
  onUpdateNote: (note: Note) => void
}

const FONTS = [
  "Gloria Hallelujah",
  "Caveat",
  "Indie Flower",
  "Shadows Into Light",
  "Pacifico",
  "Homemade Apple",
  "Permanent Marker",
  "Amatic SC",
  "Satisfy",
  "Kalam",
  "Handlee",
  "Patrick Hand",
  "Sriracha",
  "Gochi Hand",
  "Covered By Your Grace",
]

const PAPER_STYLES = [
  { id: "default", name: "Default" },
  { id: "college-ruled", name: "College Ruled" },
  { id: "wide-ruled", name: "Wide Ruled" },
  { id: "graph-paper", name: "Graph Paper" },
  { id: "dot-grid", name: "Dot Grid" },
  { id: "cornell", name: "Cornell Notes" },
]

const BACKGROUND_COLORS = [
  { name: "Orange", value: "#f97316" },
  { name: "Black", value: "#000000" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Yellow", value: "#fde047" },
  { name: "Brown", value: "#92400e" },
  { name: "Green", value: "#4ade80" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Red", value: "#dc2626" },
  { name: "Hot Pink", value: "#f472b6" },
  { name: "Light Blue", value: "#7dd3fc" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Dark Gray", value: "#6b7280" },
]

const FONT_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Dark Blue", value: "#1e3a8a" },
  { name: "Dark Purple", value: "#581c87" },
  { name: "Dark Green", value: "#14532d" },
  { name: "Dark Red", value: "#7f1d1d" },
  { name: "Dark Gray", value: "#1f2937" },
  { name: "Dark Brown", value: "#451a03" },
  { name: "Navy", value: "#172554" },
  { name: "Dark Teal", value: "#134e4a" },
  { name: "Dark Orange", value: "#7c2d12" },
  { name: "Dark Pink", value: "#831843" },
  { name: "Dark Violet", value: "#4c1d95" },
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#9ca3af" },
]

const STICKERS = [
  "/image1.png",
  "/image2.png",
  "/image3.png",
  "/image4.png",
  "/image5.png",
  "/image6.png",
  "/image7.png",
  "/image8.png",
  "/image9.png",
  "/image10.png",
  "/image11.png",
]

const CREDITS = [
  "https://www.flaticon.com/free-icons/smile",
  "https://www.flaticon.com/free-icons/emot",
  "https://www.flaticon.com/free-icons/emoji",
  "https://www.flaticon.com/free-icons/check-mark",
  "https://www.flaticon.com/free-icons/pepper",
  "https://www.flaticon.com/free-icons/cake",
  "https://www.flaticon.com/free-icons/smileys",
  "https://www.flaticon.com/free-icons/emoji",
  "https://www.flaticon.com/free-icons/happiness",
  "https://www.flaticon.com/free-icons/heart-eyes",
  "https://www.flaticon.com/free-icons/cool"
]

export default function NotesEditor({ note, onUpdateNote }: NotesEditorProps) {
  const [content, setContent] = useState(note.content)
  const [charCount, setCharCount] = useState(note.content.length)
  const [backgroundColor, setBackgroundColor] = useState(note.backgroundColor || BACKGROUND_COLORS[0].value)
  const [fontColor, setFontColor] = useState(note.fontColor || FONT_COLORS[0].value)
  const [stickers, setStickers] = useState<StickerType[]>(note.stickers || [])
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [, setExportedFormat] = useState<"png" | "pdf" | null>(null)
  const [showCreditsDialog, setShowCreditsDialog] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    setContent(note.content)
    setCharCount(note.content.length)
    setFontColor(note.fontColor || FONT_COLORS[0].value)
    setBackgroundColor(note.backgroundColor || BACKGROUND_COLORS[0].value)
    setStickers(note.stickers || [])
  }, [note])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedStickerId) {
        handleStickerDelete(selectedStickerId)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedStickerId])

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const clickedSticker = stickers.find((sticker) => {
        const element = document.getElementById(`sticker-${sticker.id}`)
        return element && element.contains(e.target as Node)
      })

      if (!clickedSticker) {
        setSelectedStickerId(null)
      }
    },
    [stickers],
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [handleOutsideClick])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setCharCount(newContent.length)
    onUpdateNote({
      ...note,
      content: newContent,
    })
  }

  const handleFontChange = (font: string) => {
    onUpdateNote({
      ...note,
      font,
    })
  }

  const handlePaperStyleChange = (style: string) => {
    onUpdateNote({
      ...note,
      paperStyle: style,
    })
  }

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color)
    onUpdateNote({
      ...note,
      backgroundColor: color,
    })
  }

  const handleFontColorChange = (color: string) => {
    setFontColor(color)
    onUpdateNote({
      ...note,
      fontColor: color,
    })
  }

  const handleClearText = () => {
    setContent("")
    setCharCount(0)
    onUpdateNote({
      ...note,
      content: "",
    })
  }

  const handleAddSticker = (stickerSrc: string) => {
    const newSticker: StickerType = {
      id: Date.now().toString(),
      src: stickerSrc,
      position: { x: 50, y: 50 },
      rotation: 0,
      size: 50,
    }
    const updatedStickers = [...stickers, newSticker]
    setStickers(updatedStickers)
    onUpdateNote({
      ...note,
      stickers: updatedStickers,
    })
  }

  const handleStickerPositionChange = (id: string, x: number, y: number) => {
    const updatedStickers = stickers.map((sticker) =>
      sticker.id === id ? { ...sticker, position: { x, y } } : sticker,
    )
    setStickers(updatedStickers)
    onUpdateNote({
      ...note,
      stickers: updatedStickers,
    })
  }

  const handleStickerRotationChange = (id: string, rotation: number) => {
    const updatedStickers = stickers.map((sticker) => (sticker.id === id ? { ...sticker, rotation } : sticker))
    setStickers(updatedStickers)
    onUpdateNote({
      ...note,
      stickers: updatedStickers,
    })
  }

  const handleStickerSizeChange = (id: string, size: number) => {
    const updatedStickers = stickers.map((sticker) => (sticker.id === id ? { ...sticker, size } : sticker))
    setStickers(updatedStickers)
    onUpdateNote({
      ...note,
      stickers: updatedStickers,
    })
  }

  const handleStickerDelete = (id: string) => {
    const updatedStickers = stickers.filter((sticker) => sticker.id !== id)
    setStickers(updatedStickers)
    setSelectedStickerId(null)
    onUpdateNote({
      ...note,
      stickers: updatedStickers,
    })
  }

  const handleStickerSelect = (id: string) => {
    setSelectedStickerId(id === selectedStickerId ? null : id)
  }

  const handleExport = async (format: "png" | "pdf") => {
    if (!paperRef.current) return

    try {
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      if (format === "png") {
        const image = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = image
        link.download = "handwritten-note.png"
        link.click()
      } else if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        })
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
        pdf.save("handwritten-note.pdf")
      }

      setExportedFormat(format)
      setShowExportDialog(true)
    } catch (error) {
      console.error("Error exporting image:", error)
    }
  }

  const getLineHeight = (paperStyle: string) => {
    switch (paperStyle) {
      case "default":
        return "1.5"
      case "wide-ruled":
        return "36px"
      case "college-ruled":
        return "31px"
      case "graph-paper":
      case "dot-grid":
        return "20px"
      case "cornell":
        return "31px"
      default:
        return "31px"
    }
  }

  const getPadding = (paperStyle: string) => {
    switch (paperStyle) {
      case "default":
        return "30px"
      case "wide-ruled":
        return "35px 30px 0"
      case "college-ruled":
        return "30px 30px 0"
      case "cornell":
        return "30px 30px 0 70px"
      case "graph-paper":
      case "dot-grid":
        return "20px 30px 0"
      default:
        return "30px 30px 0"
    }
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (isSmallScreen) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Please Use a Larger Screen</h1>
          <p className="text-gray-400">
            This app is designed for laptop and desktop screens. Please access it on a device with a screen width of at least 1024px for the best experience.
          </p>
          <a 
            href="https://mvp.appstate.co" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Built by AppState
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white relative isolate">
      {/* Header */}
      <header className="bg-black px-4 py-3 flex items-center justify-between rounded-xl mx-6 mt-4">
        <div className="flex items-center gap-3">
          <Select value={note.font} onValueChange={handleFontChange}>
            <SelectTrigger className="w-[180px] h-10 bg-gray-800 border-none text-white">
              <Type className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={note.paperStyle} onValueChange={handlePaperStyleChange}>
            <SelectTrigger className="w-[180px] h-10 bg-gray-800 border-none text-white">
              <ImageIcon className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Paper Style" />
            </SelectTrigger>
            <SelectContent>
              {PAPER_STYLES.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 bg-gray-800 border-none text-white hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out"
                    >
                      <Palette className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-1.5 border-none shadow-lg" sideOffset={5}>
                    <ColorPicker
                      colors={BACKGROUND_COLORS}
                      selectedColor={backgroundColor}
                      onColorChange={handleBackgroundColorChange}
                    />
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Background Color</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 bg-gray-800 border-none text-white hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out"
                    >
                      <PenTool className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-1.5 border-none shadow-lg" sideOffset={5}>
                    <ColorPicker colors={FONT_COLORS} selectedColor={fontColor} onColorChange={handleFontColorChange} />
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Font Color</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-[140px] h-10 bg-gray-800 border-none text-white hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out"
              >
                <StickerIcon className="w-4 h-4 mr-2" />
                Add Sticker
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[400px] h-[500px] p-4 border-none shadow-xl bg-white relative z-[9999] overflow-hidden"
              sideOffset={5}
              forceMount
            >
              <div className="absolute inset-0 bg-white rounded-lg" />
              <div className="relative z-10 h-full overflow-auto">
                <div className="grid grid-cols-4 gap-4 p-0.5">
                  {STICKERS.map((sticker, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="p-2 h-auto aspect-square"
                      onClick={() => handleAddSticker(sticker)}
                    >
                      <Image
                        src={sticker}
                        width={100}
                        height={100}
                        alt={sticker + index}
                        className="w-full h-full object-contain"
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="w-10 h-10 p-0 bg-gray-800 hover:bg-gray-700">
                      <Download className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("png")} className="cursor-pointer">
                      <FileType className="w-4 h-4 mr-2" />
                      Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")} className="cursor-pointer">
                      <FileType className="w-4 h-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 p-0 text-white hover:text-white bg-gray-800 hover:bg-gray-700"
                  onClick={() => setShowCreditsDialog(true)}
                >
                  <Info className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Credits</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 grid md:grid-cols-2 gap-6 p-4 md:p-6">
        {/* Left side - Input */}
        <div className="flex flex-col">
          <div className="flex-1 bg-white rounded-xl p-4 overflow-hidden shadow-md">
            <div className="w-full h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing..."
                className="flex-1 w-full h-full resize-none border-none focus:outline-none text-gray-800 text-base p-4 bg-transparent"
                maxLength={500}
              />
              <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-8 p-0 text-gray-500">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert Bullet Point</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-8 p-0 text-gray-500">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert Plus Sign</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{charCount}/500</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-sm text-gray-500"
                    onClick={handleClearText}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Preview */}
        <div
          className="h-full rounded-xl bg-red-50 p-1"
          style={{ backgroundColor }}
        >
          <div
            ref={paperRef}
            className="relative p-9 bg-white z-10 overflow-auto h-full"
            style={{ backgroundColor }}
          >
            {stickers.map((sticker) => (
              <Sticker
                key={sticker.id}
                id={sticker.id}
                src={sticker.src}
                initialPosition={sticker.position}
                initialRotation={sticker.rotation}
                initialSize={sticker.size}
                onPositionChange={(x, y) => handleStickerPositionChange(sticker.id, x, y)}
                onRotationChange={(rotation) => handleStickerRotationChange(sticker.id, rotation)}
                onSizeChange={(size) => handleStickerSizeChange(sticker.id, size)}
                onDelete={() => handleStickerDelete(sticker.id)}
                isSelected={selectedStickerId === sticker.id}
                onSelect={() => handleStickerSelect(sticker.id)}
              />
            ))}
            <PaperBackground style={note.paperStyle}>
              <div
                style={{
                  fontFamily: note.font || "Gloria Hallelujah",
                  color: fontColor,
                  fontSize: "18px",
                  lineHeight: getLineHeight(note.paperStyle),
                  padding: getPadding(note.paperStyle),
                }}
                className="break-words min-h-full whitespace-pre-wrap"
              >
                {content}
              </div>
            </PaperBackground>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <a
          href="https://mvp.appstate.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Built by AppState
        </a>
      </footer>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />

      {/* Credits Dialog */}
      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {CREDITS.map((credit, index) => (
              <a
                key={index}
                href={credit}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                {credit}
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

