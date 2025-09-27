import Link from 'next/link';
import Image from 'next/image';

interface CTA {
  text: string;
  href: string;
  primary?: boolean;
}

interface HeroProps {
  title: string;
  subtitle: string;
  ctas: CTA[];
  imageSrc: string;
  imageAlt: string;
}

export function Hero({ title, subtitle, ctas, imageSrc, imageAlt }: HeroProps) {
  return (
    <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-[#5AA2FF] to-[#7BB6FF] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {ctas.map((cta, index) => (
              <Link
                key={index}
                href={cta.href}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  cta.primary
                    ? 'bg-[#00205B] text-white shadow-sm hover:brightness-95'
                    : 'bg-white/70 text-[#00205B] border border-white/60 hover:bg-white'
                }`}
              >
                {cta.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={400}
              height={400}
              className="rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
