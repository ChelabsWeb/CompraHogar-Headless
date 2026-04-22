import { getCollectionSeoContent } from "@/lib/constants/collectionSeoContent";

interface CollectionSeoBlockProps {
  handle: string;
}

export function CollectionSeoBlock({ handle }: CollectionSeoBlockProps) {
  const content = getCollectionSeoContent(handle);
  if (!content) return null;

  const faqJsonLd = content.faq && content.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <section
      aria-label="Información sobre la categoría"
      className="mt-12 md:mt-16 border-t border-slate-200 pt-10 md:pt-14"
    >
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="max-w-3xl">
        <p className="text-[15px] md:text-base text-slate-700 leading-relaxed">
          {content.intro}
        </p>

        {content.sections.map((section) => (
          <div key={section.heading} className="mt-8 md:mt-10">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[15px] text-slate-700 leading-relaxed mb-3 last:mb-0"
              >
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 space-y-1.5 text-[15px] text-slate-700">
                {section.bullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {content.faq && content.faq.length > 0 && (
          <div className="mt-10 md:mt-12">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {content.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1">
                    {item.question}
                  </h3>
                  <p className="text-[15px] text-slate-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
