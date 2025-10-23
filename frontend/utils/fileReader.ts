// File reading utilities for different file types

export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      resolve(content)
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  try {
    if (fileType === 'text/plain' || fileType === 'text/markdown' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      return await readTextFile(file)
    } else {
      throw new Error('Only text files (.txt, .md) are currently supported. Please convert your file to text format.')
    }
  } catch (error) {
    console.error('Error extracting text from file:', error)
    throw error
  }
}