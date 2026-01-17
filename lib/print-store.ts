import { create } from "zustand"

type PrintFile = {
  name: string
  size: number
  pages: number
} | null

type PrintSpecs = {
  colorMode: "color" | "bw"
  paperSize: "a4" | "a3"
  printSides: "single" | "double"
  copies: number
}

type PrintStore = {
  file: PrintFile
  specs: PrintSpecs
  setFile: (file: PrintFile) => void
  setSpecs: (specs: Partial<PrintSpecs>) => void
  reset: () => void
}

const defaultSpecs: PrintSpecs = {
  colorMode: "bw",
  paperSize: "a4",
  printSides: "single",
  copies: 1,
}

export const usePrintStore = create<PrintStore>((set) => ({
  file: null,
  specs: defaultSpecs,
  setFile: (file) => set({ file }),
  setSpecs: (newSpecs) => set((state) => ({ specs: { ...state.specs, ...newSpecs } })),
  reset: () => set({ file: null, specs: defaultSpecs }),
}))
