import * as React from 'react'
import { cn } from '@/lib/utils'

export function Label({ className, ...props }) {
  return (
    <label
      className={cn('text-sm font-medium leading-none text-gray-700 dark:text-gray-300', className)}
      {...props}
    />
  )
}
