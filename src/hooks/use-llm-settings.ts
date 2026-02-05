import { useCallback, useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * LLM Settings Hook
 * 
 * Manages settings for LLM-enhanced features:
 * - Smart session titles
 * - Smart follow-up suggestions
 * - OpenAI API key (stored in localStorage, sent via header)
 */

export type LlmSettings = {
  /** Use LLM for generating session titles */
  useLlmTitles: boolean
  /** Use LLM for generating follow-up suggestions */
  useLlmFollowUps: boolean
  /** User-provided OpenAI API key (stored locally, never sent to server storage) */
  openaiApiKey: string
}

type LlmSettingsState = {
  settings: LlmSettings
  updateSettings: (updates: Partial<LlmSettings>) => void
  clearApiKey: () => void
}

export const useLlmSettingsStore = create<LlmSettingsState>()(
  persist(
    (set) => ({
      settings: {
        useLlmTitles: false,
        useLlmFollowUps: false,
        openaiApiKey: '',
      },
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      clearApiKey: () =>
        set((state) => ({
          settings: { ...state.settings, openaiApiKey: '' },
        })),
    }),
    {
      name: 'llm-settings',
    },
  ),
)

type LlmStatus = {
  hasEnvKey: boolean
  hasUserKey: boolean
  isAvailable: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Hook for accessing and managing LLM settings
 */
export function useLlmSettings() {
  const settings = useLlmSettingsStore((state) => state.settings)
  const updateSettings = useLlmSettingsStore((state) => state.updateSettings)
  const clearApiKey = useLlmSettingsStore((state) => state.clearApiKey)

  const [status, setStatus] = useState<LlmStatus>({
    hasEnvKey: false,
    hasUserKey: Boolean(settings.openaiApiKey),
    isAvailable: Boolean(settings.openaiApiKey),
    isLoading: true,
    error: null,
  })

  // Check if server has environment API key
  useEffect(() => {
    let cancelled = false

    async function checkStatus() {
      try {
        const res = await fetch('/api/llm-features')
        if (!res.ok) throw new Error('Failed to check LLM status')
        
        const data = await res.json() as { ok: boolean; hasEnvKey: boolean }
        
        if (cancelled) return

        const hasUserKey = Boolean(settings.openaiApiKey)
        setStatus({
          hasEnvKey: data.hasEnvKey,
          hasUserKey,
          isAvailable: data.hasEnvKey || hasUserKey,
          isLoading: false,
          error: null,
        })
      } catch (err) {
        if (cancelled) return
        setStatus((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to check status',
        }))
      }
    }

    void checkStatus()

    return () => {
      cancelled = true
    }
  }, [settings.openaiApiKey])

  // Test API key validity
  const testApiKey = useCallback(async (key: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/llm-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-API-Key': key,
        },
        body: JSON.stringify({ action: 'test' }),
      })

      const data = await res.json() as { ok: boolean; valid?: boolean; error?: string }

      if (!data.ok) {
        return { valid: false, error: data.error || 'Test failed' }
      }

      return { valid: data.valid ?? false, error: data.error }
    } catch (err) {
      return { 
        valid: false, 
        error: err instanceof Error ? err.message : 'Network error',
      }
    }
  }, [])

  return {
    settings,
    updateSettings,
    clearApiKey,
    status,
    testApiKey,
  }
}

/**
 * Get the API key header for LLM requests
 * Returns headers object with X-OpenAI-API-Key if user has set a key
 */
export function getLlmHeaders(): Record<string, string> {
  const apiKey = useLlmSettingsStore.getState().settings.openaiApiKey
  if (apiKey) {
    return { 'X-OpenAI-API-Key': apiKey }
  }
  return {}
}

/**
 * Check if LLM titles are enabled and available
 */
export function useLlmTitlesEnabled(): boolean {
  const settings = useLlmSettingsStore((state) => state.settings)
  return settings.useLlmTitles
}

/**
 * Check if LLM follow-ups are enabled
 */
export function useLlmFollowUpsEnabled(): boolean {
  const settings = useLlmSettingsStore((state) => state.settings)
  return settings.useLlmFollowUps
}
