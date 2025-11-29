import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";
import ScrollAnimation from "@/components/ScrollAnimation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Globe, 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp,
  MapPin,
  Award,
  ArrowRight
} from "lucide-react";
import clinicPortugal from "@/assets/clinic-portugal.jpg";
import conferenceHq from "@/assets/conference-hq.jpg";

const ScottFranchiseStory = () => {
  const opportunities = [
    {
      title: "Local Entrepreneurs",
      description: "Portuguese locals looking to enter the regulated cannabis market with full support and compliance framework.",
      icon: MapPin,
    },
    {
      title: "Startups",
      description: "Tech-forward startups wanting to integrate cannabis solutions into their business models.",
      icon: TrendingUp,
    },
    {
      title: "Dropshippers",
      description: "E-commerce entrepreneurs seeking compliant cannabis dropshipping opportunities.",
      icon: Globe,
    },
    {
      title: "Hospitality Businesses",
      description: "Bars, restaurants, and tourism operators looking to diversify into wellness and medical cannabis.",
      icon: Building2,
    },
  ];

  const educationPartners = [
    { field: "Business Studies", focus: "Franchise management, compliance, operations" },
    { field: "Computer Science", focus: "Blockchain, traceability systems, platform development" },
    { field: "Marketing", focus: "Patient acquisition, brand building, market research" },
    { field: "Bio Science", focus: "Cannabinoid research, strain development, patient outcomes" },
    { field: "Pharmaceutical Sciences", focus: "Product formulation, quality control, clinical applications" },
    { field: "Agricultural Technology", focus: "Sustainable cultivation, yield optimization" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          {/* Hero Section */}
          <section className="relative h-[500px] md:h-[600px] overflow-hidden">
            <img
              src={clinicPortugal}
              alt="Portugal Cannabis Opportunity"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <ScrollAnimation>
                <div className="max-w-2xl">
                  <Badge className="mb-4 bg-primary/90 text-primary-foreground rounded-full px-4 py-1">
                    Success Story
                  </Badge>
                  <h1 className="font-pharma text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                    From Irish Pub to<br />Cannabis Pioneer
                  </h1>
                  <p className="font-geist text-lg text-muted-foreground mb-8 leading-relaxed">
                    How Scott of Cooley's Irish Bar and Sunset Tours is opening doors 
                    for entrepreneurs to join Portugal's regulated cannabis revolution.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/contact">
                      <Button size="lg" className="rounded-full gap-2">
                        Explore Opportunities
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/the-wire/scott-cooley-sunset-tours-franchise">
                      <Button variant="outline" size="lg" className="rounded-full">
                        Read Full Story
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Scott's Journey */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimation>
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <h2 className="font-pharma text-3xl sm:text-4xl font-bold text-foreground mb-6">
                    The Entrepreneurial Journey
                  </h2>
                  <p className="font-geist text-lg text-muted-foreground leading-relaxed">
                    Scott built Cooley's Irish Bar into a beloved establishment in Portugal's Algarve region. 
                    His Sunset Tours operation became legendary among tourists seeking authentic experiences. 
                    Now, he's channeling that same entrepreneurial spirit into the regulated cannabis industry.
                  </p>
                </div>
              </ScrollAnimation>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollAnimation delay={0.1}>
                  <Card className="p-8 text-center h-full">
                    <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-pharma text-xl font-semibold mb-3">Cooley's Irish Bar</h3>
                    <p className="font-geist text-muted-foreground">
                      A decade of hospitality excellence, building community and reputation 
                      in Portugal's expatriate and local scene.
                    </p>
                  </Card>
                </ScrollAnimation>
                <ScrollAnimation delay={0.2}>
                  <Card className="p-8 text-center h-full">
                    <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-pharma text-xl font-semibold mb-3">Sunset Tours</h3>
                    <p className="font-geist text-muted-foreground">
                      Creating unforgettable experiences for visitors, mastering the art 
                      of customer service and operational excellence.
                    </p>
                  </Card>
                </ScrollAnimation>
                <ScrollAnimation delay={0.3}>
                  <Card className="p-8 text-center h-full border-primary/50 bg-primary/5">
                    <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-pharma text-xl font-semibold mb-3">Dr. Green Partnership</h3>
                    <p className="font-geist text-muted-foreground">
                      Leveraging EU GMP certification and blockchain technology to 
                      offer compliant cannabis franchise opportunities.
                    </p>
                  </Card>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* Opportunities */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimation>
                <div className="text-center mb-16">
                  <h2 className="font-pharma text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    Exclusive Opportunities
                  </h2>
                  <p className="font-geist text-lg text-muted-foreground max-w-2xl mx-auto">
                    The Dr. Green License framework opens doors for diverse entrepreneurs 
                    to participate in Portugal's regulated cannabis market.
                  </p>
                </div>
              </ScrollAnimation>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {opportunities.map((opp, index) => (
                  <ScrollAnimation key={index} delay={index * 0.1}>
                    <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                      <opp.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="font-pharma text-lg font-semibold mb-2">{opp.title}</h3>
                      <p className="font-geist text-sm text-muted-foreground">{opp.description}</p>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>

          {/* University Partnership */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollAnimation>
                  <div>
                    <Badge className="mb-4 bg-secondary/20 text-secondary rounded-full px-4 py-1">
                      Education Partnership
                    </Badge>
                    <h2 className="font-pharma text-3xl sm:text-4xl font-bold text-foreground mb-6">
                      University Competition & Funding
                    </h2>
                    <p className="font-geist text-lg text-muted-foreground mb-6 leading-relaxed">
                      We're partnering with universities to identify and nurture the next generation 
                      of cannabis industry leaders. Students can compete for €500,000 in funding, 
                      equity shares, and guaranteed career pathways.
                    </p>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <span className="font-geist text-sm">€500,000 Prize Pool</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <span className="font-geist text-sm">Equity Participation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-geist text-sm">Career Pathways</span>
                      </div>
                    </div>
                    <Link to="/the-wire/university-competition-cannabis-innovation">
                      <Button className="rounded-full gap-2">
                        Learn About the Competition
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation delay={0.2}>
                  <div className="grid grid-cols-2 gap-4">
                    {educationPartners.map((partner, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-pharma text-sm font-semibold text-foreground mb-1">
                          {partner.field}
                        </h4>
                        <p className="font-geist text-xs text-muted-foreground">
                          {partner.focus}
                        </p>
                      </Card>
                    ))}
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* Powered By Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimation>
                <div className="text-center mb-12">
                  <h2 className="font-pharma text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    Powered by Industry Leaders
                  </h2>
                  <p className="font-geist text-lg text-muted-foreground max-w-2xl mx-auto">
                    This opportunity is made possible through strategic partnerships 
                    with the best in technology, compliance, and cannabis expertise.
                  </p>
                </div>
              </ScrollAnimation>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollAnimation delay={0.1}>
                  <Card className="p-8 text-center">
                    <h3 className="font-pharma text-xl font-bold text-primary mb-3">Dr. Green License</h3>
                    <p className="font-geist text-muted-foreground">
                      EU GMP certified compliance framework ensuring all operations meet 
                      the highest regulatory standards.
                    </p>
                  </Card>
                </ScrollAnimation>
                <ScrollAnimation delay={0.2}>
                  <Card className="p-8 text-center">
                    <h3 className="font-pharma text-xl font-bold text-primary mb-3">Budstacks</h3>
                    <p className="font-geist text-muted-foreground">
                      Cutting-edge SaaS platform providing web development, payment processing, 
                      and NFT franchising technology.
                    </p>
                  </Card>
                </ScrollAnimation>
                <ScrollAnimation delay={0.3}>
                  <Card className="p-8 text-center">
                    <h3 className="font-pharma text-xl font-bold text-primary mb-3">Healing Buds Global</h3>
                    <p className="font-geist text-muted-foreground">
                      The flagship example of what's possible when technology, compliance, 
                      and patient care come together.
                    </p>
                  </Card>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-primary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimation>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="font-pharma text-3xl sm:text-4xl font-bold text-foreground mb-6">
                    Ready to Change the World?
                  </h2>
                  <p className="font-geist text-lg text-muted-foreground mb-8">
                    Whether you're a local entrepreneur, startup founder, university student, 
                    or established business owner, there's an opportunity waiting for you.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/contact">
                      <Button size="lg" className="rounded-full gap-2">
                        Get in Touch
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/the-wire">
                      <Button variant="outline" size="lg" className="rounded-full">
                        Read More Stories
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </section>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default ScottFranchiseStory;
