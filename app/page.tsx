"use client";

import { useState, useEffect } from 'react';
import { Plane, Search, Calendar, MapPin, ArrowRight } from 'lucide-react';

// Arayüzde gösterilecek her bir uçuş fırsatının veri yapısını tanımlıyoruz
interface FlightDeal {
  _id: string;
  destination: string;
  price: number;
  airline: string;
  departure_at: string;
  return_at: string;
  origin: string;
}

// Ana sayfa bileşenimiz
export default function HomePage() {
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // API URL'sini ortam değişkeninden alıyoruz. Bu, Vercel için en doğru yöntemdir.
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        if (!API_URL) {
          throw new Error("API URL'si yapılandırılmamış. Lütfen Vercel'de ortam değişkenini kontrol edin.");
        }
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`API Hatası: Sunucudan ${response.status} koduyla yanıt alındı.`);
        }
        
        const data: FlightDeal[] = await response.json();
        
        setDeals(data);
        setError(null);
      } catch (err) {
        console.error("Fırsatları çekerken detaylı hata:", err);
        if (err instanceof Error) {
            setError(`Fırsatlar yüklenemedi: ${err.message}`);
        } else {
            setError("Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []); // Boş dependency array, bu etkinin sadece bir kez çalışmasını sağlar

  // Arama kutucuğu bileşeni
  const SearchBox = () => (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="from" className="text-sm font-medium text-white/80 mb-2">Van</label>
          <div className="flex items-center bg-gray-800/50 rounded-lg p-3">
            <MapPin className="text-blue-400 mr-3" size={20} />
            <input id="from" type="text" defaultValue="Amsterdam (AMS)" className="bg-transparent w-full focus:outline-none text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="to" className="text-sm font-medium text-white/80 mb-2">Naar</label>
          <div className="flex items-center bg-gray-800/50 rounded-lg p-3">
            <MapPin className="text-green-400 mr-3" size={20} />
            <input id="to" type="text" placeholder="Kies bestemming" className="bg-transparent w-full focus:outline-none text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="dates" className="text-sm font-medium text-white/80 mb-2">Data</label>
          <div className="flex items-center bg-gray-800/50 rounded-lg p-3">
            <Calendar className="text-purple-400 mr-3" size={20} />
            <input id="dates" type="text" placeholder="Kies een periode" className="bg-transparent w-full focus:outline-none text-white" />
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center h-[52px]">
          <Search className="mr-2" size={20} />
          <span>Zoeken</span>
        </button>
      </div>
    </div>
  );

  // Fırsat kartı bileşeni
  const DealCard = ({ deal }: { deal: FlightDeal }) => (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-white">{deal.destination}</h3>
          <p className="text-3xl font-extrabold text-green-400">€{deal.price}</p>
        </div>
        <p className="text-sm text-gray-400 mb-4">Luchtvaartmaatschappij: {deal.airline}</p>
        <div className="flex flex-col text-gray-300 text-sm space-y-2 mb-5">
            <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-blue-400" />
                <span>Heenreis: {new Date(deal.departure_at).toLocaleDateString('nl-NL')}</span>
            </div>
            <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-purple-400" />
                <span>Terugreis: {new Date(deal.return_at).toLocaleDateString('nl-NL')}</span>
            </div>
        </div>
        <button className="w-full bg-green-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
          Bekijk Deal <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-8" style={{backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" , backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 container mx-auto">
        <header className="text-center my-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Plane size={48} className="text-blue-400" />
            <h1 className="text-5xl font-extrabold tracking-tight">SpotMijnVlucht.nl</h1>
          </div>
          <p className="text-xl text-gray-300">Vind direct de beste vluchtdeals vanuit Nederland!</p>
        </header>

        <section className="mb-16 flex justify-center">
          <SearchBox />
        </section>

        <section>
          <h2 className="text-4xl font-bold mb-8 text-center">🔥 Populaire Deals</h2>
          
          {loading && <p className="text-center text-lg animate-pulse">Deals worden geladen...</p>}
          
          {error && <p className="text-center text-lg text-red-400 bg-red-900/50 py-3 px-5 rounded-lg">{error}</p>}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map(deal => (
                <DealCard key={deal._id} deal={deal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}