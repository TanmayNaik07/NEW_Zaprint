/**
 * Count the number of pages in a PDF file
 * @param file - The PDF file to count pages from
 * @returns Promise<number> - The number of pages in the PDF
 */
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const text = new TextDecoder().decode(arrayBuffer)
    
    // Method 1: Look for /Type /Page entries
    const pageMatches = text.match(/\/Type\s*\/Page[^s]/g)
    if (pageMatches) {
      return pageMatches.length
    }
    
    // Method 2: Look for /Count entry in Pages object
    const countMatch = text.match(/\/Count\s+(\d+)/)
    if (countMatch && countMatch[1]) {
      return parseInt(countMatch[1], 10)
    }
    
    // Method 3: Look for /N entry (number of pages)
    const nMatch = text.match(/\/N\s+(\d+)/)
    if (nMatch && nMatch[1]) {
      return parseInt(nMatch[1], 10)
    }
    
    // Fallback: return 1
    return 1
  } catch (error) {
    console.error('Error counting PDF pages:', error)
    return 1
  }
}

/**
 * Helper to determine if a file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}
