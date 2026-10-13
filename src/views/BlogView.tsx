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
      subtitle: 'Why authentic cold maceration requires patience and care.',
      category: 'Fragrance Journal',
      date: 'October 2026',
      readTime: '6 min read',
      author: 'Adrien de Noir, Master Perfumer',
      image: '/src/assets/images/category_fragrances_1791824720667.jpg',
      content: [
        'In an era dominated by instantaneous synthetic formulations, true artisan perfumery remains an act of agricultural patience. When raw labdanum resin is harvested from the sun-drenched cistus shrubs of the Mediterranean, its volatile molecules are sharp and multifaceted.',
        'It is only through extended cold maceration in dark glass vessels that the harsh terpenic edges subside, allowing the deep balsamic sweetness to harmonize with aged orris butter and natural vanilla bourbon.',
        'At ÉLIXIR & NOIR, we never filter our formulations through chilling units that strip away natural aromatic compounds. Every flacon contains the unadulterated essence of the botanical harvest.'
      ]
    },
    {
      id: 'art-02',
      title: 'The Art of Floating Canvas Tailoring',
      subtitle: 'Constructing structural authority without synthetic adhesives.',
      category: 'Lifestyle & Tailoring',
      date: 'September 2026',
      readTime: '5 min read',
      author: 'Matteo Bellini, Master Tailor',
      image: '/src/assets/images/category_apparel_1791824731775.jpg',
      content: [
        'Mass-market tailoring relies almost universally on fusible glue interfacings—chemical adhesives that bond wool fabric to rigid mesh under extreme heat. The result is a garment that feels stiff upon purchase and blisters irrevocably after repeated dry cleanings.',
        'In contrast, our garments are crafted with horsehair floating canvas. The canvas is stitched with thousands of micro-stitches that suspend the chest piece freely between the outer wool and the inner silk faille lining.',
        'As the coat warms against the body, the natural fibers yield and conform to the wearer’s natural posture, creating a bespoke drape that improves with every passing winter.'
      ]
    },
    {
      id: 'art-03',
      title: 'Nocturnal Cellular Rejuvenation',
      subtitle: 'The biological synergy between cold-pressed lipids and volcanic minerals.',
      category: 'Botanical Skincare',
      date: 'August 2026',
      readTime: '4 min read',
      author: 'Dr. Eleanor Sorel, Phytochemist',
      image: '/src/assets/images/category_skincare_1791824742582.jpg',
      content: [
        'Between the hours of 11:00 PM and 4:00 AM, cutaneous blood flow increases and cellular mitotic regeneration reaches its peak. During this nocturnal window, the skin barrier is uniquely receptive to biocompatible lipids.',
        'Prickly pear seed oil boasts the highest naturally occurring concentration of Vitamin E (over 1000 mg/kg) and essential linoleic acid of any botanical oil known to cosmetic science.',
        'When applied in combination with hand-carved volcanic obsidian sculpting stones, fluid retention in the sub-orbital tissue is gently mobilized, helping restore refreshed, firm facial contours by morning.'
      ]
    }
  ];

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7D6B67] hover:text-[#392C2A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#C9878D]" />
          <span>Return to Journal</span>
        </button>

        <div className="space-y-4 border-b border-[#E8DED4] pb-8">
          <div className="flex items-center gap-2 text-xs text-[#C9878D] tracking-wider uppercase font-semibold">
            <span>{selectedArticle.category}</span>
            <span>·</span>
            <span>{selectedArticle.date}</span>
            <span>·</span>
            <span>{selectedArticle.readTime}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A] font-normal leading-tight">
            {selectedArticle.title}
          </h1>
          <p className="text-base text-[#7D6B67] font-light italic">
            {selectedArticle.subtitle}
          </p>
          <p className="text-xs text-[#7D6B67] pt-1">Author: {selectedArticle.author}</p>
        </div>

        <div className="aspect-[16/9] bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden rounded-sm">
          <img
            src={selectedArticle.image}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6 text-sm text-[#392C2A] leading-relaxed max-w-2xl mx-auto font-light">
          {selectedArticle.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#E8DED4] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
          Journal & Editorial
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A]">
          Atelier Journal & Notes
        </h1>
        <p className="text-xs text-[#7D6B67] max-w-md mx-auto">
          Articles on botanical extraction, artisanal tailoring, and the philosophy of timeless luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group bg-[#FFFDF9] border border-[#E8DED4] hover:border-[#C9878D] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden rounded-sm"
          >
            <div className="aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
              <img
                src={art.image}
                alt={art.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#C9878D] tracking-wider uppercase font-semibold">
                  <span>{art.category}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-serif text-xl text-[#392C2A] group-hover:text-[#C9878D] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-[#7D6B67] line-clamp-2 leading-relaxed">
                  {art.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DED4] flex items-center justify-between text-xs text-[#7D6B67]">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C9878D]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
