// app/api/deals/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "AMS";
  const to = searchParams.get("to") || "IST";
  const depart = searchParams.get("depart") || ""; // YYYY-MM-DD
  const ret = searchParams.get("ret") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "API token missing" }, { status: 500 });
  }

  try {
    // KENDİ kullandığın gerçek Travelpayouts endpoint'ini buraya koy.
    const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
    url.searchParams.set("origin", from);
    url.searchParams.set("destination", to);
    if (depart) url.searchParams.set("departure_at", depart);
    if (ret) url.searchParams.set("return_at", ret);
    if (maxPrice) url.searchParams.set("price_max", maxPrice);
    url.searchParams.set("currency", "EUR");
    url.searchParams.set("limit", "30");

    const res = await fetch(url.toString(), {
      headers: { "X-Access-Token": token },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Upstream error ${res.status}`);
    const raw = await res.json();

    // normalize -> UI ile birebir alan isimleri
    const items = (raw?.data || raw?.prices || raw || []).map((d: any, i: number) => ({
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

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
