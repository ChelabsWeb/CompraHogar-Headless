import { getCollectionProducts } from "@/lib/shopify";
import { CollectionShowcase } from "./CollectionShowcase";

interface AsyncCollectionShowcaseProps {
  handle: string;
  bannerImage?: string;
  bannerColor?: string;
  count?: number;
}

export async function AsyncCollectionShowcase({
  handle,
  bannerImage,
  bannerColor,
  count = 8,
}: AsyncCollectionShowcaseProps) {
  const data = await getCollectionProducts(handle, count);
  if (!data || !data.products?.edges?.length) return null;

  return (
    <CollectionShowcase
      title={data.title}
      handle={data.handle}
      description={data.description}
      bannerImage={bannerImage}
      bannerColor={bannerColor}
      products={data.products.edges}
    />
  );
}
