import { MoreListingsCarousel } from '@/components/MoreListingsCarousel';
import { fetchMoreListingsForDetail } from '@/lib/moreListings';
import type { Listing } from '@/lib/supabase/types';

interface Props {
  currentId: string;
  pricingCategory: Listing['pricing_category'];
  listingCategory: Listing['category'];
}

export async function MoreListingsCarouselServer({ currentId, pricingCategory, listingCategory }: Props) {
  const { listings, coverUrls } = await fetchMoreListingsForDetail(currentId, {
    pricingCategory,
    listingCategory,
  });
  return <MoreListingsCarousel listings={listings} coverUrls={coverUrls} />;
}
