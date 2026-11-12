export const showcaseSlugs = [
  "buttons",
  "cards",
  "badges",
  "alerts",
  "avatars",
  "tabs",
  "accordions",
  "modals",
  "dropdowns",
  "tooltips",
  "progress",
  "skeletons",
  "notifications",
  "navigation",
] as const;
export type ShowcaseSlug = (typeof showcaseSlugs)[number];
export const showcaseMeta: Record<ShowcaseSlug, { title: string; description: string }> = {
  buttons: { title: "Buttons", description: "Actions, states, groups, and confirmation patterns." },
  cards: {
    title: "Cards",
    description: "Metrics, profiles, products, selectable and expandable surfaces.",
  },
  badges: {
    title: "Badges & tags",
    description: "Statuses, semantic labels, counts, and removable tags.",
  },
  alerts: {
    title: "Alerts & toasts",
    description: "Contextual feedback, dismissible messages, and local notifications.",
  },
  avatars: {
    title: "Avatars",
    description: "Images, fallbacks, presence, and grouped identities.",
  },
  tabs: { title: "Tabs", description: "Controlled, vertical, segmented, and icon navigation." },
  accordions: {
    title: "Accordions",
    description: "Single, multiple, controlled, and native disclosures.",
  },
  modals: {
    title: "Modals & drawers",
    description: "Centered dialogs, forms, confirmations, and side panels.",
  },
  dropdowns: { title: "Dropdowns", description: "Action, account, checkbox, and selection menus." },
  tooltips: {
    title: "Tooltips & popovers",
    description: "Accessible contextual and interactive overlays.",
  },
  progress: {
    title: "Progress",
    description: "Linear, circular, segmented, step, and upload states.",
  },
  skeletons: {
    title: "Skeletons",
    description: "Loading placeholders for common content patterns.",
  },
  notifications: {
    title: "Notifications",
    description: "A filterable local feed with read and priority states.",
  },
  navigation: {
    title: "Navigation",
    description: "Breadcrumbs, pagination, steps, and responsive menus.",
  },
};
