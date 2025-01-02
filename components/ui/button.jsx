import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 hover:bg-gray-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
})
Button.displayName = 'Button'
