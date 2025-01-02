'use client';

import * as React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { cn } from '@/lib/utils'

export const Select = RadixSelect.Root

export function SelectTrigger({ className, children, ...props }) {
  return (
    <RadixSelect.Trigger
      className={cn(
        'inline-flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      {...props}
    >
      {children}
    </RadixSelect.Trigger>
  )
}

export const SelectValue = RadixSelect.Value

export function SelectContent({ className, children, ...props }) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={cn(
          'border border-gray-200 bg-white rounded shadow-md',
          className
        )}
        {...props}
      >
        <RadixSelect.Viewport className="p-1">
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
}

export function SelectItem({ className, children, ...props }) {
  return (
    <RadixSelect.Item
      className={cn(
        'cursor-pointer select-none p-2 text-sm text-gray-700 hover:bg-gray-100 outline-none focus:bg-gray-100 rounded',
        className
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
}
