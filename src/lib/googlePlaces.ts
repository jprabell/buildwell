export interface ContractorResult {
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  mapsUrl: string;
}

export async function findContractors(
  keywords: string,
  location: string
): Promise<ContractorResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  try {
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
        body: JSON.stringify({
          textQuery: `${keywords} ${location}`,
          maxResultCount: 3,
        }),
        next: { revalidate: 86400 }, // cache 24 hours
      }
    );

    if (!res.ok) return [];
    const data = await res.json();

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
