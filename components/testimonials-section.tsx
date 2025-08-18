import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah van der Berg",
    location: "Amsterdam",
    rating: 5,
    text: "Ongelooflijk! Ik heb €320 bespaard op mijn reis naar Tokyo. De deals zijn echt authentiek en de boekingsprocedure was super eenvoudig.",
    avatar: "/professional-woman-smiling.png",
    trip: "Amsterdam → Tokyo",
  },
  {
    id: 2,
    name: "Mark Janssen",
    location: "Rotterdam",
    rating: 5,
    text: "Al 3 keer geboekt via SpotMijnVlucht. Elke keer weer fantastische deals gevonden. Mijn familie en ik hebben al duizenden euro's bespaard!",
    avatar: "/casual-smiling-man.png",
    trip: "Rotterdam → Barcelona",
  },
  {
    id: 3,
    name: "Lisa Vermeulen",
    location: "Utrecht",
    rating: 5,
    text: "De countdown timers creëren wel urgentie, maar de deals zijn echt waar. Vorige maand nog naar Rome gevlogen voor maar €78!",
    avatar: "/happy-young-woman.png",
    trip: "Utrecht → Rome",
  },
  {
    id: 4,
    name: "Peter de Vries",
    location: "Den Haag",
    rating: 5,
    text: "Eerst sceptisch, maar na mijn eerste boeking ben ik overtuigd. Uitstekende klantenservice en altijd de beste prijzen.",
    avatar: "/middle-aged-professional-man.png",
    trip: "Den Haag → Londen",
  },
  {
    id: 5,
    name: "Emma Bakker",
    location: "Eindhoven",
    rating: 5,
    text: "Perfect voor spontane reizen! Ik check elke week de nieuwe deals en heb al 5 geweldige trips geboekt dit jaar.",
    avatar: "/woman-travel-enthusiast.png",
    trip: "Eindhoven → Praag",
  },
  {
    id: 6,
    name: "Tom Hendriks",
    location: "Groningen",
    rating: 5,
    text: "De app is gebruiksvriendelijk en de deals zijn legit. Mijn vrienden vragen nu altijd waar ik mijn goedkope vluchten vandaan haal!",
    avatar: "/young-man-student.png",
    trip: "Groningen → Istanbul",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wat Onze Klanten Zeggen</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meer dan 50.000 tevreden reizigers hebben al bespaard met SpotMijnVlucht.nl
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-gray-50 border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <Quote className="h-6 w-6 text-blue-200 flex-shrink-0" />
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.text}"</p>

                <div className="text-sm text-blue-600 font-medium">{testimonial.trip}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-green-50 px-6 py-3 rounded-full">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.9/5 sterren</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">Gebaseerd op 12.847 reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
