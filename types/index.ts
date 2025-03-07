export interface Note {
  id: string
  content: string
  date: Date
  font: string
  paperStyle: string
  fontColor: string
  backgroundColor: string
  stickers: Sticker[]
}

export interface Sticker {
  id: string
  src: string
  position: {
    x: number
    y: number
  }
  rotation: number
  size: number
}

