import { paragraphs } from '../lib/portableText.mjs';

export const NEWS_MENTIONS = [
  {
    _id: 'newsMention.fox13',
    headline: 'Unified front against hunger: Manatee Food Security Network tackles growing crisis',
    outletName: 'Fox 13 Tampa',
    outletLogoFile: 'img/fox-13.png',
    excerpt: paragraphs(
      'TAMPA — A growing crisis of food insecurity in Manatee County has sparked a new collaboration to ensure no one goes hungry.',
      'The backstory: The Bishop-Parker Foundation has launched the Manatee Food Security Network, bringing together over 50 agencies, from large food banks to grassroots pantries.',
      "This new network's purpose is to share data, resources, and strategies to help feed those in need.",
    ),
    url: 'https://www.fox13news.com/news/unified-front-against-hunger-manatee-food-security-network-tackles-growing-crisis',
    linkLabel: 'Watch Video / Read Article →',
    featured: true,
    publishedAt: undefined,
  },
  {
    _id: 'newsMention.parrish-civic-association',
    headline: 'Food Insecurity Requires Coordination, Not Just Compassion',
    outletName: 'Parrish Civic Association',
    outletLogoFile: 'img/parish-civic-organization.png',
    byline: "by Marisol Garcia, Executive Director, Kim's Krew",
    excerpt: paragraphs(
      'Every day, partners in the Manatee Food Security Network hear the same stories about families in crisis with empty pantries and refrigerators. These stories come from across Manatee County and from organizations of every size—large institutions and small nonprofits alike—working together to respond to hunger in real time.',
    ),
    citation: 'Parrish Village News, April 2026 — Page 53',
    url: 'https://parrishcivicassociation.com/parrish-village-news/',
    linkLabel: 'Read Article →',
    featured: true,
  },
  {
    _id: 'newsMention.bradenton-times-shutdown',
    headline: 'Shutdown Exposes Gaps in Food Assistance',
    outletName: 'Bradenton Times',
    outletLogoFile: 'img/bradenton-times.jpg',
    excerpt: paragraphs(
      'On November 1, due to the federal government shutdown, the essential support services SNAP (Supplemental Nutrition Assistance Program) and WIC (Women, Infants, and Children) were paused.',
      "And even though the government will resume SNAP and WIC payments as it reopens, this episode has shown how we can't just depend on the government to assist those who need help feeding their families.",
    ),
    url: 'https://thebradentontimes.com/stories/shutdown-exposes-gaps-in-food-assistance,171261',
    linkLabel: 'Read Article →',
    featured: true,
  },
  {
    _id: 'newsMention.bradenton-times-collaborative-solution',
    headline: 'Tackling Hunger in Manatee County: A Collaborative Solution Emerges',
    outletName: 'Bradenton Times',
    outletLogoFile: 'img/bradenton-times.jpg',
    excerpt: paragraphs(
      'Tens of thousands of our Manatee County neighbors go hungry every day. By one estimate, as many as 12% of the county’s 440,000 residents regularly struggle with “food insecurity” – not knowing how and when they will be able to properly feed their families.',
      'As the county continues to grow, and food prices continue to rise…',
    ),
    url: 'https://thebradentontimes.com/stories/tackling-hunger-in-manatee-county-a-collaborative-solution-emerges,128069',
    linkLabel: 'Read More →',
    featured: false,
  },
  {
    _id: 'newsMention.the-gauntlet',
    headline: 'Government Shutdown Intensifies Local Food Insecurity',
    outletName: 'The Gauntlet',
    outletLogoFile: 'img/the-gauntlet.jpg',
    excerpt: paragraphs(
      'A video by Haley Munson, Video Journalist; Kieran Cloutier, Cinematographer; Sophia Azzopardi, Staff Writer; and Lucy Preston, Staff Writer.',
    ),
    url: 'https://www.ssesgauntlet.org/media/video/2025/11/21/government-shutdown-intensifies-local-food-insecurity/',
    linkLabel: 'Watch here →',
    featured: false,
  },
];
