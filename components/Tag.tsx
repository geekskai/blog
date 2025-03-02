import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}/`}
      className="mr-3 text-sm font-medium uppercase text-primary-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
