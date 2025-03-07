import type React from "react"
import type { CSSProperties } from "react"

interface PaperBackgroundProps {
  style: string
  children: React.ReactNode
}

export default function PaperBackground({ style, children }: PaperBackgroundProps) {
  const getBackgroundStyle = (): CSSProperties => {
    switch (style) {
      case "default":
        return {
          backgroundColor: "#f8fafc",
          backgroundImage: "none",
        }
      case "college-ruled":
        return {
          backgroundImage: `
          linear-gradient(#94a3b8 1px, transparent 1px),
          linear-gradient(90deg, #94a3b8 1px, transparent 1px)
        `,
          backgroundSize: "100% 31px, 100% 31px",
          backgroundPosition: "0 30px, 30px 0",
          backgroundColor: "#f8fafc",
        }
      case "wide-ruled":
        return {
          backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: "100% 36px",
          backgroundPosition: "0 35px",
          backgroundColor: "#f8fafc",
        }
      case "graph-paper":
        return {
          backgroundImage: `
          linear-gradient(#94a3b8 1px, transparent 1px),
          linear-gradient(90deg, #94a3b8 1px, transparent 1px)
        `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          backgroundColor: "#f8fafc",
        }
      case "dot-grid":
        return {
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          backgroundColor: "#f8fafc",
        }
      case "cornell":
        return {
          backgroundColor: "#f8fafc",
          backgroundImage: `
            linear-gradient(90deg, transparent 60px, #94a3b8 60px, #94a3b8 62px, transparent 62px)
          `,
          backgroundSize: "100% 31px",
          backgroundPosition: "0 0",
          backgroundRepeat: "repeat",
          position: "relative",
        }
      default:
        return {}
    }
  }

  const backgroundStyle = getBackgroundStyle()

  return (
    <div
      className="h-full rounded-xl overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_14px_28px_rgba(0,0,0,0.15)]"
      style={backgroundStyle}
    >
      {style === "cornell" && (
        <>
          {/* Left margin line */}
          <div className="absolute left-[60px] top-0 bottom-0 w-[2px] bg-[#94a3b8]" style={{ pointerEvents: "none" }} />
          {/* Horizontal lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px)",
              backgroundSize: "100% 31px",
              backgroundPosition: "0 0",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <div className="relative z-10 h-full overflow-auto">{children}</div>
    </div>
  )
}

