export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  original: number;
  image: string;
  label: string;
  color: string;
  description: string;
};
export const storeProducts: StoreProduct[] = [
  {
    id: "headphones",
    name: "Studio wireless headphones",
    category: "Audio",
    price: 129,
    original: 159,
    image: "/images/ecommerce/headphones.webp",
    label: "Everyday favorite",
    color: "Midnight",
    description:
      "A considered companion for a quieter working day. Soft over-ear cushions, a simple silhouette, and room for your favorite playlist. Fictional demo product.",
  },
  {
    id: "speaker",
    name: "Pocket portable speaker",
    category: "Audio",
    price: 79,
    original: 99,
    image: "/images/ecommerce/speaker.webp",
    label: "Small but mighty",
    color: "Stone",
    description:
      "Bring a little atmosphere to your desk, shelf, or weekend table. A compact woven finish designed for everyday spaces. Fictional demo product.",
  },
  {
    id: "watch",
    name: "Everyday smart watch",
    category: "Wearables",
    price: 199,
    original: 229,
    image: "/images/ecommerce/watch.webp",
    label: "New perspective",
    color: "Graphite",
    description:
      "An understated shape for your daily rhythm. A clear face, a comfortable band, and a versatile design for everyday wear. Fictional demo product.",
  },
  {
    id: "controller",
    name: "Studio game controller",
    category: "Gaming",
    price: 59,
    original: 69,
    image: "/images/ecommerce/controller.webp",
    label: "Time to unwind",
    color: "Cloud",
    description:
      "A familiar feel for a well-earned break. An ergonomic silhouette and a clean finish that belong in your living space. Fictional demo product.",
  },
];
export const storeMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const journalArticles = [
  {
    id: "workspace",
    title: "Small changes. A whole new creative space.",
    image: "/images/marketing/store/journal-workspace-photo.webp",
    alt: "A real desk setup with a laptop, monitor, tablet, and workspace accessories",
  },
  {
    id: "listening",
    title: "A soundtrack for your next great idea",
    image: "/images/marketing/store/journal-listening-photo.webp",
    alt: "A woman listening to music through headphones beside her laptop",
  },
  {
    id: "design",
    title: "Color, texture, and a little personality",
    image: "/images/marketing/store/journal-design-photo.webp",
    alt: "A person holding a fan of paint color samples",
  },
  {
    id: "rituals",
    title: "Less noise. More of what matters.",
    image: "/images/marketing/store/journal-rituals-photo.webp",
    alt: "Coffee, a notebook, glasses, and a wristwatch arranged on a table",
  },
  {
    id: "downtime",
    title: "The art of switching off",
    image: "/images/marketing/store/journal-downtime-photo.webp",
    alt: "Two friends playing video games together on a sofa",
  },
];
