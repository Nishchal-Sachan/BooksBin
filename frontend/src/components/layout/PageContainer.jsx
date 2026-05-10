import { cn } from '../../utils/cn'

export default function PageContainer({ children, className }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-app px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  )
}
