import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import { gatewayRpc } from '../../server/gateway'
import personasData from '../../data/personas.json'

/**
 * API Route: /api/personas
 *
 * Returns persona data for the Persona Picker UI.
 * Detects whether the "personas" skill is actually installed
 * by checking for the skill.json file in the workspace.
 */

type GatewayConfigResponse = {
  config?: {
    agents?: {
      defaults?: {
        workspace?: string
      }
    }
  }
}

export const Route = createFileRoute('/api/personas')({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Get workspace path from gateway config
          const res = await gatewayRpc<GatewayConfigResponse>('config.get', {})
          const workspace =
            res.config?.agents?.defaults?.workspace || '/root/clawd'

          // Check if the personas skill is installed
          const skillJson = await readFile(
            `${workspace}/skills/personas/skill.json`,
            'utf-8',
          )
          const skill = JSON.parse(skillJson) as { version?: string }

          // Skill exists — return bundled persona data
          return json({
            ok: true,
            personas: personasData.categories,
            available: true,
            skillVersion: skill.version,
          })
        } catch {
          // Skill not installed or gateway unavailable
          return json({
            ok: true,
            personas: {},
            available: false,
          })
        }
      },
    },
  },
})
