import type { GatewayMessage } from '../types'

export type ExportFormat = 'markdown' | 'json' | 'txt'

/**
 * Extract text content from a message
 */
function extractMessageText(message: GatewayMessage): string {
  if (!message.content || !Array.isArray(message.content)) {
    return ''
  }

  return message.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text || '')
    .join('\n')
}

/**
 * Format conversation as Markdown
 */
function formatAsMarkdown(
  title: string,
  messages: Array<GatewayMessage>,
  date: Date,
): string {
  const lines: string[] = []

  // Header
  lines.push(`# Conversation: ${title}`)
  lines.push(`Date: ${date.toLocaleString()}`)
  lines.push('')

  // Messages
  for (const message of messages) {
    const role = message.role || 'unknown'
    const text = extractMessageText(message)

    if (text) {
      const displayRole = role === 'user' ? 'User' : 'Assistant'
      lines.push(`## ${displayRole}`)
      lines.push('')
      lines.push(text)
      lines.push('')
    }
  }

  return lines.join('\n')
}

/**
 * Format conversation as JSON
 */
function formatAsJson(
  title: string,
  messages: Array<GatewayMessage>,
  date: Date,
): string {
  const data = {
    title,
    exportDate: date.toISOString(),
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
    })),
  }

  return JSON.stringify(data, null, 2)
}

/**
 * Format conversation as plain text
 */
function formatAsPlainText(
  title: string,
  messages: Array<GatewayMessage>,
  date: Date,
): string {
  const lines: string[] = []

  // Header
  lines.push(`Conversation: ${title}`)
  lines.push(`Date: ${date.toLocaleString()}`)
  lines.push('─'.repeat(60))
  lines.push('')

  // Messages
  for (const message of messages) {
    const role = message.role || 'unknown'
    const text = extractMessageText(message)

    if (text) {
      const displayRole = role === 'user' ? 'User' : 'Assistant'
      lines.push(`${displayRole}:`)
      lines.push(text)
      lines.push('')
    }
  }

  return lines.join('\n')
}

/**
 * Export conversation in the specified format
 */
export function exportConversation(
  title: string,
  messages: Array<GatewayMessage>,
  format: ExportFormat,
): void {
  const date = new Date()
  let content: string
  let filename: string
  let mimeType: string

  // Generate content based on format
  switch (format) {
    case 'markdown':
      content = formatAsMarkdown(title, messages, date)
      filename = `${sanitizeFilename(title)}.md`
      mimeType = 'text/markdown'
      break
    case 'json':
      content = formatAsJson(title, messages, date)
      filename = `${sanitizeFilename(title)}.json`
      mimeType = 'application/json'
      break
    case 'txt':
      content = formatAsPlainText(title, messages, date)
      filename = `${sanitizeFilename(title)}.txt`
      mimeType = 'text/plain'
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }

  // Trigger download
  downloadFile(content, filename, mimeType)
}

/**
 * Sanitize filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9-_\s]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50) || 'conversation'
}

/**
 * Trigger browser download of a text file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
