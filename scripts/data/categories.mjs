// Deterministic _id per category so re-running the migration updates
// these in place instead of creating duplicates.
export const CATEGORIES = [
  { _id: 'category.accessibility', label: 'Accessibility', colorKey: 'blue' },
  { _id: 'category.best-practices', label: 'Best Practices', colorKey: 'orange' },
  { _id: 'category.dei-inclusion', label: 'DEI & Inclusion', colorKey: 'pink' },
  { _id: 'category.youth-families', label: 'Youth & Families', colorKey: 'green' },
  { _id: 'category.immigrant-community', label: 'Immigrant Community', colorKey: 'blue' },
  { _id: 'category.homeless-unhoused', label: 'Homeless / Unhoused', colorKey: 'orange' },
  { _id: 'category.legal-rights', label: 'Legal Rights', colorKey: 'pink' },
  { _id: 'category.substance-abuse-recovery', label: 'Substance Abuse Recovery', colorKey: 'green' },
  { _id: 'category.seniors-elderly', label: 'Seniors & Elderly', colorKey: 'blue' },
  { _id: 'category.veterans-military-families', label: 'Veterans & Military Families', colorKey: 'orange' },
  { _id: 'category.client-dignity', label: 'Client Dignity', colorKey: 'pink' },
  { _id: 'category.data-on-food-prices', label: 'Data on Food Prices', colorKey: 'green' },
];
