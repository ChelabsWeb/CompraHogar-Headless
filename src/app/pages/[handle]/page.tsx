import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify';

// --- Types ---
interface PageSEO {
  title: string | null;
  description: string | null;
}

interface ShopifyPage {
  id: string;
  title: string;
  handle: string;
  body: string;
  seo?: PageSEO;
}

interface PageDataProps {
  params: {
    handle: string;
  };
}

// --- Queries ---
const getPageQuery = `
  query getPage($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      seo {
        title
        description
      }
    }
  }
`;

// --- Fetcher Function ---
async function getPage(handle: string): Promise<ShopifyPage | null> {
  const { body } = await shopifyFetch({
    query: getPageQuery,
    variables: { handle },
    cache: 'force-cache',
    tags: ['pages']
  });

  return body?.data?.page || null;
}

// --- Funciones Metadata ---
export async function generateMetadata({ params }: PageDataProps): Promise<Metadata> {
  const page = await getPage(params.handle);

  if (!page) {
    return {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe.',
    };
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || `Página sobre ${page.title}`,
  };
}

// --- Componente Principal ---
export default async function PageRoute({ params }: PageDataProps) {
  const page = await getPage(params.handle);

  // Manejo de Error 404
  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
      {/* 
        Tailwind Typography ('prose') se encarga de dar un estilo limpio,
        formateado y legible a las etiquetas HTML arrojadas por Shopify.
      */}
      <div className="prose prose-neutral prose-lg mx-auto">
        <div dangerouslySetInnerHTML={{ __html: page.body }} />
      </div>
    </div>
  );
}
