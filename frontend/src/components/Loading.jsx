import React from 'react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen select-none touch-none">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-white opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
      </div>
      <span className="mt-4 text-white font-medium tracking-wide animate-pulse">Loading...</span>
    </div>
  )
}
