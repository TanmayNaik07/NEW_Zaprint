"use client"

import { usePrintStore } from "@/lib/print-store"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Palette, FileText, Layers, Copy } from "lucide-react"

export function PrintSpecifications() {
  const { specs, setSpecs } = usePrintStore()

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
      <h2 className="text-foreground text-lg font-semibold mb-6">Print Specifications</h2>

      <div className="space-y-6">
        {/* Color Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <Label className="text-foreground text-sm font-medium">Color Mode</Label>
          </div>
          <RadioGroup
            value={specs.colorMode}
            onValueChange={(value) => setSpecs({ colorMode: value as "color" | "bw" })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bw" id="bw" className="border-white/20 text-primary" />
              <Label
                htmlFor="bw"
                className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
              >
                Black & White
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="color" id="color" className="border-white/20 text-primary" />
              <Label
                htmlFor="color"
                className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
              >
                Color
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Paper Size */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <Label className="text-foreground text-sm font-medium">Paper Size</Label>
          </div>
          <Select value={specs.paperSize} onValueChange={(value) => setSpecs({ paperSize: value as "a4" | "a3" })}>
            <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10">
              <SelectItem value="a4" className="text-foreground focus:bg-primary/20 focus:text-foreground">
                A4 (210 × 297 mm)
              </SelectItem>
              <SelectItem value="a3" className="text-foreground focus:bg-primary/20 focus:text-foreground">
                A3 (297 × 420 mm)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Print Sides */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <Label className="text-foreground text-sm font-medium">Print Sides</Label>
          </div>
          <RadioGroup
            value={specs.printSides}
            onValueChange={(value) => setSpecs({ printSides: value as "single" | "double" })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" className="border-white/20 text-primary" />
              <Label
                htmlFor="single"
                className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
              >
                Single-sided
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="double" id="double" className="border-white/20 text-primary" />
              <Label
                htmlFor="double"
                className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
              >
                Double-sided
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Number of Copies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Copy className="w-4 h-4 text-muted-foreground" />
            <Label className="text-foreground text-sm font-medium">Number of Copies</Label>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSpecs({ copies: Math.max(1, specs.copies - 1) })}
              className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-colors"
            >
              -
            </button>
            <Input
              type="number"
              min={1}
              max={100}
              value={specs.copies}
              onChange={(e) => setSpecs({ copies: Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)) })}
              className="w-20 h-10 text-center bg-white/5 border-white/10 text-foreground"
            />
            <button
              onClick={() => setSpecs({ copies: Math.min(100, specs.copies + 1) })}
              className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
