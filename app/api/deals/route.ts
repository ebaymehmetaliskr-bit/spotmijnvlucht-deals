// app/api/deals/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "AMS";
  const to = searchParams.get("to") || "IST";
  // ... diğer parametreler ...

  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  
  // ---- YENİ KONTROL 1: Token'ın gelip gelmediğini kontrol edelim ----
  console.log("1. API Token Kontrolü:", token ? `Token'ın ilk 5 hanesi: ${token.substring(0, 5)}...` : "Token BULUNAMADI!");

  if (!token) {
    return NextResponse.json({ error: "API token missing" }, { status: 500 });
  }

  try {
    const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
    url.searchParams.set("origin", from);
    url.searchParams.set("destination", to);
    url.searchParams.set("currency", "EUR");
    url.searchParams.set("limit", "30");

    // ---- YENİ KONTROL 2: Travelpayouts'a hangi URL ile istek attığımızı görelim ----
    console.log("2. Travelpayouts'a gönderilen URL:", url.toString());

    const res = await fetch(url.toString(), {
      headers: { "X-Access-Token": token },
      cache: "no-store",
    });

    // ---- YENİ KONTROL 3: Travelpayouts'tan gelen yanıtın durumunu görelim ----
    console.log(`3. Travelpayouts Yanıt Durumu: ${res.status} ${res.statusText}`);

    if (!res.ok) {
        // Hata durumunda API'den gelen cevabı da loglayalım
        const errorBody = await res.text();
        console.error("Travelpayouts API Hata Detayı:", errorBody);
        throw new Error(`Upstream error ${res.status}`);
    }
    
    const raw = await res.json();

    // ---- YENİ KONTROL 4: Travelpayouts'tan gelen HAM VERİYİ görelim ----
    // Gelen verinin yapısını anlamak için bu en önemli adımdır.
    console.log("4. Travelpayouts'tan Gelen Ham Veri:", JSON.stringify(raw, null, 2));

    // normalize -> UI ile birebir alan isimleri
    const items = (raw?.data || []).map((d: any, i: number) => ({
      id: d.id ?? `${d.origin}-${d.destination}-${i}`,
      origin: d.origin ?? from,
      destination: d.destination ?? to,
      airline: d.airline || d.gate || "",
      price: d.price || d.value || 0,
      depart_at: d.departure_at || d.depart_date || "",
      return_at: d.return_at || d.return_date || "",
      transfers: d.transfers ?? d.number_of_changes ?? 0,
      link: d.link || d.deep_link || "",
    }));

    // ---- YENİ KONTROL 5: İşledikten sonraki veriyi görelim ----
    console.log(`5. İşlenmiş ve Ön Yüze Gönderilmeye Hazır ${items.length} adet Fırsat Bulundu.`);

    return NextResponse.json({ items });
  } catch (e: any) {
    // ---- YENİ KONTROL 6: Herhangi bir HATA olursa yakalayalım ----
    console.error("6. CATCH BLOK HATASI:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}