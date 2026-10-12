import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: string[];
}

export const BlogView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'art-01',
      title: 'The Alchemy of Amber & Wild Labdanum',
      subtitle: 'Why authentic haute maceration demands twelve lunar cycles of stillness.',
      category: 'Olfactory Journal',
      date: 'October 2026',
      readTime: '6 min read',
      author: 'Adrien de Noir, Maître Parfumeur',
      image: '/src/assets/images/category_fragrances_1791824720667.jpg',
      content: [
        'In an era dominated by instantaneous synthetic compounding, true perfumery remains an act of agricultural patience. When raw labdanum resin is harvested from the sun-drenched cistus shrubs of the Mediterranean, its volatile molecules are sharp, volatile, and volatilely unpredictable.',
        'It is only through extended cold maceration in smoked carboys that the harsh terpenic edges subside, allowing the deep balsamic sweetness to harmonize with aged orris butter and natural vanilla bourbon.',
        'At ÉLIXIR & NOIR, we never filter our formulations through chilling units that strip away natural waxes. Every flacon contains the unadulterated soul of the harvest.'
      ]
    },
    {
      id: 'art-02',
      title: 'The Architecture of the Floating Canvas',
      subtitle: 'Constructing structural authority without synthetic interfacings.',
      category: 'Sartorial Discourse',
      date: 'September 2026',
      readTime: '5 min read',
      author: 'Matteo Bellini, Head of Atelier Tailoring',
      image: '/src/assets/images/category_apparel_1791824731775.jpg',
      content: [
        'Commercial mass-market tailoring relies almost universally on fusible glue interfacings—chemical adhesives that bond wool fabric to rigid mesh under extreme heat. The result is a garment that feels stiff upon purchase and blisters irrevocably after dry cleaning.',
        'In contrast, our Obsidian Overcoat is basted with horsehair floating canvas. The canvas is stitched with thousands of micro-stitches that suspend the chest piece freely between the outer wool and the inner silk faille drape.',
        'As the coat warms against the body, the natural fibers yield and conform to the wearer’s shoulder line, creating a bespoke drape that improves with every passing winter.'
      ]
    },
    {
      id: 'art-03',
      title: 'Nocturnal Cellular Rejuvenation',
      subtitle: 'The biological synergy between cold-pressed lipids and volcanic minerals.',
      category: 'Botanical Science',
      date: 'August 2026',
      readTime: '4 min read',
      author: 'Dr. Éléonore Sorel, Phytochemist',
      image: '/src/assets/images/category_skincare_1791824742582.jpg',
      content: [
        'Between the hours of 11:00 PM and 4:00 AM, cutaneous blood flow increases by upwards of 40%, and cellular mitotic regeneration peaks. During this nocturnal window, the skin barrier is uniquely receptive to bio-compatible lipids.',
        'Prickly pear seed oil boasts the highest naturally occurring concentration of Vitamin E (over 1000 mg/kg) and linoleic acid of any botanical oil known to cosmetic science.',
        'When applied in combination with hand-carved volcanic obsidian gua sha stones, fluid retention in the sub-orbital tissue is immediately mobilized, restoring firm facial contours by dawn.'
      ]
    }
  ];

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#888] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Journal</span>
        </button>

        <div className="space-y-4 border-b border-[#1C1C1C] pb-8">
          <div className="flex items-center gap-2 text-xs text-[#C5A880] tracking-wider uppercase">
            <span>{selectedArticle.category}</span>
            <span>·</span>
            <span>{selectedArticle.date}</span>
            <span>·</span>
            <span>{selectedArticle.readTime}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
            {selectedArticle.title}
          </h1>
          <p className="text-base text-[#AAA] font-light italic">
            {selectedArticle.subtitle}
          </p>
          <p className="text-xs text-[#666] pt-1">Author: {selectedArticle.author}</p>
        </div>

        <div className="aspect-[16/9] bg-[#121212] border border-[#222] overflow-hidden">
          <img
            src={selectedArticle.image}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6 text-sm text-[#C4BFB8] leading-relaxed max-w-2xl mx-auto font-light">
          {selectedArticle.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#1C1C1C] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
          The Nocturne Gazette
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-white">
          Atelier Journal & Critical Notes
        </h1>
        <p className="text-xs text-[#888] max-w-md mx-auto">
          Essays on botanical extraction, artisanal tailoring, and the contemplative philosophy of dark luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group bg-[#0A0A0A] border border-[#1C1C1C] hover:border-[#333] transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="aspect-[4/3] bg-[#141414] overflow-hidden">
              <img
                src={art.image}
                alt={art.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#C5A880] tracking-wider uppercase">
                  <span>{art.category}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-serif text-xl text-white group-hover:text-[#C5A880] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-[#888] line-clamp-2 leading-relaxed">
                  {art.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-[#181818] flex items-center justify-between text-xs text-[#AAA]">
                <span>Read Essay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C5A880]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
