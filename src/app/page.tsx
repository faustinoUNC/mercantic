import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { Hero } from '@/frontend/components/features/home/Hero'
import { ProductShowcase } from '@/frontend/components/features/home/ProductShowcase'
import { NewLaunches } from '@/frontend/components/features/home/NewLaunches'
import { Features } from '@/frontend/components/features/home/Features'
import { HowItWorks } from '@/frontend/components/features/home/HowItWorks'
import { CTA } from '@/frontend/components/features/home/CTA'

export default function HomePage() {
  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <ProductShowcase />
        <NewLaunches />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
