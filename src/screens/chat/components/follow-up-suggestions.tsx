import { memo, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { getFollowUpTexts } from '../lib/follow-up-generator'
import { cn } from '@/lib/utils'

type FollowUpSuggestionsProps = {
  /** The assistant's response text to generate follow-ups from */
  responseText: string
  /** Callback when a suggestion is clicked */
  onSuggestionClick: (suggestion: string) => void
  /** Whether suggestions are disabled (e.g., while waiting for response) */
  disabled?: boolean
  /** Additional class name for the container */
  className?: string
}

function FollowUpSuggestionsComponent({
  responseText,
  onSuggestionClick,
  disabled = false,
  className,
}: FollowUpSuggestionsProps) {
  // Generate suggestions based on the response
  const suggestions = useMemo(() => {
    if (!responseText || responseText.trim().length < 50) {
      return []
    }
    return getFollowUpTexts(responseText)
  }, [responseText])

  // Don't render if no suggestions or response is too short
  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-2 mt-3', className)}>
      <div className="flex items-center gap-1.5 text-xs text-primary-500">
        <span className="text-primary-400">✨</span>
        <span>Follow-up suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onSuggestionClick(suggestion)}
            className={cn(
              'group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-sm text-primary-700 bg-primary-50 border border-primary-200',
              'hover:bg-primary-100 hover:border-primary-300 hover:text-primary-900',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-1',
              'transition-all duration-150 cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-50 disabled:hover:border-primary-200',
            )}
          >
            <span>{suggestion}</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              strokeWidth={2}
              className="text-primary-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all duration-150"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const MemoizedFollowUpSuggestions = memo(FollowUpSuggestionsComponent)

export { MemoizedFollowUpSuggestions as FollowUpSuggestions }
