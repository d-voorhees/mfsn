import { key } from '../lib/key.mjs';

function navLink(label, slug) {
  return { label, internalLink: { _type: 'reference', _ref: `page.${slug}` } };
}

export const NAVIGATION = [
  {
    _key: key('nav'),
    label: 'Our Network',
    dropdownItems: [
      { _key: key('navlink'), label: 'Meet Our Network', link: navLink('Meet Our Network', 'our-network') },
      { _key: key('navlink'), label: 'Our Leadership', link: navLink('Our Leadership', 'leadership') },
      { _key: key('navlink'), label: 'Steering Committee', link: navLink('Steering Committee', 'steering-committee') },
      { _key: key('navlink'), label: 'Join the Network Chat', link: navLink('Join the Network Chat', 'member-connection') },
      { _key: key('navlink'), label: 'Meeting Documents', link: navLink('Meeting Documents', 'meeting-documents') },
      { _key: key('navlink'), label: 'MFSN In the News', link: navLink('MFSN In the News', 'in-the-news') },
    ],
  },
  {
    _key: key('nav'),
    label: 'Our Initiatives',
    dropdownItems: [
      { _key: key('navlink'), label: 'Our Strategy', link: navLink('Our Strategy', 'our-strategy') },
      { _key: key('navlink'), label: 'Talking Points About Hunger', link: navLink('Talking Points About Hunger', 'talking-points') },
      { _key: key('navlink'), label: 'Data & Mapping', link: navLink('Data & Mapping', 'data-mapping') },
      { _key: key('navlink'), label: 'Resources & Safe Spaces', link: navLink('Resources & Safe Spaces', 'resources') },
      { _key: key('navlink'), label: 'Unite Us Referral Program', link: navLink('Unite Us Referral Program', 'unite-us') },
      { _key: key('navlink'), label: 'Working Groups', link: navLink('Working Groups', 'working-groups') },
    ],
  },
  {
    _key: key('nav'),
    label: 'Find Food Now',
    link: navLink('Find Food Now', 'find-food-now'),
  },
];

export const FOOTER = {
  contactPhone: '(941) 216-5423',
  contactEmail: 'director@manateefood.org',
  locationText: 'Bradenton, Florida',
  copyrightText: 'Copyright © 2026 All rights reserved - Manatee Food Security Network',
  legalLinks: [
    { _key: key('link'), label: 'Privacy Policy', internalLink: { _type: 'reference', _ref: 'page.privacy-policy' } },
    { _key: key('link'), label: 'Terms of Service', internalLink: { _type: 'reference', _ref: 'page.terms-of-service' } },
  ],
};
