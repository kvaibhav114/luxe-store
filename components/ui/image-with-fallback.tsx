"use client"

import React, { useState } from "react"

type Props = {
  src: string
  alt: string
  className?: string
  width?: number | string
  height?: number | string
  loading?: "eager" | "lazy"
  decoding?: "auto" | "sync" | "async"
  sizes?: string
}

export function ImageWithFallback({ src, alt, className, width, height, loading, decoding, sizes }: Props) {
  const [imgSrc, setImgSrc] = useState<string>(src || "/placeholder.svg")

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={className}
      width={width as any}
      height={height as any}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      onError={() => {
        if (!String(imgSrc).endsWith("/placeholder.svg")) {
          setImgSrc("/placeholder.svg")
        }
      }}
    />
  )
}
