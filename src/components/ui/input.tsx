import * as React from "react"
import { cn } from "@/lib/utils"
import { FaMagnifyingGlass } from "react-icons/fa6"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <FaMagnifyingGlass className="absolute ml-3.5 text-gray-400" />
        <input
          type={type}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-400 placeholder:italic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
