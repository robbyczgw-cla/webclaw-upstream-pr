'use client'

import { useState } from 'react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ExportFormat } from '../../utils/export-conversation'

type SessionExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionTitle: string
  onExport: (format: ExportFormat) => void
  onCancel: () => void
}

const formatOptions: Array<{
  value: ExportFormat
  label: string
  description: string
}> = [
  {
    value: 'markdown',
    label: 'Markdown (.md)',
    description: 'Nicely formatted with headers and sections',
  },
  {
    value: 'json',
    label: 'JSON (.json)',
    description: 'Full data with metadata',
  },
  {
    value: 'txt',
    label: 'Plain Text (.txt)',
    description: 'Simple text format',
  },
]

export function SessionExportDialog({
  open,
  onOpenChange,
  sessionTitle,
  onExport,
  onCancel,
}: SessionExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown')

  const handleExport = () => {
    onExport(selectedFormat)
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="p-4">
          <DialogTitle className="mb-1">Export Conversation</DialogTitle>
          <DialogDescription className="mb-4">
            Export "{sessionTitle}" in your preferred format
          </DialogDescription>

          <div className="space-y-2 mb-4">
            {formatOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-lg border border-primary-200 cursor-pointer hover:bg-primary-100 transition-colors"
              >
                <input
                  type="radio"
                  name="export-format"
                  value={option.value}
                  checked={selectedFormat === option.value}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as ExportFormat)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-primary-900">
                    {option.label}
                  </div>
                  <div className="text-xs text-primary-600">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose onClick={onCancel}>Cancel</DialogClose>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
