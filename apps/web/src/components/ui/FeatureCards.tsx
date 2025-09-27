interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureCardsProps {
  items: FeatureItem[];
}

export function FeatureCards({ items }: FeatureCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-black/5 bg-white shadow-sm p-6 hover:translate-y-[1px] transition-transform duration-200"
        >
          <div className="text-4xl mb-4">{item.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {item.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
