"use client"
import { MapPin, Clock, Wallet, Crown } from "lucide-react"

interface DealCategoriesSectionProps {
  onCategorySelect: (category: string) => void
  activeCategory: string
}

export default function DealCategoriesSection({ onCategorySelect, activeCategory }: DealCategoriesSectionProps) {
  const categories = [
    {
      id: "all",
      name: "Alle Deals",
      icon: <MapPin className="h-6 w-6" />,
      description: "Bekijk alle beschikbare vliegdeals",
      color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      activeColor: "bg-gray-700 text-white",
    },
    {
      id: "weekend",
      name: "Weekend Getaways",
      icon: <Clock className="h-6 w-6" />,
      description: "Korte trips perfect voor een weekendje weg",
      color: "bg-green-100 text-green-700 hover:bg-green-200",
      activeColor: "bg-green-600 text-white",
    },
    {
      id: "budget",
      name: "Budget",
      icon: <Wallet className="h-6 w-6" />,
      description: "Goedkope vluchten onder €100",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      activeColor: "bg-blue-600 text-white",
    },
    {
      id: "longhaul",
      name: "Long Haul",
      icon: <MapPin className="h-6 w-6" />,
      description: "Verre bestemmingen voor avontuurlijke reizen",
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      activeColor: "bg-purple-600 text-white",
    },
    {
      id: "luxury",
      name: "Luxury",
      icon: <Crown className="h-6 w-6" />,
      description: "Premium vluchten en eersteklas service",
      color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      activeColor: "bg-yellow-600 text-white",
    },
  ]

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ontdek per Categorie</h2>
          <p className="text-gray-600">Vind de perfecte vlucht voor jouw type reis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                activeCategory === category.id
                  ? `${category.activeColor} border-transparent shadow-lg transform scale-105`
                  : `${category.color} border-gray-200 hover:border-gray-300 hover:shadow-md`
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">{category.icon}</div>
                <h3 className="font-semibold text-sm mb-2">{category.name}</h3>
                <p className="text-xs opacity-80 leading-tight">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
