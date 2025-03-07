"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Launch Your MLP(Minimum Lovable Product) within a month!</DialogTitle>
          <DialogDescription className="text-base">
            I built Appstate — The product studio that turns your idea into a Minimum Lovable Product (MLP) in just 30 days. Whether it&apos;s a SaaS, AI tool, or marketplace, we help you launch fast with a rock-solid foundation. Build your MLP for $1,999. 🚀
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button 
            size="lg" 
            className="w-full bg-black hover:bg-gray-800 text-white font-medium" 
            onClick={() => {
              window.open('https://mvp.appstate.co', '_blank');
              onClose();
            }}
          >
            <Check className="mr-2 h-5 w-5" />
            Check it out!!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

