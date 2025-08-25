// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

// SİZİN MEVCUT BİLEŞENLERİNİZİ İÇERİ AKTARIYORUZ
import Header from '@/components/header';
import Footer from '@/components/footer';
import SearchFilterSection from '@/components/search-filter-section';
import TestimonialsSection from '@/components/testimonials-section';
import NewsletterSection from '@/components/newsletter-section';
import EnhancedDealCard from '@/components/enhanced-deal-card';
import PartnerBrandingFooter from '@/components/partner-branding-footer';
import DealOfTheDaySection from '@/components/deal-of-the-day-section';
import { Plane } from 'lucide-react'; // Placeholder için ikon

// API'den gelen veri için bir tip tanımı
interface FlightDeal {
  id: string;
  origin: string;
  destination: string;
  airline: string;
  price: number;
  depart_at: string;
  return_at: string;
  link: string;
  // Kartlarımızın ihtiyaç duyacağı ek alanları da tip tanımına ekleyelim
  image?: { src: string; alt: string; };
  city_name?: string;
  country_name?: string;
  duration_days?: number;
  discount_percentage?: number;
  rating?: number;
  review_count?: number;
}

export default function HomePage() {
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/deals');

        if (!response.ok) {
          throw new Error('Deals konden niet worden geladen.');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // =====> İŞTE HATAYI ÇÖZEN KISIM BURASI <=====
        // API'den gelen her bir 'deal' objesine, bir 'image' nesnesi ekliyoruz.
        // Bu, bileşenlerin çökmesini engelleyecek ve dinamik resimler gösterecektir.
        const enrichedDeals = (data.items || []).map((deal: FlightDeal) => ({
            ...deal,
            image: {
                src: `https://source.unsplash.com/400x300/?${deal.destination},city`,
                alt: `Uitzicht op ${deal.destination}`
            }
        }));

        setDeals(enrichedDeals);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, []);

  return (
    <div className="bg-gray-50">
      <Header />

      <main>
        <SearchFilterSection />
        <DealOfTheDaySection />

        <section className="container mx-auto px-4 md:px-8 py-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Populaire Vliegdeals</h2>
          
          {isLoading && <p className="text-center py-10">Deals worden geladen...</p>}
          {error && <p className="text-center text-red-500 py-10">Fout: {error}</p>}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.length > 0 ? (
                deals.map((deal) => (
                  <EnhancedDealCard key={deal.id} deal={deal} />
                ))
              ) : (
                <p className="col-span-full text-center py-10">Geen passende deals gevonden.</p>
              )}
            </div>
          )}
        </section>

        <TestimonialsSection />
        <NewsletterSection />
        <PartnerBrandingFooter />
      </main>

      <Footer />
    </div>
  );
}
