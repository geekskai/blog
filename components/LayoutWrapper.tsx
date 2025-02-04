import { Inter } from 'next/font/google'
import SectionContainer from './SectionContainer'
import { ReactNode } from 'react'
import Header from './Header'
import SiteFooter from './SiteFooter'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
        <Header />
        <main className="mb-auto">{children}</main>
        <SiteFooter />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
