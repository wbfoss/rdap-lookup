import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'
