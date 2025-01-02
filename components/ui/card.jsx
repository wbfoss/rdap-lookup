import React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-4 border-b border-gray-200', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-4', className)} {...props} />
}
