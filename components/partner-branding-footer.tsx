import { AFFILIATE_PARTNERS } from "@/lib/affiliate-tracking"

export default function PartnerBrandingFooter() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Onze Vertrouwde Partners</h3>
          <p className="text-sm text-gray-600">
            Wij werken samen met de beste reisplatforms om jou de beste deals te bieden
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
          {Object.entries(AFFILIATE_PARTNERS).map(([key, partner]) => (
            <div key={key} className="flex flex-col items-center space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 w-24 h-16 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">{partner.name}</span>
              </div>
              <div className="text-xs text-gray-500">Tot {(partner.commission * 100).toFixed(1)}% cashback</div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">* Cashback percentages zijn indicatief en kunnen variëren per boeking</p>
        </div>
      </div>
    </div>
  )
}
