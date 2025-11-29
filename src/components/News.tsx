import ScrollAnimation from "@/components/ScrollAnimation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import newsMarlonWayans from "@/assets/news-marlon-wayans.webp";
import newsNftMinting from "@/assets/news-nft-minting.jpg";
import newsRicardoCapone from "@/assets/news-ricardo-capone.jpg";
import newsMaxWhite from "@/assets/news-max-white.jpg";
import newsShaggyBrown from "@/assets/news-shaggy-brown.jpg";
import newsRicardoTech from "@/assets/news-ricardo-tech.jpg";

const newsItems = [
  {
    category: "Cannabis",
    title: "Marlon Wayans Talks Selling Weed On The Blockchain: Is Dr. Green Legit?",
    description: "Actor and comedian Marlon Wayans, famous for his roles in iconic films like Scary Movie, has transitioned his lifelong relationship with cannabis into a purposeful partnership with Dr. Green NFT.",
    image: newsMarlonWayans,
    featured: true,
    link: "https://drgreennft.com/news/marlon-wayans-talks-selling-weed-on-the-blockchain-is-dr-green-legit-he-isnt-afraid-to-answer-the-tough-questions",
    tags: ["Cannabis"],
  },
  {
    category: "Dr. Green",
    title: "Unlocking the Future: Next Steps After Minting Your NFT",
    description: "Minting your NFT is just the beginning of your journey into a revolutionary platform that combines blockchain technology with the medical cannabis industry.",
    image: newsNftMinting,
    featured: false,
    link: "https://drgreennft.com/news/unlocking-the-future-next-steps-after-minting-your-nft",
    tags: ["Dr. Green"],
  },
  {
    category: "Dr. Green",
    title: "Sniper Spotlight with Ricardo Capone from Dr. Green Cannabis",
    description: "For the last five years, we've been involved heavily in the medical cannabis space in Portugal. We have facilities where we grow medical cannabis for distribution to institutions.",
    image: newsRicardoCapone,
    featured: false,
    link: "https://drgreennft.com/news/sniper-spotlight-with-ricardo-capone-from-dr-green-canabis",
    tags: ["Dr. Green", "NFT", "Medical Cannabis"],
  },
  {
    category: "Dr. Green",
    title: "Ricardo Capone: Pioneering Technological Solutions in the Cannabis Industry",
    description: "Financial setbacks have never deterred billionaire Maximillian White. After losing $39 million in the Cypriot banking collapse, White turned his resilience into a new venture.",
    image: newsRicardoTech,
    featured: false,
    link: "https://drgreennft.com/news/ricardo-capone-pioneering-technological-solutions-in-the-cannabis-industry",
    tags: ["Dr. Green"],
  },
  {
    category: "Dr. Green",
    title: "Maximillian White 'Elon Musk of weed' will legalise cannabis around the world",
    description: "Billionaire Maximillian White dubbed the 'Elon Musk of weed' vouches to legalise marijuana around the globe. The founder of Dr. Green aims to be the number-one supplier.",
    image: newsMaxWhite,
    featured: false,
    link: "https://drgreennft.com/news/maximillian-white-elon-musk-of-weed-will-legalise-cannabis-around-the-world",
    tags: ["Cannabis", "Dr. Green"],
  },
  {
    category: "Dr. Green",
    title: "From Hollywood's 'Weed Man' to Regulatory Pioneer: Shaggy Brown Joins Dr Green",
    description: "From Hollywood's trusted 'weed man to the stars' to global cannabis pioneer, Shaggy Brown has spent 25+ years curating the highest-quality cannabis for icons like Tyson, Snoop, and DMX.",
    image: newsShaggyBrown,
    featured: false,
    link: "https://drgreennft.com/news/from-hollywoods-weed-man-to-regulatory-pioneer-shaggy-brown-joins-forces-with-dr-green",
    tags: ["Dr. Green"],
  },
];

const News = () => {
  return (
    <section id="news" className="bg-background py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <h2 className="font-pharma text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              Latest news
            </h2>
            <Button 
              variant="outline" 
              size="lg" 
              className="font-body rounded-full text-sm sm:text-base"
              onClick={() => window.open('https://drgreennft.com/news', '_blank')}
            >
              All news
            </Button>
          </div>
        </ScrollAnimation>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {newsItems.slice(0, 6).map((item, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <Card 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 rounded-2xl cursor-pointer hover:-translate-y-2 h-full flex flex-col"
                onClick={() => window.open(item.link, '_blank')}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  {item.featured && (
                    <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/90 to-sage-dark/40 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <p className="text-sm font-semibold text-secondary mb-2 tracking-wider">FEATURED</p>
                        <h3 className="text-xl font-bold leading-tight">
                          Dr. Green Partnership
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        variant="outline" 
                        className="font-geist border-secondary/60 text-secondary bg-secondary/10 rounded-full px-3 py-1 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-geist text-lg font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors tracking-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="font-geist text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 mt-4 text-primary font-semibold self-start"
                  >
                    Read More →
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
