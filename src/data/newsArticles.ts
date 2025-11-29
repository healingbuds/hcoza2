import newsMarlonWayans from "@/assets/news-marlon-wayans.webp";
import newsNftMinting from "@/assets/news-nft-minting.jpg";
import newsRicardoCapone from "@/assets/news-ricardo-capone.jpg";
import newsMaxWhite from "@/assets/news-max-white.jpg";
import newsShaggyBrown from "@/assets/news-shaggy-brown.jpg";
import newsRicardoTech from "@/assets/news-ricardo-tech.jpg";
import conferenceHq from "@/assets/conference-hq.jpg";
import awardHq from "@/assets/award-hq.jpg";
import clinicPortugal from "@/assets/clinic-portugal.jpg";
import productionFacility from "@/assets/production-facility-hq.jpg";
import researchLab from "@/assets/research-lab-hq.jpg";

export interface NewsArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  externalLink?: string;
  tags: string[];
  author: string;
  date: string;
  content: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "healing-buds-budstacks-partnership",
    category: "Healing Buds",
    title: "Healing Buds Global Partners with Budstacks to Revolutionize Cannabis Industry Technology",
    description: "In a groundbreaking move, Healing Buds Global announces strategic partnership with Budstacks, the leading SaaS agency specializing in web development, payment processing, and NFT franchising solutions.",
    image: conferenceHq,
    featured: true,
    tags: ["Healing Buds", "Budstacks", "Technology"],
    author: "Healing Buds Editorial",
    date: "Nov 28, 2024",
    content: [
      "Healing Buds Global has announced a transformative partnership with Budstacks, a pioneering SaaS agency specializing in web and app development, payment processing, support solutions, white-labeling, and NFT franchising.",
      "This collaboration positions Healing Buds as a flagship example of what's possible when cutting-edge technology meets the regulated cannabis industry. Budstacks' comprehensive platform enables seamless integration of blockchain traceability, patient management systems, and compliant payment processing.",
      "The partnership exemplifies the future of cannabis business infrastructure, offering turnkey solutions for entrepreneurs, startups, and established businesses looking to enter the regulated medical cannabis market under the Dr. Green License framework.",
      "Ricardo Capone, CTO of Dr. Green, commented: 'Budstacks represents exactly the kind of technology partner we need to scale our vision globally. Their expertise in white-label solutions and NFT franchising opens unprecedented opportunities for compliant cannabis entrepreneurship.'",
      "The Healing Buds platform, powered by Budstacks technology, now serves as the gold standard for what a fully-integrated, EU GMP certified cannabis operation can achieve."
    ],
  },
  {
    id: "scott-cooley-sunset-tours-franchise",
    category: "Healing Buds",
    title: "From Irish Pub to Cannabis Pioneer: Scott of Cooley's Irish Bar Launches Medical Marijuana Franchise in Portugal",
    description: "Successful entrepreneur Scott, owner of Cooley's Irish Bar and Sunset Tours in Portugal, partners with Dr. Green License to offer exclusive franchise opportunities for locals and startups.",
    image: clinicPortugal,
    featured: false,
    tags: ["Healing Buds", "Franchise", "Portugal", "Dr. Green"],
    author: "Healing Buds Editorial",
    date: "Nov 25, 2024",
    content: [
      "Scott, the successful entrepreneur behind Cooley's Irish Bar and the popular Sunset Tours operation in Portugal, has announced an exciting new venture into the regulated medical cannabis industry through a partnership with Dr. Green License.",
      "Having built a reputation for exceptional hospitality and tourism experiences in the Algarve region, Scott is now leveraging his business acumen to offer exclusive franchise opportunities for locals, startups, and dropshippers looking to enter the medical marijuana sector.",
      "The franchise model, overseen by Dr. Green's EU GMP certified license, provides a turnkey solution for aspiring entrepreneurs who want to participate in the cannabis industry without the traditional barriers of multi-million dollar facility investments and complex regulatory compliance.",
      "'I've spent years building businesses that bring joy to people,' Scott explained. 'Now I'm excited to help others build their own futures in an industry that genuinely helps patients. The Dr. Green License framework makes this accessible to everyday entrepreneurs.'",
      "The program offers comprehensive support including business mentorship, technology infrastructure powered by Budstacks, and direct access to Dr. Green's compliant supply chain and distribution network."
    ],
  },
  {
    id: "university-competition-cannabis-innovation",
    category: "Healing Buds",
    title: "Healing Buds Launches €500,000 University Competition: Funding Future Cannabis Industry Leaders",
    description: "Students in Business Studies, Computer Science, Marketing, and Bio Science can compete for shares, funding, and career opportunities in the regulated cannabis sector.",
    image: researchLab,
    featured: false,
    tags: ["Healing Buds", "University", "Innovation", "Funding"],
    author: "Healing Buds Editorial",
    date: "Nov 22, 2024",
    content: [
      "Healing Buds Global, in partnership with Dr. Green and Budstacks, has announced a landmark €500,000 university competition designed to identify and nurture the next generation of cannabis industry leaders.",
      "The competition is open to students across multiple disciplines including Business Studies, Computer Science, Marketing, Bio Science, Pharmaceutical Sciences, and Agricultural Technology. Winners will receive funding, equity shares in participating ventures, and guaranteed career pathways.",
      "Dr. Jaspreet Patti, Medical Director at Dr. Green, stated: 'The cannabis industry needs fresh perspectives and innovative thinking. By engaging with universities, we're building a talent pipeline that will drive our industry forward responsibly and scientifically.'",
      "Participating students will have the opportunity to work on real-world challenges including blockchain traceability systems, patient outcome research, sustainable cultivation methods, and market expansion strategies.",
      "Beyond prize money, top performers will be offered roles within the Healing Buds and Dr. Green ecosystem, with equity participation that allows them to share in the success they help create. This represents a paradigm shift in how the cannabis industry approaches talent development and stakeholder engagement."
    ],
  },
  {
    id: "dr-green-franchise-opportunity-announcement",
    category: "Dr. Green",
    title: "Dr. Green License Opens Doors: New Franchise Model Enables Compliant Cannabis Entrepreneurship",
    description: "Revolutionary franchise structure allows entrepreneurs to operate under Dr. Green's EU GMP certification without traditional investment barriers.",
    image: productionFacility,
    featured: false,
    tags: ["Dr. Green", "Franchise", "Healing Buds", "Business"],
    author: "Dr. Green",
    date: "Nov 18, 2024",
    content: [
      "Dr. Green has unveiled a revolutionary franchise model that democratizes access to the regulated cannabis industry, allowing entrepreneurs to operate under its prestigious EU GMP certification without the traditional multi-million dollar investment typically required.",
      "The program, developed in collaboration with technology partner Budstacks and showcase brand Healing Buds Global, provides franchisees with everything needed to succeed: compliant product supply, blockchain-verified traceability, payment processing, and ongoing operational support.",
      "Maximillian White, founder of Dr. Green, explained the vision: 'We've spent years building the infrastructure, the licenses, the technology. Now we're opening those doors to people who share our passion but lack the capital to start from scratch. This is how we change the world.'",
      "Franchise packages are structured to accommodate various entry points, from individual dropshippers to established businesses looking to add compliant cannabis offerings. All operations benefit from Dr. Green's seed-to-patient traceability and regulatory framework.",
      "The announcement has generated significant interest from entrepreneurs across Europe, with particular enthusiasm from Portugal's growing startup ecosystem and expatriate business community."
    ],
  },
  {
    id: "budstacks-white-label-cannabis-saas",
    category: "Technology",
    title: "Budstacks Unveils White-Label Cannabis SaaS Platform: Powering the Next Generation of Compliant Operations",
    description: "The agency behind Healing Buds' technology stack releases enterprise platform enabling rapid deployment of compliant cannabis businesses worldwide.",
    image: awardHq,
    featured: false,
    tags: ["Budstacks", "Technology", "Healing Buds", "SaaS"],
    author: "Budstacks",
    date: "Nov 15, 2024",
    content: [
      "Budstacks, the technology agency powering Healing Buds Global's digital infrastructure, has announced the general availability of its white-label cannabis SaaS platform, enabling entrepreneurs and enterprises to launch compliant cannabis operations rapidly.",
      "The comprehensive platform includes web and mobile application development, integrated payment processing compliant with cannabis industry requirements, customer support systems, and NFT-based franchise management tools.",
      "Healing Buds Global serves as the flagship demonstration of Budstacks' capabilities, showcasing how the platform enables end-to-end operations from patient onboarding to product delivery, all with blockchain-verified compliance.",
      "'We built Healing Buds as proof of what's possible,' said a Budstacks spokesperson. 'Now any entrepreneur with the right license framework, like Dr. Green provides, can deploy the same caliber of technology within weeks rather than years.'",
      "The platform's NFT franchising module is particularly innovative, using blockchain technology to manage franchise agreements, revenue sharing, and compliance verification in a transparent and auditable manner."
    ],
  },
  {
    id: "marlon-wayans-dr-green",
    category: "Cannabis",
    title: "Marlon Wayans Talks Selling Weed On The Blockchain: Is Dr. Green Legit?",
    description: "Actor and comedian Marlon Wayans, famous for his roles in iconic films like Scary Movie, has transitioned his lifelong relationship with cannabis into a purposeful partnership with Dr. Green NFT.",
    image: newsMarlonWayans,
    featured: false,
    externalLink: "https://drgreennft.com/news/marlon-wayans-talks-selling-weed-on-the-blockchain-is-dr-green-legit-he-isnt-afraid-to-answer-the-tough-questions",
    tags: ["Cannabis", "Dr. Green", "Healing Buds"],
    author: "Dr. Green",
    date: "Oct 15, 2024",
    content: [
      "Actor and comedian Marlon Wayans, famous for his roles in iconic films like Scary Movie, has transitioned his lifelong relationship with cannabis into a purposeful partnership with Dr. Green NFT.",
      "In a candid conversation, Wayans shares how cannabis has evolved from youthful indulgence to a source of creativity, relaxation, and wellness in his daily life.",
      "When asked about his decision to partner with Dr. Green, Wayans explained that he's been offered many deals over the years, but Dr. Green stood out because they actually know what they're talking about.",
      "The partnership represents a significant step forward in bringing mainstream recognition to blockchain-based cannabis ventures, combining entertainment industry influence with cutting-edge technology.",
      "Wayans joins a growing roster of high-profile advocates supporting Dr. Green's mission to bring transparency and legitimacy to the global cannabis industry through blockchain technology and proper regulation."
    ],
  },
  {
    id: "unlocking-future-nft-minting",
    category: "Dr. Green",
    title: "Unlocking the Future: Next Steps After Minting Your NFT",
    description: "Minting your NFT is just the beginning of your journey into a revolutionary platform that combines blockchain technology with the medical cannabis industry.",
    image: newsNftMinting,
    featured: false,
    externalLink: "https://drgreennft.com/news/unlocking-the-future-next-steps-after-minting-your-nft",
    tags: ["Dr. Green", "NFT", "Healing Buds"],
    author: "Dr. Green",
    date: "Sep 20, 2024",
    content: [
      "Minting your NFT is just the beginning of your journey into a revolutionary platform that combines blockchain technology with the medical cannabis industry.",
      "We're excited to share the next phases of our roadmap, designed to empower NFT holders to access and benefit from our cutting-edge admin centre for the Dr Green dropshipping platform for medical cannabis.",
      "The platform enables keyholders to participate in the regulated cannabis ecosystem without ever handling or selling cannabis themselves.",
      "Smart contracts calculate and distribute rewards to keyholders based on the blockchain activity generated through the platform.",
      "With partners like Healing Buds Global demonstrating the full potential of the ecosystem, NFT holders can see exactly how their participation contributes to building a compliant, global cannabis infrastructure."
    ],
  },
  {
    id: "ricardo-capone-spotlight",
    category: "Dr. Green",
    title: "Sniper Spotlight with Ricardo Capone from Dr. Green Cannabis",
    description: "For the last five years, we've been involved heavily in the medical cannabis space in Portugal. We have facilities where we grow medical cannabis for distribution to institutions.",
    image: newsRicardoCapone,
    featured: false,
    externalLink: "https://drgreennft.com/news/sniper-spotlight-with-ricardo-capone-from-dr-green-canabis",
    tags: ["Dr. Green", "NFT", "Medical Cannabis", "Healing Buds"],
    author: "Dr. Green",
    date: "Sep 9, 2024",
    content: [
      "For the last five years, we've been involved heavily in the medical cannabis space in Portugal. We have facilities where we grow medical cannabis for distribution to institutions that utilize it.",
      "Conditions like multiple sclerosis, epilepsy, and Parkinson's disease — these issues can be treated with cannabis because the problem is usually in the endocannabinoid system in the human body.",
      "We develop different technologies, and our primary focus has been biotechnology. If we have a patient, we'll take a swab of their mouth and analyze the DNA structure of the person, and we can see where the breakdown is that's causing them to have a problem.",
      "We have a strain library with around 2,100 strains analyzed across 50,000 seeds, and what it tells us is the nuclear genetics and the mitochondrial genetics of the plant.",
      "Our work with Healing Buds Global represents the practical application of this research, bringing personalized cannabis medicine to patients through a fully compliant, technologically advanced platform."
    ],
  },
  {
    id: "ricardo-capone-pioneering",
    category: "Dr. Green",
    title: "Ricardo Capone: Pioneering Technological Solutions in the Cannabis Industry",
    description: "Financial setbacks have never deterred billionaire Maximillian White. After losing $39 million in the Cypriot banking collapse, White turned his resilience into a new venture.",
    image: newsRicardoTech,
    featured: false,
    externalLink: "https://drgreennft.com/news/ricardo-capone-pioneering-technological-solutions-in-the-cannabis-industry",
    tags: ["Dr. Green", "Healing Buds"],
    author: "Dr. Green",
    date: "Aug 28, 2024",
    content: [
      "Financial setbacks have never deterred billionaire Maximillian White. After losing $39 million in the Cypriot banking collapse, White turned his resilience into a new venture: the cannabis industry.",
      "Working alongside CTO Ricardo Capone, they have built a technology-first approach to medical cannabis that prioritizes compliance, traceability, and patient outcomes.",
      "The team's focus on biotechnology and plant genomics has positioned Dr. Green as a leader in personalized cannabis medicine.",
      "Brands like Healing Buds Global now leverage this technological foundation to deliver exceptional patient experiences while maintaining the highest regulatory standards.",
    ],
  },
  {
    id: "maximillian-white-elon-musk-weed",
    category: "Dr. Green",
    title: "Maximillian White 'Elon Musk of weed' will legalise cannabis around the world",
    description: "Billionaire Maximillian White dubbed the 'Elon Musk of weed' vouches to legalise marijuana around the globe. The founder of Dr. Green aims to be the number-one supplier.",
    image: newsMaxWhite,
    featured: false,
    externalLink: "https://drgreennft.com/news/maximillian-white-elon-musk-of-weed-will-legalise-cannabis-around-the-world",
    tags: ["Cannabis", "Dr. Green", "Healing Buds"],
    author: "Dr. Green",
    date: "Aug 15, 2024",
    content: [
      "Billionaire Maximillian White dubbed the 'Elon Musk of weed' vouches to legalise marijuana around the globe.",
      "The founder of Dr. Green aims to be the number-one supplier of recreational cannabis around the world, with a vision that combines regulatory compliance with global accessibility.",
      "White's approach focuses on building trust through transparency, utilizing blockchain technology to ensure every product can be traced from seed to sale.",
      "Partners like Healing Buds Global exemplify this vision, demonstrating how compliant operations can scale while maintaining the highest standards of patient care and product quality.",
    ],
  },
  {
    id: "shaggy-brown-joins-dr-green",
    category: "Dr. Green",
    title: "From Hollywood's 'Weed Man' to Regulatory Pioneer: Shaggy Brown Joins Dr Green",
    description: "From Hollywood's trusted 'weed man to the stars' to global cannabis pioneer, Shaggy Brown has spent 25+ years curating the highest-quality cannabis for icons like Tyson, Snoop, and DMX.",
    image: newsShaggyBrown,
    featured: false,
    externalLink: "https://drgreennft.com/news/from-hollywoods-weed-man-to-regulatory-pioneer-shaggy-brown-joins-forces-with-dr-green",
    tags: ["Dr. Green", "Healing Buds"],
    author: "Dr. Green",
    date: "Sep 16, 2024",
    content: [
      "From Hollywood's trusted 'weed man to the stars' to global cannabis pioneer, Shaggy Brown has spent 25+ years curating the highest-quality cannabis for icons like Tyson, Snoop, and DMX.",
      "Now, he's partnering with Dr Green to bring that same integrity to a transparent, blockchain-powered future.",
      "Brown's expertise in sourcing and quality control complements Dr. Green's technological infrastructure, creating a powerful combination for the regulated cannabis market.",
      "His involvement strengthens the entire ecosystem, including brands like Healing Buds Global that rely on premium product quality and authentic expertise.",
    ],
  },
];
