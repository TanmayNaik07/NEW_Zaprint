"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePrintStore } from "@/lib/print-store"

const supportedFormats = ["PDF", "DOCX", "PPT", "PPTX"]

export function PrintUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const { file, setFile } = usePrintStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        setFile({
          name: droppedFile.name,
          size: droppedFile.size,
          pages: Math.floor(Math.random() * 20) + 1, // Mock page count
        })
      }
    },
    [setFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        setFile({
          name: selectedFile.name,
          size: selectedFile.size,
          pages: Math.floor(Math.random() * 20) + 1, // Mock page count
        })
      }
    },
    [setFile],
  )

  const removeFile = useCallback(() => {
    setFile(null)
  }, [setFile])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
      <h2 className="text-foreground text-lg font-semibold mb-4">Upload Document</h2>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              isDragging ? "border-primary bg-primary/5" : "border-white/20 hover:border-white/30"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.docx,.ppt,.pptx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                  isDragging ? "bg-primary/20" : "bg-white/5"
                }`}
              >
                <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">Drag & drop your file here</p>
                <p className="text-muted-foreground text-sm">or click to browse</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {supportedFormats.map((format) => (
                  <span key={format} className="px-2 py-1 rounded-md bg-white/5 text-muted-foreground text-xs">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium truncate">{file.name}</p>
              <p className="text-muted-foreground text-sm">
                {formatFileSize(file.size)} • {file.pages} pages
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <button
                onClick={removeFile}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
