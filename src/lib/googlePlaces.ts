export interface ContractorResult {
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  mapsUrl: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Convert a US zip code to lat/lng using Google Geocoding API.
 * Returns null if the geocoding fails or the key is missing.
 */
export async function geocodeZip(zipCode: string): Promise<LatLng | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !zipCode) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zipCode)}&components=country:US&key=${apiKey}`,
      { next: { revalidate: 604800 } } // cache 7 days — zip centroids don't change
    );
    if (!res.ok) return null;
    const data = await res.json();
    const loc = data?.results?.[0]?.geometry?.location;
    if (!loc) return null;
    return { lat: loc.lat, lng: loc.lng };
  } catch {
    return null;
  }
}

/**
 * Find up to 3 contractors matching the given keywords.
 *
 * When `coords` is provided the search is constrained to a ~30-mile radius
 * (48 km) around those coordinates via locationRestriction so results are
 * genuinely local.  Without coords we fall back to a text-only query which
 * is less precise.
 */
export async function findContractors(
  keywords: string,
  location: string,
  coords?: LatLng | null
): Promise<ContractorResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  try {
    // Build the request body
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Record<string, any> = {
      textQuery: coords
        ? keywords                          // pure keyword — geography handled by restriction
        : `${keywords} ${location}`,        // fallback: embed location in text
      maxResultCount: 3,
    };

    if (coords) {
      // Hard geographic boundary — only return results within ~30 miles
      body.locationRestriction = {
        circle: {
          center: { latitude: coords.lat, longitude: coords.lng },
          radius: 48280, // 30 miles in metres
        },
      };
    }

    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": [
            "places.displayName",
            "places.formattedAddress",
            "places.nationalPhoneNumber",
            "places.websiteUri",
            "places.rating",
            "places.userRatingCount",
            "places.googleMapsUri",
          ].join(","),
        },
        body: JSON.stringify(body),
        next: { revalidate: 86400 }, // cache 24 hours per query
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[googlePlaces] Places API error ${res.status}:`, errText.slice(0, 400));
      return [];
    }
    const data = await res.json();
    if (!data.places?.length) {
      console.warn(`[googlePlaces] No results for query: "${body.textQuery}" (${location})`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.places || []).map((p: any) => ({
      name: p.displayName?.text || "",
      address: p.formattedAddress || "",
      phone: p.nationalPhoneNumber || "",
      website: p.websiteUri || p.googleMapsUri || "",
      rating: p.rating || 0,
      reviewCount: p.userRatingCount || 0,
      mapsUrl: p.googleMapsUri || "",
    }));
  } catch {
    return [];
  }
}
