interface FlightSchemaProps {
  departure: string
  arrival: string
  departureDate: string
  price: number
  currency: string
  airline: string
}

export function FlightSchema({ departure, arrival, departureDate, price, currency, airline }: FlightSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Flight",
    flightNumber: `${airline}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    provider: {
      "@type": "Airline",
      name: airline,
      iataCode: airline.substring(0, 2).toUpperCase(),
    },
    departureAirport: {
      "@type": "Airport",
      name: departure,
      iataCode: departure.substring(0, 3).toUpperCase(),
    },
    arrivalAirport: {
      "@type": "Airport",
      name: arrival,
      iataCode: arrival.substring(0, 3).toUpperCase(),
    },
    departureTime: departureDate,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      validThrough: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
