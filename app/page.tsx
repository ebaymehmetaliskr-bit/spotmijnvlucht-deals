"use client";

import { useState, useEffect } from 'react';
import { Plane, Search, Calendar, MapPin, ArrowRight, Building, Star, Clock } from 'lucide-react';

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

// Havayolu kodlarını logolarla eşleştirmek için bir yardımcı fonksiyon
const getAirlineLogo = (airlineCode: string) => {
  // Bu listeyi zamanla genişletebiliriz
  const logos: { [key: string]: string } = {
    'PC': 'https://s1.apideeplink.com/images/airlines/PC.png',
    'HV': 'https://s1.apideeplink.com/images/airlines/HV.png',
    'VY': 'https://s1.apideeplink.com/images/airlines/VY.png',
    'U2': 'https://s1.apideeplink.com/images/airlines/U2.png',
    'FR': 'https://s1.apideeplink.com/images/airlines/FR.png',
    'TK': 'https://s1.apideeplink.com/images/airlines/TK.png',
    'KL': 'https://s1.apideeplink.com/images/airlines/KL.png',
    'XQ': 'https://s1.apideeplink.com/images/airlines/XQ.png',
  };
  return logos[airlineCode] || `https://placehold.co/100x100/334155/94a3b8?text=${airlineCode}`;
};

// Tarih formatını güzelleştiren yardımcı fonksiyon
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Ana sayfa bileşenimiz
export default function HomePage() {
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://spotmijnvlucht-api-77895017095-europe-west1.a.run.app/deals";
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`API Fout: Sunucudan ${response.status} koduyla yanıt alındı.`);
        }
        
        const data: FlightDeal[] = await response.json();
        setDeals(data);
        setError(null);
      } catch (err) {
        console.error("Fırsatları çekerken detaylı hata:", err);
        if (err instanceof Error) {
            setError(`Fırsatlar yüklenemedi: ${err.message}`);
        } else {
            setError("Bilinmeyen bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Yeni ve şık Fırsat Kartı bileşeni
  const DealCard = ({ deal }: { deal: FlightDeal }) => {
    const departureDate = new Date(deal.departure_at);
    const returnDate = new Date(deal.return_at);
    const duration = Math.round((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="md:w-1/3 p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-700">
                <img src={getAirlineLogo(deal.airline)} alt={`${deal.airline} logo`} className="w-16 h-16 object-contain mb-2 rounded-full" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{deal.airline}</span>
                <div className="flex items-center mt-2 text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="text-gray-300 dark:text-gray-600" />
                </div>
            </div>
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{deal.origin} → {deal.destination}</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{deal.destination}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">vanaf</p>
                        <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">€{deal.price}</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span>{formatDate(deal.departure_at)} - {formatDate(deal.return_at)}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>{duration} dagen</span>
                    </div>
                </div>
            </div>
            <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50">
                <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <span>Bekijk Deal</span>
                    <ArrowRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    );
  };

  // Yükleme sırasında gösterilecek iskelet kart
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
        <div className="md:w-1/3 p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mb-2"></div>
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="text-right">
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded mb-2 ml-auto"></div>
                    <div className="h-10 w-20 bg-gray-300 dark:bg-gray-600 rounded ml-auto"></div>
                </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
        <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50">
             <div className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
    </div>
  )

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Plane size={32} className="text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SpotMijnVlucht.nl</h1>
                </div>
                <nav>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Deals</a>
                </nav>
            </div>
        </header>
        <main className="container mx-auto px-6 py-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-4">Vind Je Volgende Avontuur</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">De beste deals, speciaal voor jou geselecteerd.</p>

            <div className="space-y-6">
                {loading ? (
                    [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Er is een fout opgetreden</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    deals.map(deal => <DealCard key={deal._id} deal={deal} />)
                )}
            </div>
        </main>
    </div>
  );
}
