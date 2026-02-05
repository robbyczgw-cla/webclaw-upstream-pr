import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import {
  generateSessionTitle,
  generateFollowUps,
  testApiKey,
} from '../../lib/llm-client'

/**
 * API Routes: /api/llm-features
 * 
 * Endpoints for LLM-enhanced features using OpenAI API.
 * Supports both user-provided API key (from request header) and
 * server environment variable OPENAI_API_KEY.
 */

type TitleRequest = {
  message: string
}

type FollowUpsRequest = {
  conversationContext: string
}

type StatusResponse = {
  ok: boolean
  hasEnvKey: boolean
  error?: string
}

type TitleResponse = {
  ok: boolean
  title?: string
  source?: 'llm' | 'heuristic'
  error?: string
}

type FollowUpsResponse = {
  ok: boolean
  suggestions?: string[]
  source?: 'llm' | 'heuristic'
  error?: string
}

type TestKeyResponse = {
  ok: boolean
  valid?: boolean
  error?: string
}

/**
 * Get API key from request header or environment
 * Priority: Header (user-provided) > Environment variable
 */
function getApiKey(request: Request): string | null {
  // Check for user-provided key in header
  const headerKey = request.headers.get('X-OpenAI-API-Key')
  if (headerKey?.trim()) {
    return headerKey.trim()
  }

  // Fall back to environment variable
  const envKey = process.env.OPENAI_API_KEY?.trim()
  if (envKey) {
    return envKey
  }

  return null
}

/**
 * Generate heuristic title from first message
 * Extracts first 5-6 meaningful words
 */
function generateHeuristicTitle(message: string): string {
  // Remove code blocks
  let text = message.replace(/```[\s\S]*?```/g, ' ')
  // Remove inline code
  text = text.replace(/`[^`]+`/g, ' ')
  // Remove URLs
  text = text.replace(/https?:\/\/[^\s]+/g, ' ')
  // Remove special characters but keep basic punctuation
  text = text.replace(/[^\w\s.,!?'-]/g, ' ')
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim()

  // Split into words and take first meaningful ones
  const words = text.split(/\s+/).filter((word) => {
    // Filter out very short words unless they're important
    if (word.length <= 2 && !['AI', 'ML', 'UI', 'UX', 'API', 'CSS', 'JS'].includes(word.toUpperCase())) {
      return false
    }
    return true
  })

  // Take first 5-6 words
  const titleWords = words.slice(0, 6)
  
  // Join and clean up
  let title = titleWords.join(' ')
  
  // Remove trailing punctuation except for meaningful ones
  title = title.replace(/[.,!?]+$/, '')
  
  // Truncate if too long
  if (title.length > 60) {
    title = title.slice(0, 57) + '...'
  }

  return title || message.slice(0, 50)
}

export const Route = createFileRoute('/api/llm-features')({
  server: {
    handlers: {
      /**
       * GET /api/llm-features - Check LLM features status
       */
      GET: async () => {
        try {
          const hasEnvKey = Boolean(process.env.OPENAI_API_KEY?.trim())
          
          return json<StatusResponse>({
            ok: true,
            hasEnvKey,
          })
        } catch (err) {
          return json<StatusResponse>({
            ok: false,
            hasEnvKey: false,
            error: err instanceof Error ? err.message : String(err),
          })
        }
      },

      /**
       * POST /api/llm-features - Handle LLM feature requests
       * 
       * Request body should include an "action" field:
       * - action: "title" - Generate session title
       * - action: "followups" - Generate follow-up suggestions
       * - action: "test" - Test API key validity
       */
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({})) as Record<string, unknown>
          const action = body.action as string

          switch (action) {
            case 'title': {
              const { message } = body as TitleRequest & { action: string }
              
              if (!message || typeof message !== 'string' || message.trim().length < 3) {
                return json<TitleResponse>({
                  ok: false,
                  error: 'Message is required and must be at least 3 characters',
                })
              }

              const apiKey = getApiKey(request)
              
              // If no API key, use heuristic
              if (!apiKey) {
                const title = generateHeuristicTitle(message)
                return json<TitleResponse>({
                  ok: true,
                  title,
                  source: 'heuristic',
                })
              }

              try {
                const title = await generateSessionTitle(message, { apiKey })
                return json<TitleResponse>({
                  ok: true,
                  title,
                  source: 'llm',
                })
              } catch (err) {
                // Fall back to heuristic on error
                console.error('[llm-features] Title generation error:', err)
                const title = generateHeuristicTitle(message)
                return json<TitleResponse>({
                  ok: true,
                  title,
                  source: 'heuristic',
                  error: err instanceof Error ? err.message : 'LLM error, used heuristic',
                })
              }
            }

            case 'followups': {
              const { conversationContext } = body as FollowUpsRequest & { action: string }
              
              if (!conversationContext || typeof conversationContext !== 'string' || conversationContext.trim().length < 10) {
                return json<FollowUpsResponse>({
                  ok: true,
                  suggestions: [],
                  source: 'heuristic',
                })
              }

              const apiKey = getApiKey(request)
              
              // If no API key, return empty (caller will use heuristic)
              if (!apiKey) {
                return json<FollowUpsResponse>({
                  ok: true,
                  suggestions: [],
                  source: 'heuristic',
                })
              }

              try {
                const suggestions = await generateFollowUps(conversationContext, { apiKey })
                return json<FollowUpsResponse>({
                  ok: true,
                  suggestions,
                  source: 'llm',
                })
              } catch (err) {
                console.error('[llm-features] Follow-ups generation error:', err)
                return json<FollowUpsResponse>({
                  ok: true,
                  suggestions: [],
                  source: 'heuristic',
                  error: err instanceof Error ? err.message : 'LLM error',
                })
              }
            }

            case 'test': {
              const headerKey = request.headers.get('X-OpenAI-API-Key')?.trim()
              
              if (!headerKey) {
                return json<TestKeyResponse>({
                  ok: false,
                  error: 'API key required in X-OpenAI-API-Key header',
                })
              }

              try {
                const valid = await testApiKey(headerKey)
                return json<TestKeyResponse>({
                  ok: true,
                  valid,
                })
              } catch (err) {
                return json<TestKeyResponse>({
                  ok: true,
                  valid: false,
                  error: err instanceof Error ? err.message : 'Test failed',
                })
              }
            }

            default:
              return json({
                ok: false,
                error: `Unknown action: ${action}. Valid actions: title, followups, test`,
              }, { status: 400 })
          }
        } catch (err) {
          console.error('[llm-features] Error:', err)
          return json({
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          }, { status: 500 })
        }
      },
    },
  },
})
