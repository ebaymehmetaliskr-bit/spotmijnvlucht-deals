// Bu satır dosyanın bir "Client Component" olduğunu belirtir.
// Veri çekme gibi tarayıcıya özel işlemler için bu gereklidir.
'use client';

import { useState, useEffect } from 'react';

// Gelen veri için bir tip tanımı yapalım (TypeScript'in gücü!)
interface FlightDeal {
  id: string;
  origin: string;
  destination: string;
  airline: string;
  price: number;
  depart_at: string;
  return_at: string;
  link: string;
}

export default function HomePage() {
  // State'leri tanımlıyoruz
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sayfa yüklendiğinde verileri çekmek için useEffect kullanıyoruz
  useEffect(() => {
    async function fetchDeals() {
      try {
        setIsLoading(true);
        setError(null);

        // Kendi API endpoint'imize istek atıyoruz
        // Örnek olarak IST -> AYT rotasını arayalım
        const response = await fetch('/api/deals?from=IST&to=AYT');

        if (!response.ok) {
          throw new Error('Veriler alınırken bir sorun oluştu.');
        }

        const data = await response.json();
        
        // Gelen veride hata varsa state'e kaydet
        if (data.error) {
            throw new Error(data.error);
        }

        setDeals(data.items || []); // Gelen "items" dizisini state'e kaydediyoruz
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Yükleme tamamlandı
      }
    }

    fetchDeals();
  }, []); // Boş dependency array, bu etkinin sadece ilk render'da çalışmasını sağlar

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Uçuş Fırsatları</h1>

      {isLoading && <p className="text-center">Fırsatlar yükleniyor...</p>}
      {error && <p className="text-center text-red-500">Hata: {error}</p>}
      
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.length > 0 ? (
            deals.map((deal) => (
              <div key={deal.id} className="border rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">
                    {deal.origin} ✈️ {deal.destination}
                  </h2>
                  <span className="text-lg font-bold text-green-600">{deal.price} EUR</span>
                </div>
                <p><strong>Havayolu:</strong> {deal.airline}</p>
                <p><strong>Gidiş:</strong> {new Date(deal.depart_at).toLocaleDateString('tr-TR')}</p>
                <p><strong>Dönüş:</strong> {deal.return_at ? new Date(deal.return_at).toLocaleDateString('tr-TR') : 'Tek Yön'}</p>
                <a 
                  href={`https://www.aviasales.com${deal.link}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 inline-block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Fırsatı Gör
                </a>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">Uygun fırsat bulunamadı.</p>
          )}
        </div>
      )}
    </main>
  );
}