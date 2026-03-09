import { getProductReviews } from '@/lib/reviews';

interface VendorReviewsProps {
  productHandle: string;
}

// Static SVG Star Component 
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function VendorReviews({ productHandle }: VendorReviewsProps) {
  // SSR fetch for reviews data
  const data = await getProductReviews(productHandle);

  if (!data || data.ratingCount === 0) {
    return (
      <section className="mt-8 lg:mt-16 w-full max-w-5xl mx-auto border-t border-slate-200 pt-10">
         <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">Opiniones de Clientes</h2>
         <p className="text-slate-500">Aún no hay opiniones para este producto. ¡Sé el primero en opinar!</p>
      </section>
    );
  }

  return (
    <section className="mt-8 lg:mt-16 w-full max-w-5xl mx-auto border-t border-slate-200 pt-10">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Opiniones de Clientes</h2>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(data.averageRating)} />
          <span className="text-sm text-slate-600 font-medium">({data.ratingCount} reseñas)</span>
        </div>
      </div>

      <div className="grid gap-6">
        {data.reviews.map((review) => (
          <article key={review.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-semibold">
                  {review.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{review.author}</h3>
                  <div className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            {review.title && <h4 className="font-semibold text-slate-800 mb-2">{review.title}</h4>}
            <p className="text-slate-600 leading-relaxed text-sm">{review.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
