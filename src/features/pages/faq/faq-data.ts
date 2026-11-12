import {
  CreditCard,
  Link2,
  LockKeyhole,
  Rocket,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "getting-started"
  | "account"
  | "billing"
  | "workspace"
  | "security"
  | "integrations";
export type FAQCategory = {
  id: CategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};
export type FAQItem = {
  id: string;
  categoryId: CategoryId;
  question: string;
  answer: string;
  popular?: boolean;
};

export const categories: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Your first steps in the workspace",
    icon: Rocket,
    accent: "bg-violet-500/10 text-violet-500",
  },
  {
    id: "account",
    title: "Account & Profile",
    description: "Personal details and access",
    icon: UserRound,
    accent: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Plans, invoices, and usage",
    icon: CreditCard,
    accent: "bg-rose-500/10 text-rose-500",
  },
  {
    id: "workspace",
    title: "Workspace & Teams",
    description: "People, roles, and projects",
    icon: UsersRound,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Your settings and safeguards",
    icon: LockKeyhole,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connected tools and data",
    icon: Link2,
    accent: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
];

export const questions: FAQItem[] = [
  {
    id: "start-workspace",
    categoryId: "getting-started",
    question: "How do I set up a workspace?",
    answer:
      "Open Account Settings to review your workspace preferences, then choose the dashboards and apps your team needs. This template demonstrates the layout with sample data.",
    popular: true,
  },
  {
    id: "start-tour",
    categoryId: "getting-started",
    question: "Where should I start exploring?",
    answer:
      "Start with a dashboard, then open the related workspace from the sidebar. Each section shows a different workflow and set of sample records.",
  },
  {
    id: "start-data",
    categoryId: "getting-started",
    question: "Can I replace the sample data?",
    answer:
      "Yes. The showcase data is defined in the project features. A production application can replace those local sources with its own data layer.",
  },
  {
    id: "start-mobile",
    categoryId: "getting-started",
    question: "Does the interface work on smaller screens?",
    answer:
      "The navigation and page layouts adapt to smaller viewports. Check each feature at the screen sizes your product will support.",
  },

  {
    id: "account-profile",
    categoryId: "account",
    question: "How do I edit my profile?",
    answer:
      "Open User Profile from the Account section and choose Edit profile. Changes in the current profile showcase are held in local page state.",
    popular: true,
  },
  {
    id: "account-email",
    categoryId: "account",
    question: "Can I change my account email?",
    answer:
      "Account Settings contains an editable email field for the interface preview. Connecting it to account management requires an authentication service.",
  },
  {
    id: "account-language",
    categoryId: "account",
    question: "Where do I choose language and timezone?",
    answer:
      "Use the General section of Account Settings to preview language, timezone, and region controls. These values do not translate the template by themselves.",
  },
  {
    id: "account-avatar",
    categoryId: "account",
    question: "How are profile images displayed?",
    answer:
      "Profile and team portraits use local image assets where available. The shared avatar component provides a fallback for unmapped names.",
  },

  {
    id: "billing-plans",
    categoryId: "billing",
    question: "What is the difference between the plans?",
    answer:
      "The Pricing page compares illustrative limits for seats, storage, collaboration, analytics, support, and security. No purchase is made from the demo.",
    popular: true,
  },
  {
    id: "billing-yearly",
    categoryId: "billing",
    question: "How does annual billing appear?",
    answer:
      "Choose Yearly on the Pricing page to see the monthly equivalent and total annual amount. The sample annual total is ten times the monthly price.",
  },
  {
    id: "billing-invoices",
    categoryId: "billing",
    question: "Where would invoices be managed?",
    answer:
      "The Billing section of Account Settings shows invoice delivery preferences. Actual invoices require a connected billing system.",
  },
  {
    id: "billing-cancel",
    categoryId: "billing",
    question: "Can I cancel a subscription here?",
    answer:
      "This template does not create or manage subscriptions. A production billing flow would define its own cancellation policy and controls.",
  },

  {
    id: "team-invite",
    categoryId: "workspace",
    question: "How do I invite a teammate?",
    answer:
      "A production workspace would invite teammates through its member settings. The team and user lists in this template are interface demonstrations.",
    popular: true,
  },
  {
    id: "team-roles",
    categoryId: "workspace",
    question: "Can team members have different roles?",
    answer:
      "Yes, the layouts can represent roles such as administrator, editor, and viewer. Permission enforcement must be provided by your application.",
  },
  {
    id: "team-switch",
    categoryId: "workspace",
    question: "Can I switch between workspaces?",
    answer:
      "Account Settings includes a default workspace preference. Actual workspace switching depends on your product's data and identity model.",
  },
  {
    id: "team-projects",
    categoryId: "workspace",
    question: "Where can I follow project activity?",
    answer:
      "Project and task examples appear in the dashboard and task management views. Their activity is sample content for this template.",
  },

  {
    id: "security-theme",
    categoryId: "security",
    question: "How do I change light or dark mode?",
    answer:
      "Use the theme control in the header or choose a mode under Account Settings → Appearance. Both use the existing global theme provider.",
    popular: true,
  },
  {
    id: "security-two-factor",
    categoryId: "security",
    question: "Is two-factor authentication enabled?",
    answer:
      "The two-factor screens demonstrate the interface only. A real sign-in flow needs server-side verification and secure credential handling.",
  },
  {
    id: "security-privacy",
    categoryId: "security",
    question: "Who can view my profile?",
    answer:
      "The Privacy section previews profile visibility options. Enforcing visibility requires authorization rules in the application backend.",
  },
  {
    id: "security-sessions",
    categoryId: "security",
    question: "Can I review signed-in devices?",
    answer:
      "Account Settings includes a fictional device list to show the intended layout. It does not detect or revoke real sessions.",
  },

  {
    id: "integration-tools",
    categoryId: "integrations",
    question: "Which connected apps are shown?",
    answer:
      "The Connected Apps preview includes GitHub, Slack, Google Drive, and Microsoft Teams. Their connection states are local demo values.",
    popular: true,
  },
  {
    id: "integration-connect",
    categoryId: "integrations",
    question: "Does Connect authorize an external app?",
    answer:
      "No. Connect and Disconnect only update the visual preview. A production integration needs its own authorization flow.",
  },
  {
    id: "integration-api",
    categoryId: "integrations",
    question: "Where would API access be configured?",
    answer:
      "A production account could include API credentials and usage settings. This template does not issue credentials or send requests.",
  },
  {
    id: "integration-remove",
    categoryId: "integrations",
    question: "Can I remove a connected app?",
    answer:
      "The Connected Apps preview lets you switch a sample connection off. It does not revoke access from any real service.",
  },
];
