import React from 'react'

interface LogoProps {
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

export function Logo({ width = 64, height = 64, className, style }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cuadros de viaje"
      className={className}
      style={style}
    >
      <rect width="64" height="64" rx="15" fill="currentColor" />

      <path
        d="M32 13 C 24.3 13, 18 19.3, 18 27 C 18 37.5, 32 51, 32 51 C 32 51, 46 37.5, 46 27 C 46 19.3, 39.7 13, 32 13 Z"
        fill="#FFFFFF"
      />
      <circle cx="32" cy="26.5" r="9" fill="#82C8C6" />

      <path d="M32 18.5 L 38 26 L 34 26 L 34 40 L 30 40 L 30 26 L 26 26 Z" fill="#123A5C" />
    </svg>
  )
}
