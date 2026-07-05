import { CategoriesSection } from '@/components/landing/CategoriesSection'

export const metadata = {
  title: 'Categories | NeoVerse Store',
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Browse by <span className="gradient-text">Category</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Discover products across all our categories
          </p>
        </div>
      </div>
      <CategoriesSection />
    </div>
  )
}
