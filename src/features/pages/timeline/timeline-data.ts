export type TimelineStatus = "completed" | "current" | "upcoming";
export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: TimelineStatus;
  actor?: string;
  attachment?: string;
};

export const activity: TimelineEvent[] = [
  {
    id: "activity-member",
    title: "Sofia joined the team",
    description: "Sofia Garcia joined the product workspace as operations lead.",
    date: "Nov 10 · 09:15",
    type: "member",
    status: "current",
    actor: "Sofia Garcia",
  },
  {
    id: "activity-milestone",
    title: "Onboarding flow approved",
    description: "The first mobile experience milestone moved into delivery.",
    date: "Nov 9 · 15:40",
    type: "milestone",
    status: "completed",
    actor: "Alex Morgan",
  },
  {
    id: "activity-file",
    title: "Research document uploaded",
    description: "Interview findings are ready for the design review.",
    date: "Nov 8 · 11:20",
    type: "document",
    status: "completed",
    actor: "Priya Shah",
    attachment: "research-summary.pdf",
  },
  {
    id: "activity-comment",
    title: "New comment on Design system",
    description: "Daniel added feedback to the component inventory.",
    date: "Nov 7 · 14:05",
    type: "comment",
    status: "completed",
    actor: "Daniel Kim",
  },
  {
    id: "activity-task",
    title: "Accessibility audit assigned",
    description: "The navigation audit was assigned to the design team.",
    date: "Nov 6 · 10:30",
    type: "task",
    status: "completed",
    actor: "Alex Morgan",
  },
];

export const milestones: TimelineEvent[] = [
  {
    id: "milestone-discovery",
    title: "Discovery",
    description: "Mapped user needs and current workflows.",
    date: "Sep 04",
    type: "research",
    status: "completed",
  },
  {
    id: "milestone-planning",
    title: "Planning",
    description: "Defined scope, owners, and delivery phases.",
    date: "Sep 18",
    type: "planning",
    status: "completed",
  },
  {
    id: "milestone-design",
    title: "Design",
    description: "Validated the interface with stakeholders.",
    date: "Oct 09",
    type: "design",
    status: "completed",
  },
  {
    id: "milestone-development",
    title: "Development",
    description: "Building the approved experience.",
    date: "Nov 10",
    type: "development",
    status: "current",
  },
  {
    id: "milestone-testing",
    title: "Testing",
    description: "Reviewing quality and accessibility.",
    date: "Nov 28",
    type: "testing",
    status: "upcoming",
  },
  {
    id: "milestone-launch",
    title: "Launch",
    description: "Preparing the production handoff.",
    date: "Dec 12",
    type: "launch",
    status: "upcoming",
  },
];

export const roadmap: TimelineEvent[] = [
  {
    id: "roadmap-research",
    title: "Research",
    description: "Insights collected",
    date: "Sep 02",
    type: "research",
    status: "completed",
  },
  {
    id: "roadmap-wireframes",
    title: "Wireframes",
    description: "Flows mapped",
    date: "Sep 16",
    type: "planning",
    status: "completed",
  },
  {
    id: "roadmap-ui",
    title: "UI Design",
    description: "Screens approved",
    date: "Oct 10",
    type: "design",
    status: "completed",
  },
  {
    id: "roadmap-development",
    title: "Development",
    description: "In progress",
    date: "Nov 10",
    type: "development",
    status: "current",
  },
  {
    id: "roadmap-qa",
    title: "QA",
    description: "Test release",
    date: "Nov 27",
    type: "testing",
    status: "upcoming",
  },
  {
    id: "roadmap-release",
    title: "Release",
    description: "Team launch",
    date: "Dec 12",
    type: "launch",
    status: "upcoming",
  },
];

export const history: { label: string; date: string; events: TimelineEvent[] }[] = [
  {
    label: "Today",
    date: "Nov 10, 2026",
    events: [
      {
        id: "history-file",
        title: "Product brief updated",
        description: "Revised delivery notes and acceptance criteria.",
        date: "10:42 AM",
        type: "document",
        status: "current",
        actor: "Priya Shah",
        attachment: "product-brief-v3.pdf",
      },
      {
        id: "history-task",
        title: "Navigation review completed",
        description: "Mobile navigation passed the team review.",
        date: "09:18 AM",
        type: "task",
        status: "completed",
        actor: "Alex Morgan",
      },
    ],
  },
  {
    label: "Yesterday",
    date: "Nov 9, 2026",
    events: [
      {
        id: "history-status",
        title: "Release status changed",
        description: "The release moved from planning to in progress.",
        date: "04:12 PM",
        type: "milestone",
        status: "completed",
        actor: "Daniel Kim",
      },
    ],
  },
  {
    label: "Earlier this week",
    date: "Nov 6, 2026",
    events: [
      {
        id: "history-comment",
        title: "Review comment added",
        description: "Sofia noted a handoff detail for the operations team.",
        date: "02:30 PM",
        type: "comment",
        status: "completed",
        actor: "Sofia Garcia",
      },
    ],
  },
  {
    label: "Last month",
    date: "Oct 28, 2026",
    events: [
      {
        id: "history-approved",
        title: "Design milestone approved",
        description: "The interface specification was signed off.",
        date: "11:05 AM",
        type: "milestone",
        status: "completed",
        actor: "Alex Morgan",
      },
    ],
  },
];

export const changelog: TimelineEvent[] = [
  {
    id: "change-212",
    title: "Version 2.1.2 released",
    description: "Improved navigation clarity and refined keyboard focus states.",
    date: "Nov 7, 2026",
    type: "release",
    status: "current",
  },
  {
    id: "change-210",
    title: "Collaboration updates",
    description: "Introduced clearer ownership and activity summaries.",
    date: "Oct 18, 2026",
    type: "update",
    status: "completed",
  },
  {
    id: "change-200",
    title: "Version 2.0 launched",
    description: "Expanded the workspace with a more consistent design system.",
    date: "Sep 25, 2026",
    type: "release",
    status: "completed",
  },
  {
    id: "change-studio",
    title: "Studio milestone",
    description: "The first cross-team workspace preview was shared internally.",
    date: "Aug 12, 2026",
    type: "milestone",
    status: "completed",
  },
];
