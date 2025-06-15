import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react"

export const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, ...rest }, ref) => {
  return (
    <input
      className={`py-1 px-2 border border-gray-600 focus:border-blue-500 outline-none rounded w-full bg-gray-800 text-white placeholder-gray-400 ${className}`}
      {...rest}
      ref={ref}
    />
  )
})