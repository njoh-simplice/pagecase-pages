export const brand = "NSAGENCY";
export const email = "info@nsagency.com";

// Every contact link and the "Website by" credit point here.
export const portfolioUrl = "https://heysimplice.com";
export const external = portfolioUrl.startsWith("http")
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

export const author = "Njoh Simplice";

export const address = {
  line1: "00000 Obili",
  line2: "Yaoundé, Cameroon",
};

export const tagline =
  "NSAGENCY is a software development, communication and consulting agency based in Yaoundé, Cameroon.";

export const keywords = [
  "NSAGENCY",
  "software development agency Cameroon",
  "web development Yaoundé",
  "mobile app development Cameroon",
  "custom software",
  "digital communication agency",
  "brand identity",
  "digital marketing Cameroon",
  "social media management",
  "IT consulting Cameroon",
  "digital strategy",
  "technology consulting Yaoundé",
];

export const services = [
  {
    title: "SOFTWARE",
    text: "Building reliable digital products, from first prototype to production.",
    items: [
      "WEB & MOBILE APPLICATIONS",
      "CUSTOM BUSINESS SOFTWARE",
      "APIS & SYSTEM INTEGRATIONS",
    ],
  },
  {
    title: "COMMUNICATION",
    text: "Helping brands say what they mean, clearly and consistently.",
    items: [
      "BRAND IDENTITY & VISUAL DESIGN",
      "DIGITAL MARKETING & SOCIAL MEDIA",
      "CONTENT CREATION & COPYWRITING",
    ],
  },
  {
    title: "CONSULTING",
    text: "Giving organisations clear direction on technology and communication.",
    items: [
      "DIGITAL STRATEGY & ROADMAPS",
      "TECHNICAL AUDITS & ARCHITECTURE",
      "TEAM TRAINING & WORKSHOPS",
    ],
  },
];

// Images live in /public/work. Placeholder titles: replace with real case studies.
export const projects = [
  { name: "Project 01", place: "Web Application", image: "/work/project-01.webp", width: 1600, height: 1063 },
  { name: "Project 02", place: "Mobile App", image: "/work/project-02.webp", width: 1067, height: 1600 },
  { name: "Project 03", place: "Brand Identity", image: "/work/project-03.webp", width: 1600, height: 1068 },
  { name: "Project 04", place: "Digital Campaign", image: "/work/project-04.webp", width: 1600, height: 1068 },
  { name: "Project 05", place: "Strategy & Consulting", image: "/work/project-05.webp", width: 1239, height: 1600 },
];

// Placeholder team: replace with real people.
export const members = [
  {
    role: "Founder",
    name: "Njoh Simplice",
    text: "Leads the agency and shapes its direction.",
  },
  {
    role: "Lead Developer",
    name: "Team Member",
    text: "Designs and builds our software products.",
  },
  {
    role: "Communication Lead",
    name: "Team Member",
    text: "Builds brands and tells their story.",
  },
  {
    role: "Business Consultant",
    name: "Team Member",
    text: "Guides clients through strategy and change.",
  },
  {
    role: "Designer",
    name: "Team Member",
    text: "Shapes the agency's visual identity and interfaces.",
  },
  {
    role: "New Member",
    name: "Maybe You?",
    text: "We are always looking for talented people to join our team.",
  },
];
