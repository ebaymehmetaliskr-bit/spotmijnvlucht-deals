// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

// SİZİN MEVCUT BİLEŞENLERİNİZİ İÇERİ AKTARIYORUZ
// Not: Dosya yolları projenizdeki yapıya göre küçük farklılıklar gösterebilir.
// Genellikle '@/components/...' şeklinde kullanılır.
import Header from '@/components/header';
import Footer from '@/components/footer';
import SearchFilterSection from '@/components/search-filter-section';
import TestimonialsSection from '@/components/testimonials-section';
import NewsletterSection from '@/components/newsletter-section';
import EnhancedDealCard from '@/components/enhanced-deal-card'; // EN ÖNEMLİSİ BU!
import PartnerBrandingFooter from '@/components/partner-branding-footer';
import DealOfTheDaySection from '@/components/deal-of-the-day-section';

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
  // EnhancedDealCard'ınızın ihtiyaç duyabileceği diğer alanlar
  // Bu alanları API'nızdan veya burada manuel olarak ekleyebilirsiniz.
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
    // API'den canlı uçuş verilerini çekiyoruz
    async function fetchDeals() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/deals'); // Sabit arama ile veri çekiyoruz

        if (!response.ok) {
          throw new Error('Deals konden niet worden geladen.');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // Gelen veriyi EnhancedDealCard'ın beklediği formata uygun hale getirebiliriz.
        // Şimdilik 1'e 1 eşleştiğini varsayıyoruz.
        setDeals(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, []);

  return (
    // Sayfanın genel yapısını oluşturuyoruz
    <div className="bg-white">
      <Header />

      <main>
        {/* Hero Section ve Arama Filtreleri */}
        <SearchFilterSection />
        
        {/* Günün Fırsatı Bölümü */}
        <DealOfTheDaySection />

        {/* Popüler Fırsatlar Bölümü */}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Populaire Vliegdeals</h2>
          
          {isLoading && <p className="text-center">Deals worden geladen...</p>}
          {error && <p className="text-center text-red-500">Fout: {error}</p>}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.length > 0 ? (
                // VERİYİ EnhancedDealCard BİLEŞENİNE GÖNDERİYORUZ
                deals.map((deal) => (
                  <EnhancedDealCard key={deal.id} deal={deal} />
                ))
              ) : (
                <p className="col-span-full text-center">Geen passende deals gevonden.</p>
              )}
            </div>
          )}
        </section>

        {/* Müşteri Yorumları */}
        <TestimonialsSection />

        {/* E-posta Bülteni */}
        <NewsletterSection />

        {/* Partner Logoları */}
        <PartnerBrandingFooter />
      </main>

      <Footer />
    </div>
  );
}