import type { Note } from "@/types"
import { Plus } from "lucide-react"

interface SidebarProps {
  notes: Note[]
  activeNoteId: string
  onSelectNote: (id: string) => void
  onAddNote: () => void
}

export default function Sidebar({ notes, activeNoteId, onSelectNote, onAddNote }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">
            <span>📝</span>
          </div>
          <span className="ml-2 font-semibold">Beta</span>
        </div>
        <button onClick={onAddNote} className="p-1 rounded-full hover:bg-gray-100">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500">Today</h2>
          <div className="mt-2 space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`p-2 rounded-lg cursor-pointer ${
                  activeNoteId === note.id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <p className="text-sm truncate">{note.content || "New note"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
            <span>🔍</span>
          </div>
          <span className="ml-2 text-xs font-medium">Free</span>
        </div>
      </div>
    </div>
  )
}

