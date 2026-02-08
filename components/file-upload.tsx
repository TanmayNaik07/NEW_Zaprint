
"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({ onFileSelect, accept = ".pdf,.doc,.docx,.jpg,.png", maxSizeMB = 10 }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File) => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return false
    }
    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        onFileSelect(droppedFile)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
        onFileSelect(selectedFile)
      }
    }
  }

  const removeFile = () => {
    setFile(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center flex flex-col items-center justify-center gap-4 group cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50 hover:bg-white/5",
          file ? "border-green-500/50 bg-green-500/5" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        {file ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                }}
            >
                <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, JPG, PNG (Max {maxSizeMB}MB)</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
