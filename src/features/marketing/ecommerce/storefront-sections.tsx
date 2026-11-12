"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CreditCard,
  Headphones,
  PackageCheck,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import { StoreProductCard } from "./store-product-card";
import { journalArticles, storeMoney, storeProducts, type StoreProduct } from "./data";
import "./storefront-effects.css";

const images = {
  headphones: "/images/marketing/store/headphones.webp",
  speaker: "/images/marketing/store/speaker.webp",
  watch: "/images/marketing/store/watch.webp",
  controller: "/images/marketing/store/controller.webp",
  campaign: "/images/marketing/store/campaign.webp",
  earbuds: "/images/marketing/store/earbuds.webp",
  keyboard: "/images/marketing/store/keyboard.webp",
  lamp: "/images/marketing/store/lamp.webp",
  mouse: "/images/marketing/store/mouse.webp",
};
export const collection: StoreProduct[] = [
  ...storeProducts.map((product) => ({
    ...product,
    image: images[product.id as keyof typeof images],
    color: (
      {
        headphones: "Lavender",
        speaker: "Coral",
        watch: "Navy",
        controller: "Ivory",
      } as Record<string, string>
    )[product.id],
  })),
  {
    id: "earbuds",
    name: "Air wireless earbuds",
    category: "Audio",
    price: 89,
    original: 119,
    image: images.earbuds,
    label: "New arrival",
    color: "Lilac",
    description: "A lighter way to take your favorite sounds with you. Illustrative product.",
  },
  {
    id: "keyboard",
    name: "Form mechanical keyboard",
    category: "Workspace",
    price: 119,
    original: 149,
    image: images.keyboard,
    label: "The desk edit",
    color: "Ivory",
    description:
      "A tactile everyday keyboard with a considered compact silhouette. Illustrative product.",
  },
  {
    id: "lamp",
    name: "Dome ambient desk lamp",
    category: "Workspace",
    price: 69,
    original: 89,
    image: images.lamp,
    label: "Warm & welcoming",
    color: "Coral",
    description:
      "A softer light for your desk, side table, or favorite corner. Illustrative product.",
  },
  {
    id: "mouse",
    name: "Contour wireless mouse",
    category: "Workspace",
    price: 49,
    original: 65,
    image: images.mouse,
    label: "Little essentials",
    color: "Lavender",
    description: "A smooth, simple silhouette for your everyday workspace. Illustrative product.",
  },
];
const categories = [
  { name: "Headphones", category: "Audio", image: images.headphones },
  { name: "Speakers", category: "Audio", image: images.speaker },
  { name: "Smart watches", category: "Wearables", image: images.watch },
  { name: "Controllers", category: "Gaming", image: images.controller },
  { name: "Work essentials", category: "Workspace", image: images.keyboard },
  { name: "Everyday tech", category: "All", image: images.earbuds },
];
const reviews = [
  {
    name: "Priya Shah",
    role: "Design enthusiast",
    image: "/images/sales-team/priya-shah.webp",
    quote:
      "The little details make all the difference. A beautifully curated collection, and a shopping experience that feels just as considered.",
  },
  {
    name: "Daniel Kim",
    role: "Creative professional",
    image: "/images/sales-team/daniel-kim.webp",
    quote:
      "My workspace finally feels like me. Quiet colors, useful objects, and the kind of essentials you look forward to using every day.",
  },
  {
    name: "Alex Morgan",
    role: "Everyday explorer",
    image: "/images/sales-team/alex-morgan.webp",
    quote:
      "Simple, useful, and a little unexpected. I came for a pair of headphones and left with a whole new perspective on my desk.",
  },
];
function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-accent">
          <span className="size-1 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h2 className="text-[20px] font-semibold leading-tight tracking-tight sm:text-[24px]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
function DealClock() {
  const [seconds, setSeconds] = useState(2 * 86400 + 8 * 3600 + 24 * 60);
  useEffect(() => {
    const deadline = Date.now() + (2 * 86400 + 8 * 3600 + 24 * 60) * 1000;
    const timer = window.setInterval(
      () => setSeconds(Math.max(0, Math.floor((deadline - Date.now()) / 1000))),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  const parts = [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
  return (
    <div role="timer" aria-label="Illustrative offer countdown" className="mt-5 flex gap-2">
      {parts.map((value, index) => (
        <span
          key={index}
          className="grid size-12 place-content-center rounded-full border border-border bg-surface text-center"
        >
          <strong className="text-[14px] font-semibold tabular-nums">
            {String(value).padStart(2, "0")}
          </strong>
          <span className="text-[8px] uppercase text-muted">
            {["Days", "Hours", "Mins", "Secs"][index]}
          </span>
        </span>
      ))}
    </div>
  );
}
export function StorefrontSections({
  query,
  wishlist,
  wishesOnly,
  category,
  setCategory,
  onBrowse,
  onWish,
  onAdd,
  onPreview,
  notice,
}: {
  query: string;
  wishlist: string[];
  wishesOnly: boolean;
  category: string;
  setCategory: (value: string) => void;
  onBrowse: (category?: string) => void;
  onWish: (product: StoreProduct) => void;
  onAdd: (product: StoreProduct) => void;
  onPreview: (product: StoreProduct) => void;
  notice: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            observer.unobserve(entry.target);
            return;
          }
          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(22px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    root.current
      .querySelectorAll("section:not(:first-child) > div, .store-category-grid > button")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const [tab, setTab] = useState("Best sellers");
  const [slide, setSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!heroPaused && !motion.matches && !document.hidden) {
        timer = setInterval(() => setSlide((current) => (current + 1) % 4), 4500);
      }
    };
    sync();
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [heroPaused, slide]);
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [review, setReview] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const ordered =
    tab === "New arrivals"
      ? [...collection].reverse()
      : tab === "Special offers"
        ? [...collection].sort(
            (a, b) => (b.original - b.price) / b.original - (a.original - a.price) / a.original,
          )
        : collection;
  const products = ordered.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()) &&
      (!wishesOnly || wishlist.includes(product.id)),
  );
  const featured = collection[slide];
  const card = (product: StoreProduct, key: string) => (
    <StoreProductCard
      key={key}
      product={product}
      wished={wishlist.includes(product.id)}
      onWish={() => onWish(product)}
      onAdd={() => onAdd(product)}
      onPreview={() => onPreview(product)}
    />
  );
  return (
    <div ref={root} className="store-experience bg-surface text-foreground">
      <section className="store-hero relative overflow-hidden py-12 sm:py-16">
        <span className="store-hero-orbit" aria-hidden="true" />
        <MarketingContainer className="grid items-center gap-8 md:grid-cols-2">
          <div className="store-hero-copy max-w-[490px]">
            <p className="mb-3 text-[12px] font-medium text-accent">
              Better things for your everyday.
            </p>
            <h1 className="text-[32px] font-semibold leading-[1.17] tracking-tight sm:text-[44px]">
              Extraordinary essentials.
              <br />
              Made for <span className="relative text-accent">your world.</span>
            </h1>
            <p className="mt-4 max-w-[360px] text-[13px] leading-6 text-muted">
              A fresh perspective on the things you use most. Discover thoughtful tech in colors
              that feel like you.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <div>
                <span className="block text-[10px] text-muted">The everyday edit, from</span>
                <strong className="text-[24px] font-semibold">
                  {storeMoney(featured.price)}
                  <span className="text-[12px]">.00</span>
                </strong>
              </div>
              <Button
                variant="dark"
                onClick={() => onBrowse(featured.category)}
                className="rounded-full! px-5!"
              >
                Shop the edit
                <ArrowUpRight size={14} />
              </Button>
            </div>
            <div className="store-hero-proof">
              <div className="flex">
                {reviews.map((person) => (
                  <Image key={person.name} src={person.image} alt="" width={28} height={28} />
                ))}
              </div>
              <div>
                <span className="flex gap-0.5 text-accent">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={10} fill="currentColor" />
                  ))}
                </span>
                <span className="mt-1 block text-[10px] text-muted">
                  Good company. Thoughtful essentials.
                </span>
              </div>
            </div>
          </div>
          <div
            className="store-hero-stage relative mx-auto w-full max-w-[430px]"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
            onFocusCapture={() => setHeroPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setHeroPaused(false);
            }}
          >
            <div className="absolute inset-3 -rotate-3 rounded-[36px] border border-dashed border-accent/30" />
            <div className="relative overflow-hidden rounded-[30px] border-[7px] border-surface bg-accent/10">
              <Image
                key={featured.id}
                src={featured.image}
                alt={featured.name}
                width={560}
                height={560}
                priority
                className="aspect-square w-full object-cover"
              />
            </div>
            <span className="store-float-note store-float-note--top">
              <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
                <Headphones size={16} />
              </span>
              <span>
                <strong className="block text-[11px] font-semibold">Made for your rhythm</strong>
                <span className="text-[10px] text-muted">The everyday collection</span>
              </span>
            </span>
            <span className="store-float-note store-float-note--side">
              <Check size={16} className="text-success" />
              <span>
                <strong className="block text-[11px] font-semibold">Thoughtfully selected</strong>
                <span className="text-[10px] text-muted">Small details. Big difference.</span>
              </span>
            </span>
            <button
              onClick={() => onPreview(featured)}
              className="absolute bottom-5 start-0 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-left shadow-sm"
            >
              <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
                <ShoppingBag size={16} />
              </span>
              <span>
                <strong className="block text-[12px] font-medium">{featured.name}</strong>
                <span className="text-[10px] text-muted">Meet your new favorite</span>
              </span>
              <ArrowUpRight size={14} />
            </button>
            <div
              className="absolute end-[-12px] top-1/2 flex -translate-y-1/2 flex-col gap-2"
              aria-label="Hero products"
            >
              {collection.slice(0, 4).map((item, index) => (
                <button
                  key={item.id}
                  aria-label={`Feature ${item.name}`}
                  aria-pressed={slide === index}
                  onClick={() => setSlide(index)}
                  className={`size-2 rounded-full border border-accent ${slide === index ? "bg-accent" : "bg-surface"}`}
                />
              ))}
            </div>
          </div>
        </MarketingContainer>
      </section>
      <div
        className="store-ticker overflow-hidden bg-foreground py-4 text-surface"
        aria-label="Listen, create, connect, unwind, explore, repeat"
      >
        <div className="store-ticker-track text-[16px] font-semibold uppercase tracking-widest">
          {[0, 1].map((copy) => (
            <div key={copy} className="store-ticker-group" aria-hidden="true">
              {["Listen", "Create", "Connect", "Unwind", "Explore", "Repeat"].map((text) => (
                <span key={text} className="flex items-center gap-12 whitespace-nowrap">
                  {text}
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <MarketingContainer>
        <div className="my-8 grid grid-cols-2 rounded-lg border border-border bg-surface p-3 lg:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "Thoughtful delivery",
              text: "Handled with a little extra care",
            },
            {
              icon: Headphones,
              title: "Here to help",
              text: "Support for your everyday",
            },
            {
              icon: PackageCheck,
              title: "Easy returns",
              text: "A little more peace of mind",
            },
            {
              icon: ShieldCheck,
              title: "Shop with confidence",
              text: "A considered store experience",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-accent">
                <Icon size={16} />
              </span>
              <div>
                <h3 className="text-[11px] font-semibold">{title}</h3>
                <p className="mt-1 text-[10px] leading-4 text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </MarketingContainer>
      <section id="categories" className="py-6">
        <MarketingContainer>
          <Heading eyebrow="Find your favorites" title="Browse by category">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous categories"
                onClick={() => setCategoryOffset((value) => (value + 5) % 6)}
              >
                <ArrowLeft size={13} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Next categories"
                onClick={() => setCategoryOffset((value) => (value + 1) % 6)}
              >
                <ArrowRight size={13} />
              </Button>
            </div>
          </Heading>
          <div className="store-category-grid grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories
              .map((_, index) => categories[(index + categoryOffset) % 6])
              .map((item, index) => (
                <button
                  key={`${item.name}-${index}`}
                  onClick={() => onBrowse(item.category)}
                  className="group relative rounded-xl border border-border bg-surface-alt p-1.5 pb-5"
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={220}
                    height={240}
                    className="aspect-[.85] w-full rounded-lg object-cover transition-transform motion-safe:group-hover:scale-[1.03]"
                  />
                  <span className="absolute -bottom-1 left-1/2 w-max max-w-full -translate-x-1/2 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[10px] font-medium">
                    {item.name}
                  </span>
                </button>
              ))}
          </div>
        </MarketingContainer>
      </section>
      <section className="py-10">
        <MarketingContainer className="store-promotions grid gap-4 sm:grid-cols-2">
          {[
            {
              discount: "20%",
              title: "Your soundtrack. Upgraded.",
              image: "/images/marketing/store/promotion-audio-photo.webp",
              alt: "A woman enjoying music with headphones against a soft pink background",
              eyebrow: "The listening edit",
              description: "Find your everyday escape.",
              category: "Audio",
              tone: "bg-accent/5",
            },
            {
              discount: "30%",
              title: "A little more play time.",
              image: "/images/marketing/store/promotion-gaming-photo.webp",
              alt: "A man relaxing on a sofa with a game controller",
              eyebrow: "Make time to unwind",
              description: "A well-earned moment of play.",
              category: "Gaming",
              tone: "bg-blue-500/5",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`group relative min-h-[260px] overflow-hidden rounded-xl border border-border ${item.tone}`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                width={600}
                height={600}
                className="absolute end-0 top-0 h-full w-[52%] object-cover object-[55%_35%]"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 z-[1] w-[57%] bg-surface/95 [mask-image:linear-gradient(to_right,black_85%,transparent)]" />
              <div className="relative z-10 w-[58%] p-5 sm:p-6">
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[.12em] text-accent">
                  {item.eyebrow}
                </p>
                <strong className="flex items-start text-[38px] font-semibold leading-none tracking-tight">
                  {item.discount}
                  <span className="ms-1.5 mt-1 rounded-full border border-accent/20 bg-accent/10 px-1.5 py-1 text-[9px] font-medium uppercase tracking-normal text-accent">
                    off
                  </span>
                </strong>
                <h3 className="mt-3 max-w-[165px] text-[15px] font-semibold leading-5">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[145px] text-[10px] leading-4 text-muted">
                  {item.description}
                </p>
                <Button
                  variant="dark"
                  size="sm"
                  className="mt-5 rounded-full!"
                  onClick={() => onBrowse(item.category)}
                >
                  Shop {item.category.toLowerCase()}
                  <ArrowUpRight size={12} />
                </Button>
              </div>
            </div>
          ))}
        </MarketingContainer>
      </section>
      <section id="products" className="store-catalog scroll-mt-24 py-6">
        <MarketingContainer>
          <Heading
            eyebrow="The considered collection"
            title={
              wishesOnly
                ? "Your saved favorites"
                : query
                  ? `Results for “${query}”`
                  : "Our favorites. Your next essentials."
            }
          >
            <div className="flex flex-wrap gap-1 rounded-full border border-border p-1">
              {["Best sellers", "New arrivals", "Special offers"].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  aria-pressed={tab === item}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-medium ${tab === item ? "bg-foreground text-surface" : "text-muted hover:text-foreground"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Heading>
          <div className="mb-4 flex flex-wrap gap-2">
            {["All", "Audio", "Wearables", "Gaming", "Workspace"].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full px-3 py-1 text-[11px] ${category === item ? "bg-accent/10 text-accent" : "text-muted"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <p role="status" className="mb-2 min-h-4 text-[11px] text-accent">
            {notice}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
            {products.map((product) => card(product, product.id))}
          </div>
          {!products.length && (
            <div className="rounded-lg border border-border py-12 text-center">
              <p className="text-[13px] text-muted">No products match this selection.</p>
              <Button className="mt-3" onClick={() => onBrowse()}>
                Browse everything
              </Button>
            </div>
          )}
        </MarketingContainer>
      </section>
      <section className="py-9">
        <MarketingContainer>
          <Heading eyebrow="Always a good idea" title="The everyday collection">
            <button
              className="flex items-center gap-1 text-[11px] font-medium"
              onClick={() => onBrowse()}
            >
              Shop all essentials
              <ArrowRight size={13} />
            </button>
          </Heading>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {collection
              .slice(0, 4)
              .reverse()
              .map((product) => card(product, `edit-${product.id}`))}
          </div>
        </MarketingContainer>
      </section>
      <section id="how-it-works" className="store-process py-12">
        <MarketingContainer>
          <div className="mb-7 text-center">
            <p className="mb-2 text-[11px] font-medium text-accent">A simple little journey</p>
            <h2 className="text-[24px] font-semibold tracking-tight">
              From discovery to your doorstep.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: SearchIcon,
                title: "Find your favorite",
                text: "Browse thoughtful essentials for your own daily rhythm.",
              },
              {
                icon: CreditCard,
                title: "Make it yours",
                text: "Explore details and build your personal shopping bag.",
              },
              {
                icon: PackageCheck,
                title: "The finishing touches",
                text: "Every small detail is considered, from product to packaging.",
              },
              {
                icon: Truck,
                title: "Enjoy the everyday",
                text: "Make a little room for something you will love using.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="relative rounded-lg border border-border p-4">
                <span className="absolute end-0 top-0 rounded-bl-lg rounded-tr-lg bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
                  0{index + 1}
                </span>
                <Icon size={19} className="mb-3 text-accent" />
                <h3 className="text-[12px] font-semibold">{title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>
      <section className="py-8">
        <MarketingContainer>
          <Heading eyebrow="The current mood" title="What’s trending now" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {collection.slice(0, 4).map((product) => (
              <button
                key={product.id}
                onClick={() => onPreview(product)}
                className="flex items-center gap-3 rounded-lg border border-border p-2 text-left"
              >
                <Image
                  src={product.image}
                  alt=""
                  width={100}
                  height={110}
                  className="h-24 w-20 rounded-md object-cover"
                />
                <span className="min-w-0">
                  <span className="mb-1 flex text-accent">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={9} fill="currentColor" />
                    ))}
                  </span>
                  <strong className="block text-[11px] font-medium leading-4">
                    {product.name}
                  </strong>
                  <span className="mt-2 block text-[12px] font-semibold">
                    {storeMoney(product.price)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </MarketingContainer>
      </section>
      <section id="offers" className="py-10">
        <MarketingContainer>
          <div className="store-weekend-banner relative overflow-hidden rounded-xl border border-border md:min-h-[390px]">
            <span className="store-weekend-pattern" aria-hidden="true" />
            <span className="store-weekend-orbit" aria-hidden="true" />
            <div className="relative z-10 max-w-[490px] p-7 sm:p-10 md:w-[46%]">
              <p className="text-[11px] font-medium">✦ The weekend edit</p>
              <h2 className="mt-4 text-[28px] font-semibold leading-tight">
                Make room for
                <br />
                your next favorite.
              </h2>
              <p className="mt-2 text-[14px] font-semibold text-accent">
                Up to 30% off selected essentials
              </p>
              <DealClock />
              <Button
                variant="dark"
                className="mt-6 rounded-full!"
                onClick={() => {
                  setTab("Special offers");
                  onBrowse();
                }}
              >
                Discover the offers
                <ArrowRight size={13} />
              </Button>
              <p className="mt-3 text-[9px] text-muted">Illustrative promotion and countdown.</p>
            </div>
            <div className="relative z-[2] mx-4 h-[280px] sm:h-[340px] md:absolute md:inset-y-4 md:bottom-0 md:end-4 md:m-0 md:h-auto md:w-[51%]">
              <Image
                src="/images/marketing/store/weekend-shopper-cutout.webp"
                alt="A shopper in an ivory shirt holding colorful shopping bags"
                width={1100}
                height={734}
                className="h-full w-full object-contain object-bottom"
              />
            </div>
          </div>
        </MarketingContainer>
      </section>
      <section className="store-reviews border-y border-border bg-surface-alt/50 py-12">
        <MarketingContainer className="grid items-center gap-6 md:grid-cols-[.7fr_1fr_1fr]">
          <div>
            <p className="text-[11px] text-accent">Good company</p>
            <h2 className="mt-2 text-[24px] font-semibold leading-tight">
              A few kind words
              <br />
              from our community.
            </h2>
            <div className="mt-5 flex gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous reviews"
                onClick={() => setReview((value) => (value + 2) % 3)}
              >
                <ArrowLeft size={13} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Next reviews"
                onClick={() => setReview((value) => (value + 1) % 3)}
              >
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>
          {[reviews[review], reviews[(review + 1) % 3]].map((item) => (
            <figure key={item.name} className="rounded-lg border border-border bg-surface p-5">
              <div className="mb-3 flex gap-0.5 text-accent">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-[12px] leading-6 text-muted">“{item.quote}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-2">
                <Image src={item.image} alt="" width={30} height={30} className="rounded-full" />
                <span className="flex-1">
                  <strong className="block text-[11px] font-medium">{item.name}</strong>
                  <span className="text-[10px] text-muted">{item.role}</span>
                </span>
                <Quote size={24} className="text-accent/40" />
              </figcaption>
            </figure>
          ))}
        </MarketingContainer>
      </section>
      <section id="journal" className="store-journal py-12">
        <MarketingContainer>
          <div className="mb-7 text-center">
            <p className="mb-2 text-[11px] text-accent">The everyday journal</p>
            <h2 className="text-[24px] font-semibold">Ideas for a better everyday.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article>
              <Image
                src={journalArticles[0].image}
                alt={journalArticles[0].alt}
                width={700}
                height={420}
                className="aspect-[1.55] w-full rounded-lg object-cover"
              />
              <p className="mt-3 text-[10px] text-accent">WORKSPACE / 5 MIN READ</p>
              <h3 className="mt-2 text-[18px] font-semibold leading-snug">
                Small changes. A whole new creative space.
              </h3>
              <p className="mt-2 text-[12px] leading-6 text-muted">
                From your morning playlist to a moment of focus, thoughtful objects can bring a new
                rhythm to the everyday.
              </p>
              <button
                onClick={() => onBrowse("Audio")}
                className="mt-3 flex items-center gap-1 text-[11px] font-medium"
              >
                Explore the workspace edit
                <ArrowUpRight size={12} />
              </button>
            </article>
            <div className="grid grid-cols-2 gap-4">
              {collection.slice(0, 4).map((item, index) => (
                <article key={item.id}>
                  <Image
                    src={journalArticles[index + 1].image}
                    alt={journalArticles[index + 1].alt}
                    width={350}
                    height={230}
                    className="aspect-[1.5] w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 text-[9px] text-accent">
                    {["LISTENING", "DESIGN", "DAILY RITUALS", "DOWNTIME"][index]}
                  </p>
                  <h3 className="mt-1 text-[12px] font-semibold leading-5">
                    {
                      [
                        "A soundtrack for your next great idea",
                        "Color, texture, and a little personality",
                        "Less noise. More of what matters.",
                        "The art of switching off",
                      ][index]
                    }
                  </h3>
                  <button
                    onClick={() => onPreview(item)}
                    className="mt-1 text-[10px] text-muted hover:text-accent"
                  >
                    Discover the edit →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </MarketingContainer>
      </section>
      <section className="store-newsletter pb-12">
        <MarketingContainer>
          <div className="relative min-h-[270px] flex items-center overflow-hidden rounded-xl border border-border bg-accent/5 p-6 sm:p-9">
            <div
              className="store-newsletter-art pointer-events-none absolute inset-y-0 end-0 hidden w-[48%] md:block"
              aria-hidden="true"
            >
              <span className="store-newsletter-halo" />
              <span className="store-newsletter-spark store-newsletter-spark--one">
                <Sparkles size={25} strokeWidth={1.2} />
              </span>
              <span className="store-newsletter-spark store-newsletter-spark--two">
                <Sparkles size={32} strokeWidth={1.2} />
              </span>
              <Image
                src="/images/marketing/store/newsletter-shoppers.webp"
                alt=""
                width={720}
                height={720}
                className="absolute bottom-0 end-4 h-[calc(100%-12px)] w-[95%] object-contain object-bottom"
              />
            </div>
            <div className="relative max-w-[470px] grow-1 md:max-w-[48%]">
              <p className="text-[11px] text-muted">A little something in your inbox</p>
              <h2 className="mt-2 text-[22px] font-semibold leading-tight">
                Fresh finds. Good ideas.
                <br />
                And <span className="text-accent">a little extra inspiration.</span>
              </h2>
              <form
                className="mt-5 flex flex-wrap gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubscribed(true);
                }}
              >
                <label className="sr-only" htmlFor="store-newsletter">
                  Email address
                </label>
                <Input
                  id="store-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSubscribed(false);
                  }}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 rounded-full! bg-surface!"
                />
                <Button type="submit" variant="dark" className="rounded-full!">
                  {subscribed ? (
                    <>
                      <Check size={13} />
                      Subscribed
                    </>
                  ) : (
                    "Keep me inspired"
                  )}
                </Button>
              </form>
              {subscribed && (
                <p role="status" className="mt-2 text-[11px] text-muted">
                  You’re on the list for this preview. No email has been sent.
                </p>
              )}
            </div>
          </div>
        </MarketingContainer>
      </section>
    </div>
  );
}
function SearchIcon({ size = 19, className }: { size?: number; className?: string }) {
  return <ShoppingBag size={size} className={className} />;
}
