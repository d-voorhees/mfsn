import { key } from '../lib/key.mjs';
import { action, extLink, intLink } from '../lib/fields.mjs';
import { paragraphs, bulletList, numberedList, heading } from '../lib/portableText.mjs';
import { image } from '../lib/uploadImage.mjs';
import { NETWORK_PARTNERS, UNITE_US_PARTNERS } from './partners.mjs';

const hero = async ({ heading: h, subheading, description, imgFile, imgAlt, actions, eyebrow }) => ({
  _type: 'heroCentered',
  _key: key('hero'),
  eyebrow,
  heading: h,
  subheading,
  description,
  image: await image(imgFile, imgAlt),
  actions,
});

const richText = ({ heading: h, body, eyebrow, proseStyle = 'default', caveatText, iconField, mapEmbed, actions, settings, columns }) => ({
  _type: 'richTextSection',
  _key: key('rich'),
  eyebrow,
  heading: h,
  proseStyle,
  body,
  columns,
  caveatText,
  icon: iconField,
  mapEmbed,
  actions,
  settings,
});

const textImage = async ({ heading: h, eyebrow, proseStyle = 'default', listStyle, body, imgFile, imgAlt, imageStyle = 'natural', mediaPosition = 'right', linkList, actions, callout, settings }) => ({
  _type: 'textImageSection',
  _key: key('textimg'),
  eyebrow,
  heading: h,
  proseStyle,
  listStyle,
  body,
  image: imgFile ? await image(imgFile, imgAlt) : undefined,
  imageStyle,
  mediaPosition,
  linkList,
  actions,
  callout: callout
    ? { _type: 'callout', style: callout.style ?? 'pink', position: callout.position ?? 'left', heading: callout.heading, body: callout.body, action: callout.action }
    : undefined,
  settings,
});

const featureItem = ({ markerIconKey, markerImage, title, description, action: act }) => ({
  _type: 'featureItem',
  _key: key('item'),
  markerIconKey,
  markerImage,
  title,
  description,
  action: act,
});

const featureGrid = ({ heading: h, columns, markerStyle, items, trailingLink, settings, iconField }) => ({
  _type: 'featureGrid',
  _key: key('grid'),
  icon: iconField,
  heading: h,
  columns,
  markerStyle,
  items,
  trailingLink,
  settings,
});

const stat = ({ number, label, link }) => ({ _type: 'stat', _key: key('stat'), number, label, link });

const statGrid = ({ heading: h, columns, itemStyle = 'plain', stats, settings }) => ({
  _type: 'statGrid',
  _key: key('statgrid'),
  heading: h,
  columns,
  itemStyle,
  stats,
  settings,
});

const calloutBand = ({ label, statement, body, color }) => ({
  _type: 'calloutBand',
  _key: key('callout'),
  label,
  statement,
  body,
  color,
});

const pullQuote = ({ quote, citationName, citationDetail }) => ({
  _type: 'pullQuote',
  _key: key('quote'),
  quote,
  citationName,
  citationDetail,
});

const resourceLinkList = (links) => links.map(({ label, url }) => ({ _type: 'link', _key: key('link'), label, externalUrl: url }));

const resourceSpotlight = async ({ tags, heading: h, subheading, imgFile, imgAlt, mediaPosition = 'left', body, resourceLinks, settings }) => ({
  _type: 'resourceSpotlight',
  _key: key('spotlight'),
  tags: tags.map((id) => ({ _type: 'reference', _ref: id, _key: key('tagref') })),
  heading: h,
  subheading,
  media: imgFile ? await image(imgFile, imgAlt) : undefined,
  mediaPosition,
  body,
  resourceLinks: resourceLinks ? resourceLinkList(resourceLinks) : undefined,
  settings,
});

const statementHighlight = ({ heading: h, facts, settings }) => ({
  _type: 'statementHighlight',
  _key: key('statement'),
  heading: h,
  facts,
  settings,
});

const newsGrid = ({ heading: h, mentionIds, trailingLink }) => ({
  _type: 'newsGrid',
  _key: key('newsgrid'),
  heading: h,
  mentions: mentionIds.map((id) => ({ _type: 'reference', _ref: id, _key: key('mentionref') })),
  trailingLink,
});

const partnerEntry = async (p) => ({
  _type: 'partnerEntry',
  _key: key('partner'),
  name: p.name,
  logo: p.file ? await image(p.file, `${p.name} logo`) : undefined,
  logoOnDarkBg: p.dark || false,
  url: p.url || undefined,
});

const logoCloud = async ({ heading: h, display, partners }) => {
  // Sequential, not Promise.all: Our Network's 79 partners fired 79
  // concurrent asset uploads and tripped Sanity's in-flight request limit.
  const entries = [];
  for (const p of partners) entries.push(await partnerEntry(p));
  return { _type: 'logoCloud', _key: key('logocloud'), heading: h, display, partners: entries };
};

const personEntry = async (p) => ({
  _type: 'personEntry',
  _key: key('person'),
  name: p.name,
  role: p.role,
  photo: p.file ? await image(p.file, p.name) : undefined,
  email: p.email,
});

const teamGrid = async ({ heading: h, intro, introImageFile, introImageAlt, display, people }) => {
  const entries = [];
  for (const p of people) entries.push(await personEntry(p));
  return {
    _type: 'teamGrid',
    _key: key('team'),
    heading: h,
    intro,
    introImage: introImageFile ? await image(introImageFile, introImageAlt) : undefined,
    display,
    people: entries,
  };
};

const twoColumnImageSection = async ({ heading: h, columns, settings }) => ({
  _type: 'twoColumnImageSection',
  _key: key('twocol'),
  heading: h,
  columns: await Promise.all(
    columns.map(async (c) => ({
      _type: 'column',
      _key: key('col'),
      heading: c.heading,
      image: await image(c.imgFile, c.imgAlt),
      body: c.body,
      noteText: c.noteText,
      actions: c.actions,
    })),
  ),
  settings,
});

export async function buildPages() {
  const pages = [];

  // ---- Homepage ----
  pages.push({
    _id: 'page.home',
    _type: 'page',
    title: 'Manatee Food Security Network',
    slug: { _type: 'slug', current: 'home' },
    seo: { metaTitle: 'Manatee Food Security Network | Building a Stronger, Food-Secure Manatee County' },
    pageBuilder: [
      await hero({
        heading: 'Building a Stronger, Food-Secure Manatee County',
        description:
          'We connect nonprofits, agencies, funders, and community leaders across Manatee County to close gaps in food access and strengthen coordination among local food security partners.',
        imgFile: 'img/homepage-hero.jpg',
        imgAlt: 'Volunteers and community members at a Manatee County food distribution',
        actions: [action('primary', intLink('Explore Our Strategy', 'our-strategy')), action('outline', intLink('Meet Our Network', 'our-network'))],
      }),
      await textImage({
        heading:
          "Manatee County has dedicated nonprofits, agencies, and community programs working to reduce hunger every day.",
        body: paragraphs(
          "What's been missing is the connective tissue between them: shared data, aligned strategy, and a structure that lets partners act as one system instead of many separate efforts.",
          'The Manatee Food Security Network exists to build those connections so every program, every partnership, and every person served goes further.',
        ),
        imgFile: 'img/multi-color-logo.png',
        imgAlt: 'Manatee Food Security Network',
        imageStyle: 'logo',
        mediaPosition: 'left',
        settings: { anchorId: 'why-the-network-exists' },
      }),
      richText({
        heading: 'Our Vision',
        proseStyle: 'quote',
        body: paragraphs(
          'A Manatee County where everyone has consistent access to the food they want and need — and where the organizations serving them are connected, resourced, and responsive to the community.',
        ),
        iconField: await image('img/manatee-orange.png', 'MFSN manatee icon'),
        settings: { alignment: 'center', background: 'light', anchorId: 'our-vision' },
      }),
      statementHighlight({
        heading: 'Why\nFood\nMatters',
        facts: [
          "43% Manatee County residents can't afford the essentials.",
          'Food supports more than health — it supports stability, dignity, and connection.',
          'When people can access the food they need, families and communities are stronger.',
        ],
        settings: { background: 'gold', anchorId: 'why-food-matters' },
      }),
      featureGrid({
        heading: 'How We Work',
        columns: 'two',
        markerStyle: 'number',
        items: [
          featureItem({ title: 'Listen to the community', description: 'Center the voices of people with lived experience.' }),
          featureItem({ title: 'Share information', description: 'Use data and local insight to guide decisions.' }),
          featureItem({ title: 'Strengthen coordination', description: 'Help partners work together more effectively.' }),
          featureItem({ title: 'Support better solutions', description: 'Advance ideas and partnerships that improve food access.' }),
        ],
        settings: { background: 'light', anchorId: 'how-we-work' },
      }),
      await textImage({
        heading: 'Our network and partners offer many resources to serve Manatee residents',
        listStyle: 'checklist',
        body: [
          ...paragraphs('This includes resources for the elderly, homeless, undocumented, LGBTQIA, and disabled community members, including:'),
          ...bulletList([
            'Building Belonging — inclusive best practices for food pantries',
            'Feeding Our Youth — free breakfast for all students in the Manatee County school district',
            'Seniors Struggling with Hunger — 49% of Manatee residents over 65 are below the ALICE threshold',
            'Serving Those Who Served — considerations for veterans and military families',
          ]),
        ],
        imgFile: 'img/food-people-collage.jpg',
        imgAlt: 'Collage of Manatee County neighbors, volunteers, and fresh produce',
        imageStyle: 'cover',
        mediaPosition: 'left',
        actions: [action('primary', intLink('See All Resources', 'resources'))],
        settings: { anchorId: 'resource-highlights' },
      }),
      featureGrid({
        heading: 'Our Strategic Pillars',
        columns: 'four',
        markerStyle: 'icon',
        items: [
          featureItem({ markerIconKey: 'connection', title: 'Seamless Systems', description: 'Connecting agencies so clients move through services without barriers.' }),
          featureItem({ markerIconKey: 'funding', title: 'Resourcing Innovation', description: "Designing equity-driven ways to direct resources where they're needed most." }),
          featureItem({ markerIconKey: 'voice', title: 'Collective Voice', description: 'Centering the experiences of people who know food insecurity firsthand and are helping to drive solutions.' }),
          featureItem({ markerIconKey: 'data-sharing', title: 'Data Sharing', description: 'Building shared data tools so programs and projects are collaborative in nature.' }),
        ],
        trailingLink: intLink('See our full strategy →', 'our-strategy'),
        settings: { background: 'light', anchorId: 'our-strategic-pillars' },
      }),
      featureGrid({
        heading: 'Partner With Us',
        iconField: await image('img/manatee-orange.png', 'MFSN manatee icon'),
        columns: 'three',
        markerStyle: 'none',
        items: [
          featureItem({
            title: 'Join the Network',
            description:
              'Nonprofits, agencies & community orgs — No membership fee, no dollar commitment — just a seat at the table. Members join us four times a year at convenings and get newsletters and invitations along the way.',
            action: action('primary', extLink('Join the Mailing List', '#')),
          }),
          featureItem({
            title: 'Our Funders',
            description: "Funders & businesses — reach out to explore how your organization can support the network's work across Manatee County.",
            action: action('primary', extLink('Get in Touch', 'mailto:director@manateefood.org')),
          }),
          featureItem({
            title: 'Spread the Word',
            description: 'Word of mouth is one of the network’s strongest tools — help us reach the partners and residents who need to know about this work.',
            action: action('primary', extLink('Share the Network', '#')),
          }),
        ],
        settings: { background: 'gold', anchorId: 'partner-pathways' },
      }),
      statGrid({
        heading: 'Manatee Food Security Network At A Glance',
        columns: 'three',
        stats: [
          stat({ number: '75+', label: 'Member Organizations', link: intLink('See who →', 'our-network') }),
          stat({ number: '4', label: 'Strategic Pillars Guiding the Work' }),
          stat({ number: '243', label: 'People Served in our Navigator Pilot Program' }),
        ],
        settings: { anchorId: 'at-a-glance' },
      }),
      richText({
        eyebrow: 'Our Initiatives',
        heading: 'Navigator Pilot Program',
        proseStyle: 'spotlight',
        body: paragraphs(
          "Born out of community listening sessions and building on Kim's Krew's work — where families saw real stabilization within a 90-day window — the Navigator Pilot paired guaranteed food security with hands-on case management with Women's Resource Center. Participating households received $250 grocery gift cards per household member for 90 days, paired with a dedicated Navigator to help them use that stability to move forward.",
          'Here are some initial results as of August 2026:',
        ),
        settings: { anchorId: 'navigator-pilot-program' },
      }),
      statGrid({
        columns: 'three',
        itemStyle: 'band',
        stats: [
          stat({ number: '72', label: 'Manatee County Participants' }),
          stat({ number: '243', label: 'Household Members Represented' }),
          stat({ number: '239', label: 'Case Management Sessions' }),
        ],
      }),
      richText({
        caveatText:
          'Please note that preliminary outcome data reflects the 26 participants who had completed their final surveys at the time of this analysis.',
        body: [],
        columns: [
          {
            headingText: 'Early Participant Outcomes',
            headingTag: 'h4',
            body: bulletList([
              '96% of final-survey respondents reported more nutritious food (increased fruits, vegetables, & protein).',
              '88% reported improved mental health. Respondents used money freed up by grocery assistance for priorities such as rent and utilities, debt, transportation, savings, health care, childcare, and legal expenses.',
              'Participants reported improved behaviors: From Survival → Stability, From Crisis Decisions → Proactive Planning, From Meal Rationing → Nutrition.',
              '77% greater focus on education, jobs, & children’s wellbeing.',
            ]),
          },
          {
            headingText: 'Case Management Was a Core Intervention',
            headingTag: 'h4',
            body: bulletList([
              'Participants completed 239 documented meetings — an average of 3.3 per participant.',
              '93% of follow-up records reported progress toward goals.',
              '57% of participants with longitudinal barrier data disclosed at least one new need after intake, underscoring the value of repeated, relationship-based contact.',
              'Half of participants received active resource advising related to mental health, legal needs, childcare, public benefits, employment, education, housing, transportation, health care, or financial planning.',
            ]),
          },
        ],
      }),
      calloutBand({
        label: 'What the Model Demonstrates:',
        statement: 'Grocery assistance created breathing room; case management helped participants use that breathing room to move forward.',
        body: 'The direct benefit reduced immediate food pressure, while trusted, flexible check-ins helped participants identify needs, connect with resources, and work toward longer-term stability.',
        color: 'blue',
      }),
      calloutBand({
        label: 'Looking Ahead:',
        statement: 'Food insecurity declined substantially, but broader financial distress remains.',
        body: 'At intake, 46% reported expenses greater than income, and matched records continued to show significant financial trouble. The remaining participants are expected to complete final surveys within the next 30 days; outcomes will be updated when the full set is available.',
        color: 'green',
      }),
      await textImage({
        eyebrow: 'Our Initiatives',
        heading: 'USF Data & Mapping',
        proseStyle: 'spotlight',
        body: paragraphs(
          "In partnership with the University of South Florida's Center for the Advancement of Food Security and Healthy Communities, led by Dr. David Himmelgreen and PhD candidate Deven Gray, MFSN is updating its community food security map through surveys and interviews with network providers. The project is gathering current data on services, capacity, and gaps across Manatee County's food security landscape.",
          'So far, 40+ providers have participated through surveys and interviews. Results and an updated interactive map are forthcoming.',
        ),
        imgFile: 'img/map-project.png',
        imgAlt: 'USF community food security mapping project',
        mediaPosition: 'left',
        actions: [action('outlineGold', intLink("View Last Year's Map", 'data-mapping'))],
        settings: { anchorId: 'usf-data-mapping' },
      }),
      newsGrid({
        heading: 'Manatee Food Security Network in the News',
        mentionIds: ['newsMention.fox13', 'newsMention.parrish-civic-association', 'newsMention.bradenton-times-shutdown'],
        trailingLink: intLink('More MFSN in the News', 'in-the-news'),
      }),
      await textImage({
        heading: 'ALICE in Manatee County',
        proseStyle: 'spotlight',
        body: paragraphs(
          'ALICE is an acronym for Asset Limited, Income Constrained, Employed — households that earn more than the Federal Poverty Level, but less than the basic cost of living for the county. While conditions have improved for some households, many continue to struggle, especially as wages fail to keep pace with the rising cost of household essentials (housing, child care, food, transportation, health care, and a basic smartphone plan). Households below the ALICE Threshold — ALICE households plus those in poverty — can’t afford the essentials.',
        ),
        imgFile: 'img/alice-manatee.png',
        imgAlt: 'ALICE in Manatee County graphic',
        mediaPosition: 'right',
        actions: [action('outlineGold', extLink('View the ALICE Report', 'https://www.unitedforalice.org/county-reports/florida'))],
        settings: { anchorId: 'alice-in-manatee-county' },
      }),
      {
        _type: 'newsletterSignup',
        _key: key('newsletter'),
        heading: 'Get Network Updates',
        description: 'Sign up to hear about network news, meetings, and opportunities to get involved.',
        formAction: undefined,
      },
      await textImage({
        heading: 'Find Free Food',
        body: paragraphs('Looking for food assistance today? Here are a few places to start.'),
        imgFile: 'img/find-food-now-sq.jpg',
        imgAlt: 'Fresh produce at a Manatee County food distribution',
        mediaPosition: 'left',
        actions: [action('primary', intLink('Find Food Now', 'find-food-now'))],
        settings: { background: 'light', anchorId: 'find-food-now' },
      }),
    ],
  });

  // ---- Our Network ----
  pages.push({
    _id: 'page.our-network',
    _type: 'page',
    title: 'Our Network',
    slug: { _type: 'slug', current: 'our-network' },
    seo: { metaTitle: 'Our Network | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Our Network', imgFile: 'img/our-network.jpeg', imgAlt: 'Manatee Food Security Network partners' }),
      richText({
        body: paragraphs(
          'The Manatee Food Security Network is made up of nonprofits, faith communities, government agencies, healthcare providers, foundations, schools, and businesses working together to close gaps in food access across Manatee County. Explore our partner organizations below — select any logo or name to visit their website.',
        ),
      }),
      await logoCloud({ heading: '79 Partner Organizations', display: 'fullCards', partners: NETWORK_PARTNERS }),
    ],
  });

  // ---- Leadership ----
  pages.push({
    _id: 'page.leadership',
    _type: 'page',
    title: 'Our Leadership',
    slug: { _type: 'slug', current: 'leadership' },
    seo: { metaTitle: 'Our Leadership | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Support Team', imgFile: 'img/leadership-hero.jpg', imgAlt: 'Manatee Food Security Network team having a conversation' }),
      await teamGrid({
        display: 'cards',
        people: [
          { name: 'Carlo Cuesta', role: 'Co-Founder, Creation in Common', email: 'carlo@creationincommon.com', file: 'img/carlo.png' },
          { name: 'Emily Grant', role: 'Project Manager', email: 'emilygrant@foodrecovery.org', file: 'img/emily-sq.png' },
          { name: 'Kallie Akinola', role: 'Senior Associate, Creation in Common', email: 'kallie@creationincommon.com', file: 'img/kallie.png' },
          { name: 'Wendy Deming', role: 'CEO, The Bishop-Parker Foundation', email: 'wendy@bishopparkerfoundation.org', file: 'img/wendy.png' },
        ],
      }),
    ],
  });

  // ---- Steering Committee ----
  pages.push({
    _id: 'page.steering-committee',
    _type: 'page',
    title: 'Steering Committee',
    slug: { _type: 'slug', current: 'steering-committee' },
    seo: { metaTitle: 'Steering Committee | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Steering Committee', imgFile: 'img/steering-committee.jpg', imgAlt: 'Steering Committee presentation at a network convening' }),
      richText({
        heading: 'Our Objectives, Structure and Deliverables',
        body: [
          heading('The Steering Committee governs, provides strategic oversight, accountability, and stakeholder representation.', 'h3'),
          heading('Structure:', 'h3'),
          ...bulletList([
            'Steering Committee Composition: Members commit to one year and are selected to ensure alignment with the mission, equity values, and early strategic needs of the MFSN.',
            'Selection Criteria: Prioritize a cross-section of community voices (nonprofits, public agencies, Chamber of Commerce, grassroots leaders, residents with lived experience, funders).',
            'Evolution: The Steering Committee will set the structure for MFSN.',
          ]),
          heading('Deliverables:', 'h3'),
          ...bulletList([
            'Approve budget',
            'Discuss and provide feedback for work plan',
            'Provide guidance for projects and programs funded and overseen by the Manatee Food Security Network, such as the Navigator Pilot Program and the USF Data Mapping Project',
            'Develop needed working groups, such as Cooperative Distribution',
          ]),
        ],
        settings: { background: 'gray', width: 'narrow' },
      }),
      await teamGrid({
        heading: '2026 Members',
        intro:
          'We are honored to have this committed group of members who are dedicating additional time to guide the Manatee Food Security Network to ensure alignment with the mission, equity values, and early strategic needs of the network.',
        introImageFile: 'img/steering-committee-body-img.jpg',
        introImageAlt: 'Steering Committee members at a convening',
        display: 'list',
        people: [
          { name: 'Anne Miller', role: 'Community Harvest SRQ' },
          { name: 'Bonnie Hardy Ramseur', role: 'Multicultural Health Institute' },
          { name: 'Carey Miller', role: 'Manatee Chamber of Commerce' },
          { name: 'Dan Friedrich', role: 'St. Joseph Food Pantry' },
          { name: 'Frank Perry', role: 'Meals on Wheels Plus of Manatee' },
          { name: 'Heather Brooke', role: 'Good Neighbors' },
          { name: 'Kathleen Cramer', role: 'Turning Points' },
          { name: "Lillian Elliott", role: "Women's Resource Center" },
          { name: 'Marisol Garcia', role: "Kim's Krew" },
          { name: 'Melissa Rosenburg Ehrmann', role: 'WIC' },
          { name: 'Moses VanNort', role: 'One More Child' },
          { name: 'Skye Grundy', role: 'School District of Manatee County' },
          { name: 'Tracie Adams', role: 'Manatee County Government' },
        ],
      }),
    ],
  });

  // ---- Member Connection ----
  pages.push({
    _id: 'page.member-connection',
    _type: 'page',
    title: 'Member Connection',
    slug: { _type: 'slug', current: 'member-connection' },
    seo: { metaTitle: 'Member Connection | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Connect. Coordinate. Collaborate.', imgFile: 'img/our-network.jpeg', imgAlt: 'Manatee Food Security Network partners' }),
      richText({
        heading: 'Manatee Food Security Network members connect using Hylo.',
        body: paragraphs(
          'The Hylo app is a communication and collaboration tool designed for groups and communities to connect, organize, and work together. It offers us:',
        ),
      }),
      featureGrid({
        columns: 'four',
        markerStyle: 'icon',
        items: [
          featureItem({ markerIconKey: 'resources', title: 'Resources', description: 'Share and organize documents, links, and materials to draw on shared knowledge without digging through past posts.' }),
          featureItem({ markerIconKey: 'discussions', title: 'Discussions', description: 'Post threaded, in-depth conversations—with rich text, images, files, video, and topic tags—for things like announcements, questions, and idea-sharing.' }),
          featureItem({ markerIconKey: 'coordination', title: 'Group Coordination', description: 'Project tools that help our group work together toward common goals.' }),
          featureItem({ markerIconKey: 'messaging', title: 'Direct & Group Messaging', description: 'Private messaging and group chat for real-time conversation, whenever you need it.' }),
        ],
      }),
      await textImage({
        heading: 'Ready to Join?',
        body: [
          ...paragraphs('Want to join? Ask for an invitation by emailing director@manateefood.org.'),
          ...paragraphs('Then download the app on Google Play or Apple (or access on the web).'),
          heading('Want the step-by-step tutorial?', 'h3'),
          ...paragraphs('Get our guide here: https://drive.google.com/file/d/1NtXobzeZd3YtYCHcEhKc811Pv8ZNUMJc/view?usp=sharing'),
        ],
        mediaPosition: 'none',
        callout: {
          heading: 'HYLO',
          body: 'Ready to join? Email director@manateefood.org for an invitation, then download the app to get started.',
          style: 'card',
          position: 'right',
          action: action('primary', extLink('Login on the Web', 'https://www.hylo.com/')),
        },
      }),
    ],
  });

  // ---- Meeting Documents ----
  pages.push({
    _id: 'page.meeting-documents',
    _type: 'page',
    title: 'Meeting Documents',
    slug: { _type: 'slug', current: 'meeting-documents' },
    seo: { metaTitle: 'Meeting Documents | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Meeting Documents', imgFile: 'img/meeting-documents.jpg', imgAlt: 'Meeting documents' }),
      await textImage({
        heading: '2023–Present',
        body: paragraphs('To view previous meetings and notes, select the year below.'),
        imgFile: 'img/convening.jpg',
        imgAlt: 'Network partners at a convening',
        imageStyle: 'rounded',
        mediaPosition: 'left',
        linkList: [
          { _type: 'link', _key: key('link'), label: '2026', externalUrl: 'https://www.manateefood.org/our-network/meeting-documents/2026' },
          { _type: 'link', _key: key('link'), label: '2025', externalUrl: 'https://drive.google.com/drive/folders/1atuTwQRhBlU8BvvgXFEN9XJMwg08uOjs' },
          { _type: 'link', _key: key('link'), label: '2024', externalUrl: 'https://drive.google.com/drive/folders/115uKCI-mxhy3d4fG94B5aSWNh2DdkjLf' },
          { _type: 'link', _key: key('link'), label: '2023', externalUrl: 'https://drive.google.com/drive/folders/17oNbAe30N8xkSlTUOgbmuOkR1F-A-qdQ' },
          { _type: 'link', _key: key('link'), label: 'Download logos', externalUrl: 'https://www.manateefood.org/our-network/meeting-documents/logo' },
          { _type: 'link', _key: key('link'), label: 'Who We Are Graphic', externalUrl: 'https://www.manateefood.org/uploads/who-we-are-mfsn-2026.pdf' },
        ],
      }),
    ],
  });

  // ---- In the News ----
  pages.push({
    _id: 'page.in-the-news',
    _type: 'page',
    title: 'In the News',
    slug: { _type: 'slug', current: 'in-the-news' },
    seo: { metaTitle: 'In the News | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'In the News', imgFile: 'img/in-the-news.jpg', imgAlt: 'Manatee Food Security Network in the news' }),
      newsGrid({
        heading: 'Manatee Food Security Network in the News',
        mentionIds: [
          'newsMention.fox13',
          'newsMention.parrish-civic-association',
          'newsMention.bradenton-times-shutdown',
          'newsMention.bradenton-times-collaborative-solution',
          'newsMention.the-gauntlet',
        ],
      }),
    ],
  });

  // ---- Our Strategy ----
  pages.push({
    _id: 'page.our-strategy',
    _type: 'page',
    title: 'Our Strategy',
    slug: { _type: 'slug', current: 'our-strategy' },
    seo: { metaTitle: 'Our Strategy | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Our Strategy', imgFile: 'img/market-2-jodi-carroll.jpeg', imgAlt: 'Shoppers browsing a street farmers market, with fresh peppers and cucumbers in the foreground' }),
      featureGrid({
        heading: 'Our Four-Pronged Strategy',
        columns: 'four',
        markerStyle: 'numeral',
        items: [
          featureItem({ title: 'Convening of the Collective Voice', description: 'Bringing voices together to impact public and funder understanding of the consumer experience, and to cooperate on building and strengthening food security in Manatee County.' }),
          featureItem({ title: 'Data Sharing & Coordination', description: 'Building shared data practices focused on the most impactful metrics, to better understand need, drive decision-making, and close operational gaps through stronger resource coordination.' }),
          featureItem({ title: 'Build Capacity for Seamless Systems', description: 'Collaborating for better coordination and exploring integration of health and human services to address root causes of food insecurity.' }),
          featureItem({ title: 'Resourcing System Innovation', description: "Seeking innovative solutions and expanded funding for the Food Security Network's challenges." }),
        ],
      }),
      pullQuote({
        quote: 'Food security is a leading indicator of financial distress, not a lagging indicator.',
        citationName: 'Carlo Cuesta',
        citationDetail: 'November 2025',
      }),
      await twoColumnImageSection({
        heading: '2026 Focus',
        columns: [
          {
            heading: 'Convening the Collective Voice',
            imgFile: 'img/convening-the-collective-voice.jpg',
            imgAlt: 'Network partners at a strategy convening',
            body: [
              heading("Manatee County's Food Insecurity Crisis", 'h4'),
              ...bulletList([
                '1 in 8 are unsure where their next meal is coming from.',
                'Hunger meets a lack of access to affordable, nutritious food amid rising costs.',
                'Impossible tradeoffs, like gas in the car or food tonight.',
                'Unexpected crises.',
              ]),
              heading('Our Approach: Solutions in Action', 'h4'),
              ...numberedList(['Address the root causes.', "Deliver food where it's needed.", 'Center lived experience.']),
              heading('How the Network Makes a Difference', 'h4'),
              ...bulletList(['50+ organizations.', 'Community-powered models.', 'Solutions are built with, not just for, the people we serve.']),
            ],
          },
          {
            heading: 'Building Capacity for Seamless Systems',
            imgFile: 'img/food-people-collage.jpg',
            imgAlt: 'Collage of Manatee County neighbors, volunteers, and fresh produce',
            body: [
              heading('Navigator Pilot Program Objectives', 'h4'),
              ...bulletList([
                'Identify and engage 50–100 families through existing, trusted food network relationships.',
                'Deploy Navigators to meet with families, assess food needs, and ensure reliable access to nutrition for 90 days through grocery store gift cards.',
                'Coordinate wraparound support for families facing additional hardships.',
                'Document family experiences and outcomes, working with evaluators to track progress over six months.',
                'Use pilot insights to refine and scale a long-term food security and support strategy.',
              ]),
            ],
            noteText: "This project will be in partnership with the Women's Resource Center.",
            actions: [action('primary', extLink("Learn about Women's Resource Center", 'https://www.mywrc.org/'))],
          },
        ],
      }),
    ],
  });

  // ---- Talking Points ----
  pages.push({
    _id: 'page.talking-points',
    _type: 'page',
    title: 'Talking Points',
    slug: { _type: 'slug', current: 'talking-points' },
    seo: { metaTitle: 'Talking Points | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Talking Points', imgFile: 'img/carlo-mfsn.jpg', imgAlt: 'Manatee Food Security Network partners at a convening' }),
      richText({
        proseStyle: 'lead',
        body: paragraphs('Out in the community? Not sure what to say? Use these helpful talking points below.'),
        settings: { width: 'narrow' },
      }),
      richText({
        body: [
          heading('Manatee County has a serious food insecurity crisis:', 'h2'),
          ...bulletList([
            '"Hungry" is everywhere — in houses you would never imagine. You could be doing well but then have a setback or a medical crisis: this issue can hit anywhere.',
            'Food insecurity is a crisis affecting 12% of our neighbors — working families, retirees, children, and business owners — across Manatee County.',
            "It's not just about emergency needs; it's about a lack of access to affordable, nutritious food.",
            'There are so many tradeoffs many face — between rent and groceries, or medical bills and meals, just as two examples.',
            'This issue deeply impacts working families, who can fall just outside the safety net but still struggle to feed their families.',
          ]),
          heading('There are solutions. Three we are focused on:', 'h2'),
          ...bulletList([
            'Targeting the root causes of hunger — like access, cost, and transportation.',
            'Getting food to where it’s needed — with mobile food hubs, culturally appropriate selections, and neighborhood-driven models like discount groceries.',
            'Elevating community leadership — so solutions can be designed by those who live with food insecurity.',
          ]),
          heading('How the Manatee Food Security Network can make a difference:', 'h2'),
          ...bulletList([
            'The Network is shifting from traditional delivery systems to new ways to get food to those who need it.',
            "By uniting 50+ organizations — from large nonprofits to grassroots community groups — we're collaborating to turn shared knowledge into long-term change.",
            "We're ensuring that community voices drive the work from day one — so the Network grows with, not just for, the people it serves.",
          ]),
        ],
        settings: { width: 'narrow' },
      }),
      richText({
        heading: 'Fast Facts: Food Prices and Hunger',
        proseStyle: 'spotlight',
        body: paragraphs(
          'Fast facts on hunger in Manatee County as of November 2025 with links to USDA reports and local survival budgets.',
          'This informational sheet is helpful to know and use when speaking about hunger in Manatee County.',
        ),
        actions: [action('primary', extLink('Download Fast Facts (PDF)', '/uploads/data-around-food-costs-september-2026.pdf'))],
        settings: { background: 'tinted', alignment: 'center', width: 'narrow', anchorId: 'fast-facts-hunger' },
      }),
    ],
  });

  // ---- Data & Mapping ----
  pages.push({
    _id: 'page.data-mapping',
    _type: 'page',
    title: 'Data & Mapping',
    slug: { _type: 'slug', current: 'data-mapping' },
    seo: { metaTitle: 'Data & Mapping | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Data & Mapping', imgFile: 'img/data-mapping-bg.jpg', imgAlt: 'Manatee Food Security Network' }),
      richText({
        heading: 'Mapping Services and Access in Manatee County',
        body: paragraphs(
          "No single organization can see the whole food security landscape in Manatee County. A pantry in one neighborhood might not know that another program a mile away offers the same service, while a different part of the county has no food assistance at all. MFSN's interactive map closes that gap. It gives providers, funders, and residents a shared picture of what's available, where efforts overlap, and where help is still needed most.",
          "MFSN built this map in partnership with the University of South Florida and maintains it on an ongoing basis so the picture stays current. Right now, MFSN is running a new round of surveys and interviews with network providers to update it. The University of South Florida's Center for the Advancement of Food Security and Healthy Communities is leading that research, directed by Dr. David Himmelgreen with PhD candidate Deven Gray coordinating the fieldwork.",
          'More than 40 providers have already taken part. When the research is finished, MFSN will release the findings along with a refreshed version of the map.',
        ),
        settings: { width: 'narrow' },
      }),
      richText({
        heading: 'Manatee Food Mapping',
        body: paragraphs(
          'This map is intended to illustrate food access based on pantry, grocers, schools and Summer Break Spots, showing locations and hours.',
          'Updated July 2025',
        ),
        mapEmbed: { embedUrl: 'https://www.google.com/maps/d/embed?mid=1TJ33spOr6fhmnqTi-2EiM3uGg-wtbDU', title: 'Manatee Food Mapping' },
        settings: { background: 'tinted', width: 'narrow' },
      }),
      richText({
        heading: 'Food Map Chart',
        body: [
          ...paragraphs(
            'This is the same information above, but in a chart. It lists various food assistance providers in the Bradenton, Florida area, including pantries, summer BreakSpot locations, and large volume food distributors.',
            'The document is organized into categories such as:',
          ),
          ...bulletList([
            'Low-level pantry access (By appointment, members only or 1 day per week/month)',
            'High-level pantry access (8+ days per month)',
            'Summer BreakSpots (only during summer)',
            'Large Volume Food Distributors (Food Banks, Walmart, ALDI)',
          ]),
          ...paragraphs('Updated July 2025'),
        ],
        actions: [action('primary', extLink('Resource: Food Map Chart (PDF)', 'https://drive.google.com/file/d/1sINE13NCgk7lhO-hasoy0rmCBvvIGnap/view'))],
        settings: { width: 'narrow' },
      }),
    ],
  });

  // ---- Unite Us ----
  pages.push({
    _id: 'page.unite-us',
    _type: 'page',
    title: 'Unite Us',
    slug: { _type: 'slug', current: 'unite-us' },
    seo: { metaTitle: 'Unite Us | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Unite Us', subheading: 'Referral Program', imgFile: 'img/one-more-child-tour-6-23-26.jpg', imgAlt: 'Volunteer delivering food assistance to a family' }),
      await textImage({
        heading: 'Community Resource',
        callout: {
          heading: "Let's Build a Stronger Network",
          body: "Join Manatee County FL and partner with Unite Us to deliver whole person care. By connecting with like-minded organizations, we can work together to support healthier communities and make a meaningful impact.",
          style: 'pink',
          position: 'left',
        },
        body: [
          ...paragraphs(
            'Unite Us is a free tool to help improve quality outcomes for children and families. Organizations use it to connect with other service providers, refer clients to local services, learn when needs have been met, and more efficiently track data to show individual organization and community impact.',
            'To learn more about joining the growing number of Manatee and Sarasota-based human service and education organizations using the Unite Us platform, email UniteUsManatee@mymanatee.org.',
          ),
        ],
        mediaPosition: 'none',
        actions: [action('primary', extLink('Join Unite Us (Free)', 'https://uniteus.com/networks/florida/'))],
      }),
      await logoCloud({ heading: 'In Partnership With', display: 'chips', partners: UNITE_US_PARTNERS }),
    ],
  });

  // ---- Working Groups ----
  pages.push({
    _id: 'page.working-groups',
    _type: 'page',
    title: 'Working Groups',
    slug: { _type: 'slug', current: 'working-groups' },
    seo: { metaTitle: 'Working Groups | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Working Groups', subheading: 'Cooperative Distribution Group', imgFile: 'img/working-group.jpg', imgAlt: 'A bin of pumpkins recovered for distribution' }),
      richText({
        body: [
          ...paragraphs(
            'The Cooperative Distribution Group brings together a small network of local partners including Good Neighbors, One More Child, Meals on Wheels Plus, Parrish United Methodist and St. Joseph’s food pantry, who meet regularly to coordinate food recovery and distribution across Manatee County.',
            'By working together, these organizations are able to re-recover food that might otherwise go to waste, share resources more efficiently, and get food to residents faster. Since launching, the group has redistributed over 300,000 pounds of food among its members.',
          ),
          heading('Member organizations:', 'h3'),
          ...bulletList(['Good Neighbors', 'Meals on Wheels Plus of Manatee', 'One More Child', 'Parrish United Methodist', "St. Joseph's Pantry"]),
        ],
        settings: { width: 'narrow' },
      }),
      richText({
        heading: 'Working group members are encouraged to participate in RescueRoute',
        body: paragraphs(
          "The Problem: An estimated 30–40% of the U.S. food supply goes to waste, often after it has already been picked, packed, and shipped. When a load is rejected at the receiving dock—for a dented case, a missed delivery window, or a paperwork mismatch—the driver has hours, not days, to find this perfectly edible food a new home. Most drivers have no easy way to reach a nonprofit, no time to call around, and no visibility into who needs what. The food is landfilled, and both the driver and the shipper absorb the loss. This in-transit stage of the supply chain remains one of the least tracked and least understood sources of food loss nationally–one that can be leveraged to support food security efforts.",
          'The solution co-designed by FoodRecovery.org and Epic-Cure: RescueRoute lets a driver post a rejected load as a donation directly from the cab in minutes. The app uses OCR to read load details from a scanned bill of lading, finds nearby nonprofits within the driver\'s chosen delivery radius, and notifies subscribed nonprofits by push, email, or SMS the instant a donation is posted. Both parties confirm the handoff in-app, generating a documented, verified donation record for the donor\'s tax deduction and ESG reporting, and unprecedented data on an unmapped category of in-transit food loss.',
        ),
        settings: { background: 'tinted', width: 'narrow' },
      }),
    ],
  });

  // ---- Find Food Now ----
  pages.push({
    _id: 'page.find-food-now',
    _type: 'page',
    title: 'Find Food Now',
    slug: { _type: 'slug', current: 'find-food-now' },
    seo: { metaTitle: 'Find Food Now | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Find Food Now', imgFile: 'img/cucumbers.jpeg', imgAlt: 'Fresh produce at a Manatee County food distribution' }),
      featureGrid({
        heading:
          "Below are links to our partners who update their food distribution lists regularly. Many of our local pantries partner with these food banks — use their search features to find a pantry near you.",
        columns: 'two',
        markerStyle: 'logoImage',
        items: [
          featureItem({
            markerImage: await image('img/meals-on-wheels.jpg', 'Meals on Wheels PLUS of Manatee'),
            title: 'Food Bank of Manatee',
            description: "English and Spanish versions available. Scroll to the calendar to find today's date for available food distributions and pantries near you.",
            action: action('primary', extLink('Find Food in Manatee', 'https://mealsonwheelsplus.org/food-bank-of-manatee/food-pantries/')),
          }),
          featureItem({
            markerImage: await image('img/feeding-tampa-bay.jpg', 'Feeding Tampa Bay'),
            title: 'Feeding Tampa Bay',
            description: 'Find a pantry based on your current location, or use the calendar feature to see nearby distributions today.',
            action: action('primary', extLink('Find Food in Tampa Bay', 'https://feedingtampabay.org/findfood/')),
          }),
        ],
      }),
    ],
  });

  // ---- Privacy Policy (no hero image, per explicit decision) ----
  pages.push({
    _id: 'page.privacy-policy',
    _type: 'page',
    title: 'Privacy Policy',
    slug: { _type: 'slug', current: 'privacy-policy' },
    seo: { metaTitle: 'Privacy Policy | Manatee Food Security Network', noIndex: true },
    pageBuilder: [
      richText({
        heading: 'Privacy Policy',
        body: [
          ...paragraphs(
            'This website uses Google Analytics, a web analytics service provided by Google LLC ("Google"). Google Analytics uses cookies—small text files stored on your device—to help us understand how visitors use the site.',
          ),
          heading('What we collect via Google Analytics:', 'h2'),
          ...bulletList(['Pages you visit and time spent on them', 'Approximate location (based on IP address)', 'Device and browser information']),
          ...paragraphs('We use this information only to improve the website and our content. Google may process this data in accordance with its own privacy practices.'),
          heading('Cookie information:', 'h2'),
          ...bulletList(['The main cookie used is "_ga," which helps distinguish one visitor from another. This cookie typically lasts for 2 years.']),
          heading('Email communications:', 'h2'),
          ...paragraphs(
            "If you provide us with your email address to receive updates, we collect and store it using Constant Contact, a third-party email marketing service. We use this information solely to send you the updates you've signed up for. Constant Contact may process this data in accordance with its own privacy practices. You can unsubscribe from these emails at any time using the link included in every email we send, or by contacting us directly.",
          ),
          heading('Your choices:', 'h2'),
          ...bulletList([
            'You can manage or disable cookies in your browser settings. If you disable cookies, some analytics features may not work properly.',
            'You can opt out of email communications at any time, as described above.',
            "For more information about how Google uses data, see Google's privacy policy and cookie information at https://policies.google.com/.",
            "For more information about how Constant Contact uses data, see their privacy policy at https://www.constantcontact.com/legal/privacy-statement.",
          ]),
          ...paragraphs('Last updated: August 15, 2026.'),
        ],
        settings: { width: 'narrow' },
      }),
    ],
  });

  // ---- Terms of Service (no hero image, per explicit decision) ----
  pages.push({
    _id: 'page.terms-of-service',
    _type: 'page',
    title: 'Terms of Service',
    slug: { _type: 'slug', current: 'terms-of-service' },
    seo: { metaTitle: 'Terms of Service | Manatee Food Security Network', noIndex: true },
    pageBuilder: [
      richText({
        heading: 'Terms of Service',
        body: [
          ...paragraphs(
            'Please read this Terms of Service ("Terms", "Terms of Service") carefully before using the manateefood.org website (the "Website") operated by Bishop-Parker Foundation, a(n) Nonprofit formed in Florida, United States ("us", "we", "our") as this Terms of Service contains important information regarding limitations of our liability. Your access to and use of this Website is conditional upon your acceptance of and compliance with these Terms. These Terms apply to everyone, including but not limited to visitors, users and others, who wish to access and use the Website.',
            'By accessing or using the Website, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you do not have our permission to access or use the Website.',
          ),
          heading('Prohibited uses', 'h2'),
          ...paragraphs(
            'You agree that you will use this Website in accordance with all applicable laws, rules, regulations and these Terms at all times. The following is a non-exhaustive list of prohibited uses of this Website. You agree that you will not perform any of the following prohibited uses:',
          ),
          ...bulletList([
            'Impersonating or attempting to impersonate Bishop-Parker Foundation or its employees, representatives, subsidiaries or divisions;',
            'Misrepresenting your identity or affiliation with any person or entity;',
            'Sending or attempting to send any advertising or promotional material, including but not limited to spam, junk mail, chain mail or any similar material;',
            "Engaging in any conduct that restricts or inhibits any person's use or enjoyment of the Website, or which, as determined in our sole discretion, may harm us or the users of this Website or expose us or other users to liability;",
            "Using the Website in any manner that could disable, overburden, damage or impair the Website or interfere with another party's use of the Website;",
            'Using any robot, spider or other similar automatic technology, process or means to access or use the Website for any purpose, including monitoring or copying any of the material on this Website;',
            'Using any manual process or means to monitor or copy any of the material on this Website or for any other unauthorized purpose;',
            'Using any device, software, means or routine that interferes with the proper working of the Website, including but not limited to viruses, trojan horses, worms, logic bombs or other such materials;',
            'Attempting to gain unauthorized access to, interfering with, damaging or disrupting any parts of the Website, the server(s) on which the Website is stored, or any server, computer or database connected to the Website;',
            'Attempting to attack or attacking the Website via a denial-of-service attack or a distributed denial-of-service attack;',
            'Otherwise attempting to interfere with the proper working of the Website;',
            'Using the Website in any way that violates any applicable federal, state or local laws, rules or regulations.',
          ]),
          heading('No warranty on Website', 'h2'),
          ...paragraphs(
            'This Website is provided "as is". No warranty, express or implied (including any implied warranty of merchantability, of satisfactory quality or fitness for a particular purpose or use) shall apply to this Website, whether arising by law, course of dealing, course of performance, usage of trade or otherwise.',
          ),
          heading('Availability, errors and inaccuracies', 'h2'),
          ...paragraphs(
            'We assume no liability for the availability, errors or inaccuracies of the information, products or services provided on this Website. We may experience delays in updating information on this Website and in our advertising on other websites. The information, products and services found on the Website may contain errors or inaccuracies or may not be complete or current. Products or services may be incorrectly priced or unavailable. We expressly reserve the right to correct any pricing errors on our Website. The inclusion or offering of any product or service on this Website does not constitute an endorsement or recommendation of such product or service by us.',
          ),
          heading('Damages and limitation of liability', 'h2'),
          ...paragraphs(
            'In no event shall Bishop-Parker Foundation be liable for any direct, indirect, punitive, incidental, special or consequential damages arising out of, relating to or in any way connected with your access to, display of or use of this Website or with the delay or inability to access, display or use this Website, including but not limited to your reliance upon opinions or information appearing on this Website; any computer viruses, information, software, linked websites operated by third parties, products or services obtained through this Website, whether based on a theory of negligence, contract, tort, strict liability, consumer protection statutes or otherwise, even if Bishop-Parker Foundation has been advised of the possibility of such damages.',
            'The aggregate liability of Bishop-Parker Foundation arising out of or relating to this Website, whether arising out of or related to breach of contract, tort (including negligence) or otherwise shall be limited to the amount of fees actually received by Bishop-Parker Foundation from you.',
            'This limitation of liability reflects the allocation of risk between you and us. The limitations specified in this section will survive and apply even if any limited remedy specified in these Terms of Use is found to have failed of its essential purpose. The limitations of liability provided in these Terms of Use inure to the benefit of Bishop-Parker Foundation.',
          ),
          heading('Links to third party websites', 'h2'),
          ...paragraphs(
            'This Website may contain hyperlinks to websites operated by third parties and not by us. We provide such hyperlinks for your reference only. We do not control such websites and are not responsible for their contents or the privacy or other practices of such websites. Further, it is your responsibility to take precautions to ensure that whatever links you click on or software that you download, whether from this Website or other websites or applications, is free of such items as viruses, worms, trojan horses, defects and other items of a destructive nature. Our inclusion of hyperlinks to such websites does not imply any endorsement of the material on such websites or any association with their operators.',
          ),
          heading('Intellectual property and DMCA notice and procedure for intellectual property infringement claims', 'h2'),
          ...paragraphs(
            'All contents of this Website are © 2025 - 2026 Bishop-Parker Foundation or third parties. All rights reserved. Unless specified otherwise, this Website and all content and other materials on this Website including but not limited to all logos, designs, text, graphics, pictures, information, data, software, sound files and arrangement thereof (collectively, "Content") are the proprietary property of Bishop-Parker Foundation and are either registered trademarks, trademarks or otherwise protected intellectual property of Bishop-Parker Foundation or third parties in the United States and/or other countries.',
            'If you are aware of a potential infringement of our intellectual property, please contact Emily Grant at director@manateefood.org.',
            'We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Website infringes on the copyright, trademark or other intellectual property rights of any person or entity.',
            'If you believe in good faith that the Content infringes on your intellectual property rights, you or your agent may send us a written notice of such infringement titled "Infringement of Intellectual Property Rights - DMCA." Your notice to us must include the following information:',
          ),
          ...bulletList([
            "An electronic or physical signature of the person authorized to act on behalf of the owner of the intellectual property right's interest;",
            'A description of the work that you claim has been infringed, including the URL (i.e., web page address) of the location where the work exists or a copy of the work;',
            'Your name, email, address and telephone number; and',
            "A statement by you that you have a good faith belief that the disputed use is not authorized by the owner of the work, its agent or the law.",
          ]),
          ...paragraphs(
            "Please note that we will not process your complaint if it is not properly filled out or is incomplete. You may be held accountable for damages, including but not limited to costs and attorneys' fees for any misrepresentation or bad faith claims regarding the infringement of your intellectual property rights by the Content on this Website.",
            'You may submit your claim to us by contacting us at: Bishop-Parker Foundation, Emily Grant, director@manateefood.org, (941) 216-5423, 1111 9th Avenue West, Suite A, Bradenton, FL 34205, United States',
          ),
          heading('Governing law, severability, dispute resolution, venue and class action waiver', 'h2'),
          ...paragraphs(
            'These Terms shall be governed and construed in accordance with the laws of the state of Florida, United States, without regard to its conflict of laws provisions. These Terms shall not be governed by the United Nations Convention on Contracts for the Sale of International Goods, the Uniform Commercial Code, nor Incoterms.',
            'Our failure to enforce any right or provision of these Terms will not be considered a waiver of that right or provision. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between you and us regarding our Website, and supersede and replace any prior agreements we might have had with you regarding the Website.',
            'Any controversy or claim arising out of or relating to these Terms including but not limited to the interpretation or breach thereof shall be resolved in a court of competent jurisdiction in Manatee County, Florida.',
            'You and Bishop-Parker Foundation agree that each may bring claims against the other only in your or its individual capacity and not as a plaintiff or class member in any class or representative action.',
          ),
          heading('Changes to Terms of Service', 'h2'),
          ...paragraphs('We reserve the right to make changes to these Terms of Service at any time. We will not provide you with any notice when we make changes to this Terms of Service.'),
          heading('Questions', 'h2'),
          ...paragraphs('If you have any questions about our Terms of Service, please contact us at director@manateefood.org.'),
          ...paragraphs('Last updated: January 1, 2026.'),
        ],
        settings: { width: 'narrow' },
      }),
    ],
  });

  // ---- Resources & Safe Spaces ----
  pages.push({
    _id: 'page.resources',
    _type: 'page',
    title: 'Creating Safe Spaces',
    slug: { _type: 'slug', current: 'resources' },
    seo: { metaTitle: 'Creating Safe Spaces | Manatee Food Security Network' },
    pageBuilder: [
      await hero({ heading: 'Creating Safe Spaces', imgFile: 'img/resources-hero.jpg', imgAlt: 'Manatee Food Security Network partners and community members' }),
      richText({
        heading: 'This is a resource page for our network partners',
        body: paragraphs(
          'To best serve Manatee residents, especially vulnerable populations such as the elderly, homeless, undocumented, LGBTQIA, disabled and many others, these links provide helpful resources to inform staff and clients. While this is not an exhaustive list, it is a live resource page that is updated regularly. We want to feature your resources too! Please share them with us at director@manateefood.org',
        ),
      }),
      await resourceSpotlight({
        tags: ['category.accessibility', 'category.best-practices'],
        heading: 'Accessibility for Every Body',
        imgFile: 'img/resources-1.jpg',
        imgAlt: 'Community member',
        mediaPosition: 'left',
        body: [
          ...paragraphs('Accommodations to consider for those who have a physical disability:'),
          ...bulletList([
            'Room to move and a clear path to travel',
            'Easily accessible (no basements, elevators, long walks from the parking lot to entrance)',
            'Support from volunteers or staff to carry groceries',
            'Offer delivery service',
            'Reach range: check by sitting down in a chair and reaching to items; offer adaptive tools like a "reach/grab" tool',
            'For hard of hearing: offer more signage and option to write notes',
          ]),
        ],
        resourceLinks: [{ label: 'Resource: ADA Title III – Public Accommodations', url: 'https://www.ada.gov/topics/title-iii/' }],
        settings: { anchorId: 'accessibility' },
      }),
      await resourceSpotlight({
        tags: ['category.dei-inclusion', 'category.best-practices'],
        heading: 'Building Belonging',
        imgFile: 'img/resources-2.png',
        imgAlt: 'Building Belonging Course Guide — Best Practices for Inclusive Food Pantries',
        mediaPosition: 'right',
        body: [
          ...paragraphs('This is a guide to great best practices for inclusive food pantries. No time to read? Here is a quick (very quick) recap:'),
          ...bulletList([
            'Never assume: ask for pronouns!',
            'Be deliberate with your words',
            'Practice patience and kindness to overcome language barriers',
            'Offer translation of important information',
            'Eye contact and a smile can go a long way',
            'Engage on a deeper level: hire staff & volunteers from bicultural backgrounds',
            'Establish Client Advisory boards',
            'Offer culturally and religiously appropriate food preferences',
          ]),
        ],
        resourceLinks: [{ label: 'Resource: Best Practices for Inclusive Food Pantries', url: 'https://drive.google.com/file/d/17tlJRqOzazxMH7E34Imyd-tqyhFXSN1L/view' }],
        settings: { anchorId: 'building-belonging' },
      }),
      await resourceSpotlight({
        tags: ['category.youth-families'],
        heading: 'Feeding our Youth',
        imgFile: 'img/food-kids.jpg',
        imgAlt: 'Kids enjoying a meal',
        mediaPosition: 'left',
        body: paragraphs('Did you know that with the School District of Manatee County, breakfast is FREE for all students?'),
        resourceLinks: [
          { label: 'Community Eligibility Provision Schools: Free Breakfast and Lunch', url: 'https://www.manateeschools.net/o/sdmc/page/free-reduced-price-meal-benefits' },
          { label: 'School District of Manatee County Food and Nutrition Services', url: 'https://www.manateeschools.net/o/sdmc/page/food-nutrition-services' },
          { label: 'SchoolCafe (apply for benefits, view menus and more)', url: 'https://www.schoolcafe.com/ManateeCountySchools' },
        ],
        settings: { anchorId: 'feeding-youth' },
      }),
      await resourceSpotlight({
        tags: ['category.immigrant-community'],
        heading: 'UnidosNow',
        subheading: 'Build a welcoming space for immigrants',
        imgFile: 'img/UnidosNow_Logo_TagLine.png',
        imgAlt: 'UnidosNow — Educate · Elevate · Integrate',
        mediaPosition: 'right',
        body: bulletList([
          'Create signs in multiple languages with welcoming messages like "No ID, No Problem" or "Safe Space for ALL," and post them at your entrance.',
          'Through your signage and outreach, reassure clients that no personal information will ever be shared with outside entities or authorities, and that assistance is available to everyone, regardless of immigration status.',
          'If possible, bring food donations directly to clients if they are scared to leave their home or offer mobile food services that bring food closer to their homes.',
          'Share "Know Your Rights" cards with your clients so they are informed.',
        ]),
        resourceLinks: [{ label: 'Resource: UnidosNow Programs Overview', url: 'https://www.unidosnow.org/programs-overview' }],
        settings: { anchorId: 'unidosnow' },
      }),
      await resourceSpotlight({
        tags: ['category.homeless-unhoused', 'category.best-practices'],
        heading: 'Homeless Education 101',
        imgFile: 'img/partner logos/turning-points.gif',
        imgAlt: 'Turning Points — Where Compassion Takes Action',
        mediaPosition: 'left',
        body: [
          ...paragraphs('Considerations for serving the unhoused and homeless:'),
          ...bulletList([
            'Offer ready-to-eat and easy-to-prepare food that does not require heating, cooking, refrigeration or cutting (such as sandwiches, cut fruit, single serving drinks, protein bars, etc.)',
            'Offer hygiene kits',
            'Find resources for ADA-accessible showers and laundry service that can be shared during distribution or meal service',
            'Build rapport by educating volunteers, staff and donors on the complexity of homelessness, to think about assumptions and stereotypes (review the Building Belonging Guide)',
            'Offer mobile pantries and hours that fit the clients',
          ]),
        ],
        resourceLinks: [{ label: 'Resource: Turning Points', url: 'https://tpmanatee.org/partners-and-links/' }],
        settings: { anchorId: 'homeless-education' },
      }),
      await resourceSpotlight({
        tags: ['category.immigrant-community', 'category.legal-rights'],
        heading: 'Immigrant Legal Resource Center',
        subheading: 'Red Cards / Tarjetas Rojas',
        imgFile: 'img/immigrant-legal-resource-center.png',
        imgAlt: 'Immigrant Legal Resource Center',
        mediaPosition: 'right',
        body: paragraphs(
          "All people in the United States, regardless of immigration status, have certain rights and protections under the U.S. Constitution. The ILRC's red cards give examples of how people can exercise these rights. However, they do not provide individualized legal advice. Community members are encouraged to check in with a trusted legal service provider for questions about their situation.",
          'Todas las personas en los Estados Unidos, independientemente de su estatus migratorio, tienen ciertos derechos y protecciones bajo la Constitución de los Estados Unidos. Las tarjetas rojas del ILRC dan ejemplos de cómo las personas pueden ejercer estos derechos. Sin embargo, no dan consejo legal individualizado. Les avisamos a los miembros de la comunidad que consulten con un proveedor de servicios legales de confianza si tienen preguntas sobre su situación.',
        ),
        resourceLinks: [{ label: 'Resource/Recurso: Trusted Legal Providers', url: 'https://www.immigrationadvocates.org/nonprofit/legaldirectory/' }],
        settings: { anchorId: 'immigrant-legal' },
      }),
      await resourceSpotlight({
        tags: ['category.substance-abuse-recovery'],
        heading: 'Feeding Those in Active Addiction (Substance Abuse Disorder)',
        imgFile: 'img/active-addiction.jpg',
        imgAlt: 'Fresh tomatoes and produce',
        mediaPosition: 'left',
        body: [
          ...paragraphs('Our neighbors experiencing substance abuse disorder may have different needs to consider.'),
          heading('Quick facts:', 'h4'),
          ...bulletList([
            'Malnutrition is prevalent among individuals with substance abuse disorder diagnoses.',
            'Addiction and appetite impact the brain in similar ways to motivate behavior.',
            'Malnutrition can increase drug-seeking behavior.',
            'Treatment is more effective when nutritional support is incorporated.',
          ]),
          heading('Types of food to offer:', 'h4'),
          ...bulletList([
            'Nutritious snacks that contain protein and complex carbohydrates (whole wheat or whole grain products), fruits, and vegetables.',
            'Foods rich in fiber.',
            'Water, water, water (hydration supports withdrawal symptoms).',
            'Items that require less preparation, such as microwavable and low- or no-sodium vegetables, and pre-sliced fresh fruit or fruit cups packed in water or fruit juice.',
          ]),
          ...paragraphs('Source: Utah State University, HEART Extension'),
        ],
        resourceLinks: [{ label: 'Resource: 4 Nutrition Tips for Early Recovery', url: 'https://americanaddictioncenters.org/blog/4-nutrition-tips-for-early-recovery' }],
        settings: { anchorId: 'active-addiction' },
      }),
      await resourceSpotlight({
        tags: ['category.seniors-elderly', 'category.best-practices'],
        heading: 'Seniors Struggling with Hunger',
        imgFile: 'img/seniors-walking.jpg',
        imgAlt: 'Seniors walking together',
        mediaPosition: 'right',
        body: [
          ...paragraphs(
            '51% of our residents over 65 years old are below the ALICE threshold. This means that they do not meet the basic household survival budget to cover housing, food, transportation, healthcare, technology and taxes.',
          ),
          heading('Important considerations for our seniors, elders, and food pantries:', 'h4'),
          ...bulletList([
            'Offer delivery, mobile pantry services or transportation',
            'Easily accessible (remove physical barriers such as stairs, long walks, etc.)',
            'Offer a volunteer peer-shopper to help choose items and load the vehicle',
            'Additional signage for the hard of hearing',
            'Offer ready-to-eat and easy-to-prepare food that does not require heating, cooking, refrigerating or cutting (such as sandwiches, cut fruit, single serving drinks, etc.)',
          ]),
          heading('Resources:', 'h4'),
          ...bulletList([
            'To reach the Manatee County Elder Helpline, call (941) 742-5818',
            'Meals on Wheels Plus of Manatee, home-delivered meals, call (941) 747-4655',
            'Manatee County, Aging Services, call (941) 749-3030',
          ]),
        ],
        resourceLinks: [
          { label: "Senior Farmers' Market Nutrition Program", url: 'https://www.fns.usda.gov/sfmnp/senior-farmers-market-nutrition-program' },
          { label: 'Senior Nutrition Program', url: 'https://benefitscheckup.org/program/foodsupp_fd_congregate_group' },
          { label: 'SUNCAP Program', url: 'https://benefitscheckup.org/program/nutrition_fl_snap_program' },
          { label: 'SNAP (Food Stamps)', url: 'https://www.ncoa.org/article/what-is-snap-and-how-do-i-apply/' },
        ],
        settings: { anchorId: 'seniors-hunger' },
      }),
      await resourceSpotlight({
        tags: ['category.veterans-military-families'],
        heading: 'Serving Those Who Served',
        imgFile: 'img/serving-those-who-served.JPG',
        imgAlt: 'Patriotic-themed veterans outreach van',
        mediaPosition: 'left',
        body: [
          ...paragraphs(
            '24% of active-duty service members were food insecure in 2020 due to low pay, difficulty for partners of military family members to find steady jobs, few military assistance programs nearby, unexpected expenses, and not being eligible for some food assistance programs because they are considered to have too much income (Feeding America).',
          ),
          heading('Help veterans and their families by:', 'h4'),
          ...bulletList([
            'Thanking them for their service',
            'Creating a veterans pantry, which may be a special day(s) of the month only for veterans and their families, including any guardsmen, reservists, and military retirees',
            'Actively involving veterans and their families to volunteer, and offering job opportunities or a seat on an advisory committee',
            'Inviting them to join the Veteran Coffee Social every Tuesday between 10–12pm',
          ]),
        ],
        resourceLinks: [{ label: 'Resource: Manatee County Veterans Service Division', url: 'https://www.mymanatee.org/departments/community-and-veterans-services-department/veterans-services-division' }],
        settings: { anchorId: 'veterans' },
      }),
      await resourceSpotlight({
        tags: ['category.client-dignity'],
        heading: 'Supporting Client Choice',
        imgFile: 'img/client-choice.png',
        imgAlt: 'Power Up Your Pantry — Supporting Client Choice guide',
        mediaPosition: 'right',
        body: [
          ...paragraphs('This series is intended for food pantries and other relief groups looking to enhance their operations:'),
          ...bulletList([
            'Learn how to implement client choice',
            'Better meet the needs of clients',
            'Promote dignity',
            'Did you know? Some evidence suggests that goals are needed so that food pantry clients take enough food. Given the option to shop freely, without goals, many will take less food than they need, because they believe other people will need the food more than they do.',
          ]),
        ],
        resourceLinks: [{ label: 'Resource: Supporting Client Choice', url: 'https://drive.google.com/file/d/1tS7wzYVCEeOpNUIfbuBp6yLNgz8tz4A7/view' }],
        settings: { anchorId: 'client-choice' },
      }),
      await resourceSpotlight({
        tags: ['category.data-on-food-prices'],
        heading: 'Fast Facts: Food Prices and Hunger',
        imgFile: 'img/peppers.jpg',
        imgAlt: 'Fast Facts: Food Prices and Hunger',
        mediaPosition: 'left',
        body: paragraphs(
          'Fast facts on hunger in Manatee County as of September 2026 with links to USDA reports and local survival budgets.',
          'This informational sheet is helpful to know and use when speaking about hunger in Manatee County.',
        ),
        resourceLinks: [{ label: 'Download Fast Facts', url: '/uploads/data-around-food-costs-september-2026.pdf' }],
        settings: { anchorId: 'fast-facts-hunger' },
      }),
    ],
  });

  return pages;
}
