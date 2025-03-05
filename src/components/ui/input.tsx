import * as React from "react"
import { cn } from "@/lib/utils"
import { FaMagnifyingGlass } from "react-icons/fa6"

interface InputProps extends React.ComponentProps<"input"> {
  showIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showIcon = true, ...props }, ref) => {
    // Conditionally set left padding based on whether the icon is shown.
    const paddingClass = showIcon ? "pl-10" : "pl-3"
    
    return (
      <div className="relative flex items-center">
        {showIcon && (
          <FaMagnifyingGlass className="absolute ml-3.5 text-gray-400" />
        )}
        <input
          type={type}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-transparent pr-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-400 placeholder:italic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            paddingClass,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
