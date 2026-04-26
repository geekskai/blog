import NextImage, { ImageProps } from "next/image"

const basePath = process.env.BASE_PATH

const normalizeSrc = (src: ImageProps["src"]): ImageProps["src"] => {
  if (typeof src !== "string") {
    return src
  }

  // Only prefix local public asset paths. Remote/data/blob URLs should pass through untouched.
  if (src.startsWith("/") && !src.startsWith("//")) {
    return `${basePath || ""}${src}`
  }

  return src
}

const Image = ({ src, ...rest }: ImageProps) => <NextImage src={normalizeSrc(src)} {...rest} />

export default Image
