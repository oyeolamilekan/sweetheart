"use client"

import { useState } from "react"
import NotesEditor from "@/components/notes-editor"
import type { Note } from "@/types"

export default function Home() {
  const [note, setNote] = useState<Note>({
    id: "1",
    content:
      "I hope this letter finds you well—happy, healthy, and at peace with where life has taken you. Right now, as I write this, I have so many dreams, ambitions, and maybe even a few fears about what lies ahead. I wonder how much of what I hope for has come true and how much has changed in ways I could never have predicted.",
    date: new Date(),
    font: "Gloria Hallelujah",
    paperStyle: "college-ruled",
    fontColor: "#000000",
    backgroundColor: "#ffffff",
    stickers: [], // Initialize with an empty array
  })

  const updateNote = (updatedNote: Note) => {
    setNote(updatedNote)
  }

  return (
    <div className="min-h-screen max-w-6xl m-auto">
      <NotesEditor note={note} onUpdateNote={updateNote} />
    </div>
  )
}

