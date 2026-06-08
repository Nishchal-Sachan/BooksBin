import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(
  (
    {
      label,
      error,
      id,
      className,
      wrapperClassName,
      hint,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? props.name

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-small font-semibold text-ink-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-field',
            error && 'input-field-error',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-small text-ink-muted">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-small text-error"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
