// One place for every page's SEO title + description, keyed by page slug.
// Used by pages.mjs (fresh migration) and apply-seo.mjs (patching the live
// dataset without touching page content). Titles stay under ~60 characters
// and descriptions between ~120 and 160 so search results don't truncate.
export const SEO = {
  home: {
    metaTitle: 'Manatee Food Security Network | Ending Hunger in Manatee',
    metaDescription:
      'The Manatee Food Security Network connects pantries, nonprofits, agencies, and funders to reduce hunger and build a food-secure Manatee County, Florida.',
  },
  'our-network': {
    metaTitle: 'Our Network: 79 Partner Organizations | MFSN',
    metaDescription:
      'Meet the nonprofits, faith communities, agencies, healthcare providers, and businesses working together to close gaps in food access across Manatee County.',
  },
  leadership: {
    metaTitle: 'Our Leadership & Support Team | MFSN',
    metaDescription:
      'Meet the team that convenes and supports the Manatee Food Security Network, from project management to strategy, and find out how to contact them.',
  },
  'steering-committee': {
    metaTitle: 'Steering Committee | Manatee Food Security Network',
    metaDescription:
      'See how the Manatee Food Security Network Steering Committee provides governance, strategic oversight, and accountability, and who serves on it in 2026.',
  },
  'member-connection': {
    metaTitle: 'Join the Network Chat on Hylo | MFSN',
    metaDescription:
      'Network members connect, share updates, and coordinate on Hylo. Learn how to request an invitation and get started with the app or web version.',
  },
  'meeting-documents': {
    metaTitle: 'Meeting Documents & Notes | Manatee Food Security Network',
    metaDescription:
      'Browse Manatee Food Security Network meeting agendas, notes, and shared documents by year, from 2023 to the present, plus logos and graphics.',
  },
  'in-the-news': {
    metaTitle: 'MFSN In the News | Manatee Food Security Network',
    metaDescription:
      'Read local news coverage of the Manatee Food Security Network and its work to reduce hunger and improve food access across Manatee County.',
  },
  'our-strategy': {
    metaTitle: 'Our Strategy to Reduce Hunger in Manatee County | MFSN',
    metaDescription:
      'Our four-pronged strategy to end hunger in Manatee County: convening the collective voice, building capacity for seamless systems, and more. See the 2026 focus.',
  },
  'talking-points': {
    metaTitle: 'Talking Points About Hunger in Manatee County | MFSN',
    metaDescription:
      "Clear, shareable talking points on Manatee County's food insecurity crisis, the solutions we're focused on, and how the network helps. Fast facts included.",
  },
  'data-mapping': {
    metaTitle: 'Food Access Data & Mapping in Manatee County | MFSN',
    metaDescription:
      'Explore the interactive food access map built with the University of South Florida, showing pantries, grocers, and meal sites across Manatee County.',
  },
  'unite-us': {
    metaTitle: 'Unite Us Referral Program in Manatee County | MFSN',
    metaDescription:
      'Unite Us is a free referral platform connecting Manatee County organizations to refer clients, track outcomes, and deliver whole-person care. Learn how to join.',
  },
  'working-groups': {
    metaTitle: 'Working Groups & Cooperative Distribution | MFSN',
    metaDescription:
      'Local food partners in the Cooperative Distribution Group coordinate food recovery and have redistributed over 300,000 pounds of food across Manatee County.',
  },
  'find-food-now': {
    metaTitle: 'Find Free Food in Manatee County Today | MFSN',
    metaDescription:
      'Need food today? Find food pantries, free meals, and food distributions in Manatee County, Florida, with links to local food banks. English and Spanish.',
  },
  resources: {
    metaTitle: 'Creating Safe Spaces: Pantry Resources | MFSN',
    metaDescription:
      'Guides for food pantries serving seniors, veterans, immigrants, people with disabilities, LGBTQIA neighbors, youth, and people experiencing homelessness.',
  },
  'privacy-policy': {
    metaTitle: 'Privacy Policy | Manatee Food Security Network',
    metaDescription:
      'How the Manatee Food Security Network collects, uses, and protects information on this website, including analytics, cookies, and email communications.',
    noIndex: true,
  },
  'terms-of-service': {
    metaTitle: 'Terms of Service | Manatee Food Security Network',
    metaDescription:
      'The terms that govern use of the Manatee Food Security Network website, including acceptable use, disclaimers, intellectual property, and liability.',
    noIndex: true,
  },
};
