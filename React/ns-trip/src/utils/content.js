// All page copy lives here. Facts about Cameroon are real; TripKam-specific
// claims and itineraries are sample copy to review before launch.

import mountCameroon from '../assets/images/places/mount-cameroon.webp'
import dja from '../assets/images/places/dja-faunal-reserve.webp'
import foumban from '../assets/images/places/foumban-sultans-palace.webp'
import kribi from '../assets/images/places/kribi-beach.webp'
import storyMountCameroon from '../assets/images/places/story-mount-cameroon.webp'
import storyFoumban from '../assets/images/places/story-foumban.webp'
import storyKribi from '../assets/images/places/story-kribi.webp'
import storyWaza from '../assets/images/places/story-waza.webp'
import ctaRhumsiki from '../assets/images/places/cta-rhumsiki.webp'
import aboutKilumIjim from '../assets/images/places/about-kilum-ijim.webp'

export const site = {
  name: 'TripKam',
  url: 'https://tripkam.heysimplice.com',
  author: { name: 'Njoh Simplice', url: 'https://heysimplice.com' },
}

export const navLinks = [
  { label: 'Destinations', menu: 'destinations' },
  { label: 'Experiences', href: '/#experiences' },
  { label: 'Itineraries', href: '/#itineraries' },
  { label: 'About', href: '/#about' },
]

export const destinationsMenu = {
  columns: [
    {
      label: 'By landscape',
      links: [
        { title: 'Mountains', text: 'Mount Cameroon and the highlands', icon: 'mountain', href: '/#experiences' },
        { title: 'Rainforest', text: "The Dja and Campo Ma'an", icon: 'tree', href: '/#experiences' },
        { title: 'Savanna', text: 'Parks of the north', icon: 'sun', href: '/#experiences' },
        { title: 'Coast', text: 'Kribi, Limbe and Lobé Falls', icon: 'waves', href: '/#experiences' },
        { title: 'Culture', text: 'Foumban and Bafut', icon: 'landmark', href: '/#experiences' },
      ],
    },
    {
      label: 'By region',
      links: [
        { title: 'South West and Littoral', text: 'Buea, Limbe and Douala', icon: 'pin', href: '/#regions' },
        { title: 'West and North West', text: 'Foumban, Bafut and Bamenda', icon: 'pin', href: '/#regions' },
        { title: 'Centre and South', text: 'Yaoundé, Kribi and Ebolowa', icon: 'pin', href: '/#regions' },
      ],
    },
  ],
  featured: {
    label: 'Featured',
    tag: 'Itinerary',
    title: 'Climbing Mount Cameroon in three days',
    meta: '3 days · South West',
    href: '/#itineraries',
  },
}

export const hero = {
  title: 'Discover Cameroon, Africa in miniature',
  lines: ['Guided journeys through', 'mountains, rainforest and', 'coast, led by local experts who call Cameroon home'],
}

// Region name, then its capital: the cells cross-fade between the two.
export const regions = [
  ['Adamawa', 'Ngaoundéré'],
  ['Centre', 'Yaoundé'],
  ['East', 'Bertoua'],
  ['Far North', 'Maroua'],
  ['Littoral', 'Douala'],
  ['North', 'Garoua'],
  ['North West', 'Bamenda'],
  ['South', 'Ebolowa'],
  ['South West', 'Buea'],
  ['West', 'Bafoussam'],
]

export const regionsTitle = 'Ten regions, one country to explore'

export const maskedBanner = 'Volcanoes, rainforest and Atlantic beaches, all in one country'

export const steps = [
  { title: 'Climb volcanoes and walk the green western highlands', media: 'Mount Cameroon', image: mountCameroon, alt: 'Mount Cameroon under clouds, seen across green parkland in Buea' },
  { title: 'Track forest elephants and primates through ancient rainforest', media: 'Dja Faunal Reserve', image: dja, alt: 'Dense rainforest reflected in a still river' },
  { title: 'Meet the kingdoms, markets and artisans of the West', media: 'Foumban', image: foumban, alt: "The brick Sultan's Palace in Foumban behind a stone courtyard" },
  { title: 'Slow down on the beaches of the Atlantic coast', media: 'Kribi', image: kribi, alt: 'Wooden pirogues on a sandy beach by the Atlantic' },
]

export const about = {
  title: 'The TripKam way',
  text: 'TripKam brings planning, transport, stays and local guides together in one trip. Tell us how you like to travel and we build the route around you, then stay with you on the ground from arrival to departure.',
  cta: 'Plan your trip',
  reel: 'Brand film',
  image: aboutKilumIjim,
}

export const why = {
  title: 'Why travellers choose TripKam',
  text: 'A local team, built around the way you want to travel.',
  cards: [
    {
      title: 'One team, every detail',
      text: 'Transport, stays, guides and permits arranged by one local team. No juggling bookings across agencies.',
      icon: 'users',
      tone: 'bg-olive text-white',
    },
    {
      title: 'Guides who call it home',
      text: 'Every route is led by people who grew up in the region and know its languages, food and history.',
      icon: 'compass',
      tone: 'bg-sky text-ink',
    },
    {
      title: 'Trips built around you',
      text: 'Tell us your dates and interests. We design the route, the pace and the budget with you.',
      icon: 'sliders',
      tone: 'bg-ocean text-white',
    },
    {
      title: 'Travel that gives back',
      text: 'We work with local hosts, cooks and craftspeople, so more of what you spend stays where you travel.',
      icon: 'heart',
      tone: 'bg-navy text-white',
    },
  ],
}

export const facts = {
  text: 'Cameroon packs a continent of landscapes into a single country. Here it is in numbers.',
  items: [
    { value: '10', label: 'Regions, from the Sahel to the Atlantic' },
    { value: '250+', label: 'Ethnic groups and languages' },
    { value: '4,040 m', label: 'Summit of Mount Cameroon' },
    { value: '402 km', label: 'Of Atlantic coastline' },
    { value: '2', label: 'Official languages, French and English' },
  ],
}

export const itineraries = [
  {
    label: '3 days · South West',
    name: 'Mount Cameroon',
    image: mountCameroon,
    text: 'Start in Buea, climb through farmland and montane forest, sleep in mountain huts and reach the 4,040 m summit at sunrise, before descending past old lava flows.',
    note: 'Best season: November to March',
  },
  {
    label: '4 days · South',
    name: 'Kribi and the coast',
    image: kribi,
    text: 'Beach days in Kribi, a pirogue ride to the Lobé Falls where the river meets the ocean, and fresh grilled fish in the fishing villages along the shore.',
    note: 'Best season: December to February',
  },
  {
    label: '2 days · West',
    name: 'Foumban',
    image: foumban,
    text: "The Sultan's Palace and its museum, the artisans' street of bronze casters and wood carvers, and the green hills of the Bamoun kingdom.",
    note: 'Best season: November to February',
  },
]

export const stories = {
  title: 'Travel notes',
  items: [
    { title: 'Climbing Mount Cameroon: what to know before you go', tag: 'Guide', meta: 'South West', image: storyMountCameroon, alt: 'Hikers climbing a forest trail on Mount Cameroon' },
    { title: 'A morning in Foumban, the city of the Bamoun kings', tag: 'Culture', meta: 'West', image: storyFoumban, alt: 'People gathered at the gate of the royal palace in Foumban' },
    { title: 'Kribi in four days: beaches, falls and fishing villages', tag: 'Coast', meta: 'South', image: storyKribi, alt: 'The Lobé Falls pouring into the river near Kribi' },
    { title: 'The best time to visit each region of Cameroon', tag: 'Planning', meta: 'All regions', image: storyWaza, alt: 'Giraffes on the dry savanna of Waza National Park' },
  ],
}

export const cta = {
  title: 'Start planning your Cameroon journey today',
  button: 'Talk to our team',
  image: ctaRhumsiki,
}

export const contact = {
  title: 'Contact us',
  intro: [
    'Planning a trip to Cameroon? Tell us where you would like to go, when, and how you like to travel, and we will shape a route around you.',
    'Leave your details and a message and a member of our local team will get back to you.',
  ],
  address: ['TripKam', 'Tours and travel', 'Cameroon'],
  // TripKam is a demo brand, so its social links point to the site author's portfolio.
  socials: [
    { label: 'Instagram', href: site.author.url },
    { label: 'Facebook', href: site.author.url },
    { label: 'WhatsApp', href: site.author.url },
  ],
  interests: [
    'Mountains and hiking',
    'Rainforest and wildlife',
    'Coast and beaches',
    'Culture and heritage',
    'Savanna and the north',
    'A bit of everything',
  ],
  newsletter: 'Send me travel notes and seasonal trip ideas from TripKam.',
  consent: 'I agree to TripKam keeping my details to reply to this request.',
  submit: 'Send message',
  sent: {
    title: 'Thanks, your message is on its way',
    text: 'A member of our team will get back to you soon to start planning your trip.',
    again: 'Send another message',
  },
}

export const footer = {
  tagline: 'Discover Cameroon, Africa in miniature',
  // Wikimedia Commons photos whose licences require a visible credit.
  photoCredits: [
    {
      subject: 'Mount Cameroon',
      author: 'Baker landry',
      license: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Le_Mont_Cameroun_majestueux_vu_depuis_Buea.jpg',
    },
    {
      subject: "Sultan's Palace, Foumban",
      author: 'Elin',
      license: 'CC BY 2.0',
      href: 'https://commons.wikimedia.org/wiki/File:The_Sultans_Palace,_Foumban.jpg',
    },
    {
      subject: 'Foumban palace gate',
      author: 'WILLAV-FR',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:CAM-Foumban-Entr%C3%A9e_du_Palais_royal.jpg',
    },
    {
      subject: 'Waza giraffes',
      author: 'Albert Backer',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Waza-NP-Giraffes.jpg',
    },
    {
      subject: 'Rhumsiki at sunset',
      author: 'The Taxi Photographer',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Rhumsiki_arid_view_at_sunset.jpg',
    },
    {
      subject: 'Kilum-Ijim highlands',
      author: 'Ericjoelmanej',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Kilum_Ijim_forest_in_the_Northwest_of_Cameroon.jpg',
    },
  ],
  groups: [
    {
      title: 'Destinations',
      links: [
        { label: 'Mountains', href: '/#experiences' },
        { label: 'Rainforest', href: '/#experiences' },
        { label: 'Savanna', href: '/#experiences' },
        { label: 'Coast', href: '/#experiences' },
        { label: 'Culture', href: '/#experiences' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Experiences', href: '/#experiences' },
        { label: 'Itineraries', href: '/#itineraries' },
        { label: 'Travel notes', href: '/#stories' },
        { label: 'About', href: '/#about' },
      ],
    },
    {
      title: 'TripKam',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Contact', href: '/contact/' },
      ],
    },
  ],
}
