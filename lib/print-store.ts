import { create } from "zustand"

export type PrintSection = {
  id: string
  file: File | null
  fileName: string
  fileSize: number
  pageCount: number
  printType: "bw" | "color"
  copies: number
  isDuplex: boolean
  pagesPerSheet: 1 | 2 | 4
}

type PrintStore = {
  sections: PrintSection[]
  addSection: () => void
  removeSection: (id: string) => void
  updateSection: (id: string, updates: Partial<PrintSection>) => void
  calculateSubtotal: (sectionId: string, bwRate: number, colorRate: number) => number
  calculateGrandTotal: (bwRate: number, colorRate: number) => number
  reset: () => void
}

const createDefaultSection = (): PrintSection => ({
  id: Math.random().toString(36).substring(2, 11),
  file: null,
  fileName: "",
  fileSize: 0,
  pageCount: 1,
  printType: "bw",
  copies: 1,
  isDuplex: false,
  pagesPerSheet: 1,
})

export const usePrintStore = create<PrintStore>((set, get) => ({
  sections: [createDefaultSection()],
  
  addSection: () =>
    set((state) => ({
      sections: [...state.sections, createDefaultSection()],
    })),
  
  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
    })),
  
  updateSection: (id, updates) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  
  calculateSubtotal: (sectionId, bwRate, colorRate) => {
    const section = get().sections.find((s) => s.id === sectionId)
    if (!section || !section.file) return 0
    
    const rate = section.printType === "bw" ? bwRate : colorRate
    return section.pageCount * section.copies * rate
  },
  
  calculateGrandTotal: (bwRate, colorRate) => {
    return get().sections.reduce((total, section) => {
      if (!section.file) return total
      const rate = section.printType === "bw" ? bwRate : colorRate
      return total + (section.pageCount * section.copies * rate)
    }, 0)
  },
  
  reset: () => set({ sections: [createDefaultSection()] }),
}))
