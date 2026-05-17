import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json({ error: "query required" }, { status: 400 });

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=ko`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "ssuweb-festa/1.0",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Geocoding API error" },
      { status: res.status },
    );
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    return NextResponse.json({ lat: null, lng: null });
  }

  return NextResponse.json({
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  });
}
