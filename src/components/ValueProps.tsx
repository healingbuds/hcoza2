import ScrollAnimation from "@/components/ScrollAnimation";
import { Sprout, Users, FlaskConical } from "lucide-react";

const values = [
  {
    icon: Sprout,
    title: "Superior Quality",
    description: "Every stage from cultivation through extraction to final production is meticulously managed with unwavering attention to detail. Our EU GMP-certified products meet the highest international standards, earning trust across borders.",
  },
  {
    icon: Users,
    title: "Expanding Access",
    description: "Our mission is to ensure medical cannabis reaches those who need it most. Through evidence-based advocacy and education, we are reducing barriers, challenging misconceptions, and creating pathways to safe, legal access.",
  },
  {
    icon: FlaskConical,
    title: "Research-Driven Innovation",
    description: "Collaborating with world-class research institutions including Imperial College London and University of Pennsylvania, we advance scientific knowledge of cannabis therapeutics. Research excellence is the foundation of everything we pursue.",
  },
];

const ValueProps = () => {
  return (
    <div className="px-2">
      <section 
        className="py-16 sm:py-20 md:py-24 rounded-2xl sm:rounded-3xl relative overflow-hidden"
        style={{ backgroundColor: 'hsl(var(--section-color))' }}
      >
        {/* Botanical decoration - left */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.08] pointer-events-none">
          <svg width="180" height="360" viewBox="0 0 180 360" fill="none">
            {/* Cannabis-inspired leaf cluster */}
            <g className="text-white">
              {/* Center leaf */}
              <path d="M90 40 Q95 80 90 140 Q85 80 90 40" fill="currentColor" opacity="0.6"/>
              <path d="M90 40 C100 60 105 100 90 140 C75 100 80 60 90 40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              
              {/* Left leaves */}
              <path d="M90 80 Q60 60 35 85 Q65 90 90 80" fill="currentColor" opacity="0.5"/>
              <path d="M90 120 Q50 95 20 130 Q55 130 90 120" fill="currentColor" opacity="0.4"/>
              <path d="M90 160 Q45 140 15 180 Q50 175 90 160" fill="currentColor" opacity="0.3"/>
              
              {/* Right leaves */}
              <path d="M90 80 Q120 60 145 85 Q115 90 90 80" fill="currentColor" opacity="0.5"/>
              <path d="M90 120 Q130 95 160 130 Q125 130 90 120" fill="currentColor" opacity="0.4"/>
              <path d="M90 160 Q135 140 165 180 Q130 175 90 160" fill="currentColor" opacity="0.3"/>
              
              {/* Stem */}
              <path d="M90 140 Q88 220 90 320" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
              
              {/* Lower decorative leaves */}
              <path d="M90 220 Q70 210 55 230 Q75 225 90 220" fill="currentColor" opacity="0.25"/>
              <path d="M90 220 Q110 210 125 230 Q105 225 90 220" fill="currentColor" opacity="0.25"/>
              <path d="M90 270 Q75 265 65 280 Q80 275 90 270" fill="currentColor" opacity="0.2"/>
              <path d="M90 270 Q105 265 115 280 Q100 275 90 270" fill="currentColor" opacity="0.2"/>
            </g>
          </svg>
        </div>
        
        {/* Botanical decoration - right */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.08] pointer-events-none rotate-180">
          <svg width="180" height="360" viewBox="0 0 180 360" fill="none">
            {/* Cannabis-inspired leaf cluster */}
            <g className="text-white">
              {/* Center leaf */}
              <path d="M90 40 Q95 80 90 140 Q85 80 90 40" fill="currentColor" opacity="0.6"/>
              <path d="M90 40 C100 60 105 100 90 140 C75 100 80 60 90 40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              
              {/* Left leaves */}
              <path d="M90 80 Q60 60 35 85 Q65 90 90 80" fill="currentColor" opacity="0.5"/>
              <path d="M90 120 Q50 95 20 130 Q55 130 90 120" fill="currentColor" opacity="0.4"/>
              <path d="M90 160 Q45 140 15 180 Q50 175 90 160" fill="currentColor" opacity="0.3"/>
              
              {/* Right leaves */}
              <path d="M90 80 Q120 60 145 85 Q115 90 90 80" fill="currentColor" opacity="0.5"/>
              <path d="M90 120 Q130 95 160 130 Q125 130 90 120" fill="currentColor" opacity="0.4"/>
              <path d="M90 160 Q135 140 165 180 Q130 175 90 160" fill="currentColor" opacity="0.3"/>
              
              {/* Stem */}
              <path d="M90 140 Q88 220 90 320" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
              
              {/* Lower decorative leaves */}
              <path d="M90 220 Q70 210 55 230 Q75 225 90 220" fill="currentColor" opacity="0.25"/>
              <path d="M90 220 Q110 210 125 230 Q105 225 90 220" fill="currentColor" opacity="0.25"/>
              <path d="M90 270 Q75 265 65 280 Q80 275 90 270" fill="currentColor" opacity="0.2"/>
              <path d="M90 270 Q105 265 115 280 Q100 275 90 270" fill="currentColor" opacity="0.2"/>
            </g>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-14 sm:mb-18">
              <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 px-4" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Growing more than medicine
              </h2>
            </div>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 md:gap-16">
            {values.map((value, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="flex justify-center mb-7">
                    <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/10">
                      <value.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-jakarta text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="font-jakarta text-white/75 leading-relaxed text-sm sm:text-base">
                    {value.description}
                  </p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ValueProps;
