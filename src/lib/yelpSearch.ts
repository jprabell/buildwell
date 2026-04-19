export interface ContractorResult {
  name: string;
  address: string;
  phone: string;
  yelpUrl: string;
  rating: number;
  reviewCount: number;
  category: string;
}

export async function findContractors(
  keywords: string,
  location: string
): Promise<ContractorResult[]> {
  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    term: keywords,
    location: location || "United States",
    limit: "3",
    sort_by: "rating",
  });

  try {
    const res = await fetch(
      `https://api.yelp.com/v3/businesses/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        next: { revalidate: 86400 }, // cache 24 hours per trade+location combo
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const businesses: YelpBusiness[] = data.businesses ?? [];

    return businesses.slice(0, 3).map((b) => ({
      name: b.name,
      address: b.location?.display_address?.join(", ") ?? "",
      phone: b.display_phone ?? "",
      yelpUrl: b.url ?? "",
      rating: b.rating ?? 0,
      reviewCount: b.review_count ?? 0,
      category: b.categories?.[0]?.title ?? "",
    }));
  } catch {
    return [];
  }
}

// Yelp API response shape (partial)
interface YelpBusiness {
  name: string;
  display_phone?: string;
  url?: string;
  rating?: number;
  review_count?: number;
  location?: {
    display_address?: string[];
  };
  categories?: { alias: string; title: string }[];
}
