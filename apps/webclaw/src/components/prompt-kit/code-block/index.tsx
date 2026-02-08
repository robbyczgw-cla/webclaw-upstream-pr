import { useEffect, useMemo, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type { HighlighterCore } from 'shiki/core'
import vitesseDark from 'shiki/themes/vitesse-dark'
import vitesseLight from 'shiki/themes/vitesse-light'
import langBash from 'shiki/langs/bash'
import langC from 'shiki/langs/c'
import langCpp from 'shiki/langs/cpp'
import langCsharp from 'shiki/langs/csharp'
import langCss from 'shiki/langs/css'
import langDiff from 'shiki/langs/diff'
import langDockerfile from 'shiki/langs/dockerfile'
import langGo from 'shiki/langs/go'
import langGraphql from 'shiki/langs/graphql'
import langHtml from 'shiki/langs/html'
import langJava from 'shiki/langs/java'
import langJavascript from 'shiki/langs/javascript'
import langJson from 'shiki/langs/json'
import langJsx from 'shiki/langs/jsx'
import langKotlin from 'shiki/langs/kotlin'
import langMarkdown from 'shiki/langs/markdown'
import langPhp from 'shiki/langs/php'
import langPython from 'shiki/langs/python'
import langRegexp from 'shiki/langs/regexp'
import langRuby from 'shiki/langs/ruby'
import langRust from 'shiki/langs/rust'
import langShell from 'shiki/langs/shell'
import langSql from 'shiki/langs/sql'
import langSwift from 'shiki/langs/swift'
import langToml from 'shiki/langs/toml'
import langTypescript from 'shiki/langs/typescript'
import langTsx from 'shiki/langs/tsx'
import langXml from 'shiki/langs/xml'
import langYaml from 'shiki/langs/yaml'
import { useResolvedTheme } from '@/hooks/use-chat-settings'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { formatLanguageName, normalizeLanguage, resolveLanguage } from './utils'

type CodeBlockProps = {
  content: string
  ariaLabel?: string
  language?: string
  className?: string
}

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [vitesseLight, vitesseDark],
      langs: [
        langJavascript,
        langTypescript,
        langTsx,
        langJsx,
        langPython,
        langBash,
        langShell,
        langJson,
        langYaml,
        langToml,
        langMarkdown,
        langHtml,
        langCss,
        langSql,
        langRust,
        langGo,
        langJava,
        langKotlin,
        langSwift,
        langRuby,
        langPhp,
        langC,
        langCpp,
        langCsharp,
        langDockerfile,
        langDiff,
        langGraphql,
        langRegexp,
        langXml,
      ],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}

export function CodeBlock({
  content,
  ariaLabel,
  language = 'text',
  className,
}: CodeBlockProps) {
  const resolvedTheme = useResolvedTheme()
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState<string | null>(null)
  const [resolvedLanguage, setResolvedLanguage] = useState('text')
  const [headerBg, setHeaderBg] = useState<string | undefined>()

  const fallback = useMemo(() => {
    return content
  }, [content])

  const normalizedLanguage = normalizeLanguage(language || 'text')
  const themeName = resolvedTheme === 'dark' ? 'vitesse-dark' : 'vitesse-light'

  useEffect(() => {
    let active = true
    getHighlighter()
      .then((highlighter) => {
        const lang = resolveLanguage(normalizedLanguage)
        const highlighted = highlighter.codeToHtml(content, {
          lang,
          theme: themeName,
        })
        if (active) {
          setResolvedLanguage(lang)
          setHtml(highlighted)
          const theme = highlighter.getTheme(themeName)
          setHeaderBg(theme.bg)
        }
      })
      .catch(() => {
        if (active) setHtml(null)
      })
    return () => {
      active = false
    }
  }, [content, normalizedLanguage, themeName])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const isSingleLine = content.split('\n').length === 1
  const displayLanguage = formatLanguageName(resolvedLanguage)

  return (
    <div
      className={cn(
        'group relative min-w-0 overflow-hidden rounded-lg border border-primary-200',
        className,
      )}
    >
      <div
        className={cn('flex items-center justify-between px-3 pt-2')}
        style={{ backgroundColor: headerBg }}
      >
        <span className="text-xs font-medium text-primary-500">
          {displayLanguage}
        </span>
        <Button
          variant="ghost"
          aria-label={ariaLabel ?? 'Copy code'}
          className="h-auto px-0 text-xs font-medium text-primary-500 hover:text-primary-800 hover:bg-transparent"
          onClick={() => {
            handleCopy().catch(() => {})
          }}
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={14}
            strokeWidth={1.8}
          />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {html ? (
        <div
          className={cn(
            'text-sm text-primary-900 [&>pre]:overflow-x-auto',
            isSingleLine
              ? '[&>pre]:whitespace-pre [&>pre]:px-3 [&>pre]:py-2'
              : '[&>pre]:px-3 [&>pre]:py-3',
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre
          className={cn(
            'text-sm',
            isSingleLine ? 'whitespace-pre px-3 py-2' : 'px-3 py-3',
          )}
        >
          <code className="overflow-x-auto">{fallback}</code>
        </pre>
      )}
    </div>
  )
}
