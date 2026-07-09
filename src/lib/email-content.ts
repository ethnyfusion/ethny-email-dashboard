export interface CampaignTemplateContent {
  previewText: string;
  title: string;
  headerTitle: string;
  headerSubtitle: string;
  intro: string;
  body: string;
  ctaLabel: string;
}

const defaultCampaignContent: Record<string, CampaignTemplateContent> = {
  "new-website-announcement": {
    previewText: "Discover Ethny’s new digital experience.",
    title: "A fresh Ethny experience is live",
    headerTitle: "A fresh Ethny experience is live",
    headerSubtitle: "Welcome to the new way to discover our world.",
    intro: "Hello {firstName},",
    body: "We are proud to unveil a new chapter for Ethny, shaped around clarity, elegance, and effortless planning. Take a look at the new website and explore what is possible for your next unforgettable experience.",
    ctaLabel: "Visit the new website",
  },
  "client-reactivation": {
    previewText: "We would love to welcome you back.",
    title: "We would love to welcome you back",
    headerTitle: "We would love to welcome you back",
    headerSubtitle: "Your next celebration is waiting.",
    intro: "Hello {firstName},",
    body: "It has been a while, and we would love to reconnect with you for a beautifully tailored experience. Let us help you plan the next dinner, event, or private occasion with ease.",
    ctaLabel: "Book your next experience",
  },
  "private-chef-experience": {
    previewText: "A private chef experience, crafted for you.",
    title: "A private chef experience, crafted for you",
    headerTitle: "Private chef experience",
    headerSubtitle: "Luxury dining, arranged with care.",
    intro: "Hello {firstName},",
    body: "Discover how a private chef experience can bring exceptional service, taste, and atmosphere to your next gathering. Tailored for intimate dinners, celebrations, or elevated hosting moments.",
    ctaLabel: "Explore private chef options",
  },
  "event-catering": {
    previewText: "Elevated catering for your next event.",
    title: "Elevated catering for your next event",
    headerTitle: "Event catering",
    headerSubtitle: "Designed for memorable occasions.",
    intro: "Hello {firstName},",
    body: "Ethny brings polished catering experiences to elegant events, intimate gatherings, and special celebrations. Let us design a catering experience that feels effortless and unforgettable.",
    ctaLabel: "Plan your event",
  },
};

export function getDefaultCampaignContent(id: string): CampaignTemplateContent {
  return defaultCampaignContent[id] ?? defaultCampaignContent["new-website-announcement"];
}
