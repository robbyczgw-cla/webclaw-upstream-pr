/**
 * Smart Follow-up Generator
 *
 * Generates contextual follow-up suggestions based on AI response content.
 * Uses client-side heuristics for fast, no-latency suggestions.
 *
 * Future: Could be extended to call the gateway for AI-powered suggestions.
 */

type FollowUpSuggestion = {
  text: string
  type: 'clarify' | 'expand' | 'example' | 'alternative' | 'actionable'
}

// Code-related patterns
const CODE_PATTERNS = [
  /```[\s\S]*?```/g,
  /`[^`]+`/g,
  /\b(function|const|let|var|class|import|export|return|async|await)\b/g,
]

// Extract key topics from text
function extractTopics(text: string): string[] {
  const topics: string[] = []

  // Extract quoted terms
  const quoted = text.match(/"([^"]+)"|'([^']+)'/g)
  if (quoted) {
    topics.push(...quoted.map((q) => q.replace(/['"]/g, '')))
  }

  // Extract capitalized terms (likely proper nouns/names)
  const capitalized = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)
  if (capitalized) {
    topics.push(
      ...capitalized.filter((t) => !['I', 'The', 'A', 'An', 'This'].includes(t)),
    )
  }

  // Extract technical terms in backticks
  const backticked = text.match(/`([^`]+)`/g)
  if (backticked) {
    topics.push(...backticked.map((t) => t.replace(/`/g, '')))
  }

  return [...new Set(topics)].slice(0, 5)
}

// Detect if response contains code
function hasCode(text: string): boolean {
  return CODE_PATTERNS.some((pattern) => pattern.test(text))
}

// Detect if response is a list or has steps
function hasList(text: string): boolean {
  return /^[\s]*[-*•\d]+[.)\s]/m.test(text) || /\b(first|second|third|1\.|2\.|3\.)/i.test(text)
}

// Detect if response mentions alternatives or options
function hasAlternatives(text: string): boolean {
  return /\b(alternatively|another|other option|could also|you might|consider)\b/i.test(text)
}

// Detect if response is explanatory
function isExplanatory(text: string): boolean {
  return /\b(because|since|due to|reason|why|how|what|when|where)\b/i.test(text)
}

// Detect if response has warnings or caveats
function hasCaveats(text: string): boolean {
  return /\b(however|but|note|warning|caution|careful|important|keep in mind|be aware)\b/i.test(text)
}

// Generate follow-up suggestions based on response content
export function generateFollowUps(
  responseText: string,
  _conversationContext?: string[],
): FollowUpSuggestion[] {
  const suggestions: FollowUpSuggestion[] = []
  const topics = extractTopics(responseText)

  // Strategy 1: If there's code, offer to explain or modify it
  if (hasCode(responseText)) {
    suggestions.push({
      text: 'Can you explain this code step by step?',
      type: 'clarify',
    })
    suggestions.push({
      text: 'How would I modify this for my use case?',
      type: 'actionable',
    })
  }

  // Strategy 2: If there's a list/steps, offer to dive deeper
  if (hasList(responseText)) {
    suggestions.push({
      text: 'Can you elaborate on the first point?',
      type: 'expand',
    })
    suggestions.push({
      text: 'Which of these is most important to start with?',
      type: 'actionable',
    })
  }

  // Strategy 3: If alternatives mentioned, ask for comparison
  if (hasAlternatives(responseText)) {
    suggestions.push({
      text: 'What are the pros and cons of each approach?',
      type: 'alternative',
    })
    suggestions.push({
      text: 'Which option would you recommend and why?',
      type: 'clarify',
    })
  }

  // Strategy 4: If explanatory, ask for examples
  if (isExplanatory(responseText) && suggestions.length < 3) {
    suggestions.push({
      text: 'Can you give me a practical example?',
      type: 'example',
    })
  }

  // Strategy 5: If there are caveats, explore them
  if (hasCaveats(responseText) && suggestions.length < 3) {
    suggestions.push({
      text: 'What potential issues should I watch out for?',
      type: 'clarify',
    })
  }

  // Strategy 6: Use extracted topics for specific follow-ups
  if (topics.length > 0 && suggestions.length < 3) {
    const topic = topics[0]
    suggestions.push({
      text: `Tell me more about ${topic}`,
      type: 'expand',
    })
  }

  // Strategy 7: Generic but useful follow-ups as fallbacks
  const fallbacks: FollowUpSuggestion[] = [
    { text: 'Can you give me a concrete example?', type: 'example' },
    { text: 'What would be the next steps?', type: 'actionable' },
    { text: 'How does this work in practice?', type: 'expand' },
    { text: 'Are there any common mistakes to avoid?', type: 'clarify' },
    { text: 'Can you simplify this explanation?', type: 'clarify' },
  ]

  // Fill remaining slots with diverse fallbacks
  const usedTypes = new Set(suggestions.map((s) => s.type))
  for (const fallback of fallbacks) {
    if (suggestions.length >= 3) break
    if (!usedTypes.has(fallback.type)) {
      suggestions.push(fallback)
      usedTypes.add(fallback.type)
    }
  }

  // If still not enough, just add any remaining fallbacks
  for (const fallback of fallbacks) {
    if (suggestions.length >= 3) break
    if (!suggestions.some((s) => s.text === fallback.text)) {
      suggestions.push(fallback)
    }
  }

  // Return exactly 3 suggestions
  return suggestions.slice(0, 3)
}

// Get just the text of suggestions (for simpler usage)
export function getFollowUpTexts(responseText: string): string[] {
  return generateFollowUps(responseText).map((s) => s.text)
}
