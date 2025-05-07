
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Award, Gem, Search, ShieldCheck, Sparkles, ShoppingBag, Star, Heart, Tag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GoldsmithIcon } from '@/components/icons/goldsmith-icon';


export default function Home() {
  const categories = [
    { name: 'Rings', icon: <Gem className="h-8 w-8" />, href: '/category/rings', dataAiHint: "gold rings" },
    { name: 'Necklaces', icon: <Sparkles className="h-8 w-8" />, href: '/category/necklaces', dataAiHint: "diamond necklace" },
    { name: 'Earrings', icon: <Heart className="h-8 w-8" />, href: '/category/earrings', dataAiHint: "pearl earrings" },
    { name: 'Bracelets', icon: <ShoppingBag className="h-8 w-8" />, href: '/category/bracelets', dataAiHint: "silver bracelet" },
  ];

  const featuredProducts = [
    { id: 'fp1', name: 'The Elysian Diamond Ring', price: '$1,250', imageUrl: 'https://picsum.photos/seed/elysian-ring/600/600', dataAiHint: "diamond ring" },
    { id: 'fp2', name: 'Aurora Gold Pendant', price: '$890', imageUrl: 'https://picsum.photos/seed/aurora-pendant/600/600', dataAiHint: "gold pendant" },
    { id: 'fp3', name: 'Celestial Pearl Earrings', price: '$670', imageUrl: 'https://picsum.photos/seed/celestial-earrings/600/600', dataAiHint: "pearl earrings" },
    { id: 'fp4', name: 'Infinity Silver Bracelet', price: '$450', imageUrl: 'https://picsum.photos/seed/infinity-bracelet/600/600', dataAiHint: "silver bracelet" },
  ];

  const newArrivals = [
    { id: 'na1', name: 'Orion Star Necklace', price: '$950', imageUrl: 'https://picsum.photos/seed/orion-necklace/600/600', dataAiHint: "star necklace" },
    { id: 'na2', name: 'Nova Stud Earrings', price: '$320', imageUrl: 'https://picsum.photos/seed/nova-earrings/600/600', dataAiHint: "stud earrings" },
    { id: 'na3', name: 'Helios Signet Ring', price: '$780', imageUrl: 'https://picsum.photos/seed/helios-ring/600/600', dataAiHint: "signet ring" },
  ];

  const brandPromises = [
    { icon: <Award className="h-10 w-10 text-primary" />, title: "Impeccable Craftsmanship", description: "Each piece meticulously handcrafted by skilled artisans." },
    { icon: <ShieldCheck className="h-10 w-10 text-primary" />, title: "Certified Authenticity", description: "Ethically sourced materials and certified quality guaranteed." },
    { icon: <Sparkles className="h-10 w-10 text-primary" />, title: "Timeless Designs", description: "Exquisite jewelry that transcends trends, cherished for generations." },
  ];

  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-secondary/30 to-background py-16 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                Elegance Redefined.
                <br />
                <span className="text-primary">Craftsmanship Unmatched.</span>
              </h1>
              <p className="max-w-lg text-foreground/80 md:text-xl leading-relaxed mx-auto md:mx-0">
                Discover exquisite gold and silver ornaments, handcrafted for your timeless moments. Find the perfect piece that tells your story.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 mx-auto md:mx-0">
                <Link
                  href="/discover"
                  className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5")}
                >
                  Explore Collections <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/#categories"
                  className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), "shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5 border-primary text-primary hover:bg-primary/10")}
                >
                  Shop by Category
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-auto md:aspect-[4/3] group">
              <Image
                src="https://picsum.photos/seed/jewelry-hero/800/600"
                alt="Luxury Jewelry Collection"
                layout="fill"
                objectFit="cover"
                className="rounded-xl shadow-2xl border-2 border-primary/20 transition-transform duration-500 group-hover:scale-105"
                data-ai-hint="luxury jewelry lifestyle"
                priority
              />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section id="categories" className="w-full py-12 md:py-16 lg:py-20 bg-secondary/20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Shop by Category</h2>
          <p className="max-w-2xl mx-auto text-foreground/70 md:text-lg mb-8 md:mb-10">
            Find your perfect piece from our curated collections.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <Card className="bg-card/70 hover:bg-card shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-transparent hover:border-primary/30">
                  <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                    <div className="p-4 bg-primary/10 text-primary rounded-full mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {category.icon}
                    </div>
                    <CardTitle className="text-md md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Our Signature Pieces</h2>
          <p className="max-w-2xl mx-auto text-foreground/70 md:text-lg mb-8 md:mb-10">
            Handpicked designs that embody elegance and artistry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-border/20 rounded-xl">
                <CardHeader className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={product.dataAiHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 text-left">
                  <CardTitle className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                  <p className="text-primary font-medium text-md mb-2">{product.price}</p>
                  <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full text-xs py-2">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-secondary/30">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">The Goldsmith Connect Promise</h2>
          <p className="max-w-2xl mx-auto text-foreground/70 md:text-lg mb-8 md:mb-10">
            Experience the pinnacle of quality and design with every creation.
          </p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {brandPromises.map((promise) => (
              <div key={promise.title} className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg border border-primary/10">
                {promise.icon}
                <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">{promise.title}</h3>
                <p className="text-sm text-foreground/70">{promise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Fresh From The Anvil</h2>
          <p className="max-w-2xl mx-auto text-foreground/70 md:text-lg mb-8 md:mb-10">
            Explore our latest creations, designed to inspire and enchant.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {newArrivals.map((product) => (
               <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-border/20 rounded-xl">
                <CardHeader className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={product.dataAiHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 text-left">
                  <CardTitle className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                  <p className="text-primary font-medium text-md mb-2">{product.price}</p>
                   <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full text-xs py-2">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-8 md:mt-10">
              <Link
                 href="/discover?filter=new"
                 className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow")}
               >
                 View All New Arrivals
               </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-secondary/20 border-t border-border/10">
        <div className="container text-center max-w-2xl px-4 md:px-6">
           <Sparkles className="h-10 w-10 mx-auto text-primary mb-2" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Stay Golden
          </h2>
          <p className="text-foreground/70 md:text-lg mb-6">
            Subscribe for exclusive offers, new arrivals, and insider jewelry tips from Goldsmith Connect.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow text-base shadow-sm focus:ring-2 focus:ring-primary" 
              aria-label="Email for newsletter"
            />
            <Button type="submit" size="lg" className="shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
