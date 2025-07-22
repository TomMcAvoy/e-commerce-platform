import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// Direct imports for numbered pages (server-side)
import MalePage0 from '../male/page0'
import HardwarePage1 from '../hardware/page1'
import SportsPage2 from '../sports/page2'
import FemalePage3 from '../female/page3'

interface PageProps {
  params: Promise<{
    category: string
  }>
}

const categoryComponents = {
  'male': MalePage0,
  'men': MalePage0,
  'hardware': HardwarePage1,
  'sports': SportsPage2,
  'female': FemalePage3,
  'women': FemalePage3
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const Component = categoryComponents[category as keyof typeof categoryComponents]
  
  if (!Component) {
    notFound()
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>}>
      <Component />
    </Suspense>
  )
}
