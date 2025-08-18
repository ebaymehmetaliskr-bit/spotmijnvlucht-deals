import { Shield, Lock, Award, CheckCircle } from "lucide-react"

const partnerAirlines = [
  { name: "KLM", logo: "/klm-logo.png" },
  { name: "Turkish Airlines", logo: "/turkish-airlines-logo.png" },
  { name: "British Airways", logo: "/british-airways-logo.png" },
  { name: "Vueling", logo: "/vueling-logo.png" },
  { name: "ITA Airways", logo: "/ita-airways-logo.png" },
  { name: "Czech Airlines", logo: "/czech-airlines-logo.png" },
  { name: "Lufthansa", logo: "/lufthansa-logo.png" },
  { name: "Air France", logo: "/air-france-logo.png" },
]

const trustIndicators = [
  {
    icon: Shield,
    title: "SSL Beveiligd",
    description: "256-bit encryptie",
    color: "text-green-600",
  },
  {
    icon: Award,
    title: "IATA Gecertificeerd",
    description: "Officiële licentie",
    color: "text-blue-600",
  },
  {
    icon: Lock,
    title: "Veilige Betalingen",
    description: "PCI DSS compliant",
    color: "text-purple-600",
  },
  {
    icon: CheckCircle,
    title: "Geld Terug Garantie",
    description: "100% beschermd",
    color: "text-orange-600",
  },
]

export default function PartnerTrustSection() {
  return (
    <section className="py-16 px-4 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Partner Airlines */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Onze Partner Airlines</h2>
          <p className="text-gray-600 mb-8">
            Wij werken samen met meer dan 200 airlines wereldwijd om jou de beste deals te bieden
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-items-center">
            {partnerAirlines.map((airline, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 w-full h-16 flex items-center justify-center"
              >
                <img
                  src={airline.logo || "/placeholder.svg"}
                  alt={airline.name}
                  className="max-h-8 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-100 pt-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vertrouwd door Duizenden</h3>
            <p className="text-gray-600">Jouw veiligheid en vertrouwen staan bij ons voorop</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-3">
                    <IconComponent className={`h-6 w-6 ${indicator.color}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{indicator.title}</h4>
                  <p className="text-sm text-gray-600">{indicator.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-700 font-medium">Uptime Garantie</div>
              <div className="text-sm text-gray-600">Altijd beschikbaar wanneer je ons nodig hebt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">2 min</div>
              <div className="text-gray-700 font-medium">Gemiddelde Responstijd</div>
              <div className="text-sm text-gray-600">Snelle klantenservice via chat en telefoon</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">5 jaar</div>
              <div className="text-gray-700 font-medium">Ervaring in de Markt</div>
              <div className="text-sm text-gray-600">Betrouwbare partner sinds 2019</div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 opacity-60">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>SSL Certificaat</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span>IATA Licentie</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>PCI DSS Level 1</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
}
