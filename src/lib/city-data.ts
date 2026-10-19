// Mock per-city datasets. Replace with Qloo results later.
import type { Neighborhood, Place } from "./agent";

export type CityData = {
  neighborhoods: Neighborhood[];
  places: Place[];
  rent: Record<"$" | "$$" | "$$$", string>;
  transit: string;
  bank: string;
  local: string;
};

export const CITY_DATA: Record<string, CityData> = {
  "New York City": {
    rent: { $: "$1.6k–2.3k/mo", $$: "$2.3k–3.2k/mo", $$$: "$3.2k–4.5k/mo" },
    transit: "Get an OMNY card set up for the subway",
    bank: "Open a local bank account",
    local: "Find your go-to bodega — you're a New Yorker now",
    neighborhoods: [
      { name: "Bed-Stuy", lat: 40.6872, lng: -73.9418, borough: "Brooklyn", rent: "$$", tags: ["afrobeats", "caribbean", "spicy", "brownstone", "community", "budget", "music", "hip-hop"], why: "Brownstone blocks, West African & Caribbean food, and a deep music scene." },
      { name: "Harlem", lat: 40.8116, lng: -73.9465, borough: "Manhattan", rent: "$$", tags: ["afrobeats", "jazz", "soul", "spicy", "african", "student", "budget", "hip-hop", "music"], why: "Little Senegal, live jazz, and a strong student pocket near Columbia & CCNY." },
      { name: "Crown Heights", lat: 40.6694, lng: -73.9422, borough: "Brooklyn", rent: "$", tags: ["caribbean", "spicy", "afrobeats", "budget", "student", "coffee", "late-night"], why: "Jerk spots, roti shops and cheaper rents a short ride from Prospect Park." },
      { name: "Astoria", lat: 40.7644, lng: -73.9235, borough: "Queens", rent: "$$", tags: ["quiet", "coffee", "film", "indie", "greek", "food", "budget"], why: "Museum of the Moving Image, calm streets and endless cafés." },
      { name: "Williamsburg", lat: 40.7081, lng: -73.9571, borough: "Brooklyn", rent: "$$$", tags: ["indie", "film", "coffee", "nightlife", "vintage", "sneakers", "music"], why: "Indie cinemas, specialty coffee and boutique sneaker drops." },
      { name: "Jackson Heights", lat: 40.7557, lng: -73.8831, borough: "Queens", rent: "$", tags: ["spicy", "food", "budget", "student", "late-night", "diverse"], why: "One of the most diverse food streets on Earth — momos, tacos, biryani." },
      { name: "Lower East Side", lat: 40.715, lng: -73.9843, borough: "Manhattan", rent: "$$$", tags: ["hip-hop", "sneakers", "late-night", "nightlife", "indie", "film"], why: "Sneaker boutiques, Metrograph cinema and late-night slices." },
      { name: "Park Slope", lat: 40.671, lng: -73.9814, borough: "Brooklyn", rent: "$$$", tags: ["quiet", "coffee", "family", "indie", "film", "books"], why: "Leafy brownstone streets, bookstores and a cozy café on every corner." },
    ],
    places: [
      { name: "Accra Restaurant", lat: 40.8078, lng: -73.9458, category: "Restaurant", neighborhood: "Harlem", tags: ["afrobeats", "spicy", "african", "budget"], reason: "Ghanaian jollof and spicy shito at student prices." },
      { name: "Brooklyn Bazaar Afro Nights", lat: 40.689, lng: -73.938, category: "Venue", neighborhood: "Bed-Stuy", tags: ["afrobeats", "music", "nightlife"], reason: "Rotating Afrobeats & amapiano parties." },
      { name: "Glady's", lat: 40.6715, lng: -73.956, category: "Restaurant", neighborhood: "Crown Heights", tags: ["spicy", "caribbean"], reason: "Jerk chicken and rum punch — Caribbean comfort." },
      { name: "Ali's Roti Shop", lat: 40.683, lng: -73.944, category: "Restaurant", neighborhood: "Bed-Stuy", tags: ["spicy", "budget", "caribbean"], reason: "Legendary Trini roti under $12." },
      { name: "Lenox Lounge Sessions", lat: 40.803, lng: -73.935, category: "Venue", neighborhood: "Harlem", tags: ["jazz", "music", "soul"], reason: "Intimate live sets in a historic room." },
      { name: "Museum of the Moving Image", lat: 40.7563, lng: -73.924, category: "Venue", neighborhood: "Astoria", tags: ["film", "indie"], reason: "Rep screenings and film-history exhibits." },
      { name: "Kinship Coffee", lat: 40.763, lng: -73.92, category: "Cafe", neighborhood: "Astoria", tags: ["coffee", "quiet"], reason: "Bright, calm, laptop-friendly." },
      { name: "Nitehawk Cinema", lat: 40.7162, lng: -73.9626, category: "Venue", neighborhood: "Williamsburg", tags: ["film", "indie", "nightlife"], reason: "Indie films with dinner served to your seat." },
      { name: "Devoción", lat: 40.716, lng: -73.9594, category: "Cafe", neighborhood: "Williamsburg", tags: ["coffee", "indie"], reason: "Fresh Colombian beans in a plant-filled loft." },
      { name: "Metrograph", lat: 40.7148, lng: -73.9903, category: "Venue", neighborhood: "Lower East Side", tags: ["film", "indie"], reason: "Curated 35mm screenings and a great bar." },
      { name: "Kith", lat: 40.721, lng: -73.988, category: "Shop", neighborhood: "Lower East Side", tags: ["sneakers", "hip-hop"], reason: "Drops, collabs and sneaker culture HQ." },
      { name: "Katz's Delicatessen", lat: 40.7223, lng: -73.9873, category: "Restaurant", neighborhood: "Lower East Side", tags: ["late-night", "food"], reason: "Pastrami at 2am — a NYC rite of passage." },
      { name: "Rocka Rolla", lat: 40.7133, lng: -73.9573, category: "Venue", neighborhood: "Williamsburg", tags: ["hip-hop", "nightlife", "music"], reason: "Dive bar with hip-hop DJ nights." },
      { name: "Lhasa Fast Food", lat: 40.7493, lng: -73.8853, category: "Restaurant", neighborhood: "Jackson Heights", tags: ["spicy", "budget", "late-night"], reason: "Hidden-in-a-phone-shop Tibetan momos." },
      { name: "Community Bookstore", lat: 40.6747, lng: -73.978, category: "Shop", neighborhood: "Park Slope", tags: ["quiet", "books", "indie"], reason: "Neighborhood bookshop with a garden and a cat." },
      { name: "Joe's Pizza", lat: 40.7105, lng: -73.9613, category: "Restaurant", neighborhood: "Williamsburg", tags: ["late-night", "budget", "food"], reason: "Classic fold-in-half slice, open late." },
    ],
  },

  London: {
    rent: { $: "£1.3k–1.8k/mo", $$: "£1.8k–2.5k/mo", $$$: "£2.5k–3.8k/mo" },
    transit: "Set up contactless or an Oyster card for the Tube",
    bank: "Open a Monzo or high-street bank account",
    local: "Pick your local pub — you're a Londoner now",
    neighborhoods: [
      { name: "Peckham", lat: 51.4736, lng: -0.069, borough: "South London", rent: "$", tags: ["afrobeats", "spicy", "budget", "student", "music", "hip-hop", "late-night", "food"], why: "Nigerian & Ghanaian food, rooftop bars and a buzzing Afro-Caribbean scene." },
      { name: "Hackney", lat: 51.545, lng: -0.0553, borough: "East London", rent: "$$", tags: ["indie", "coffee", "film", "music", "sneakers", "nightlife", "jazz"], why: "Warehouse gigs, indie cinemas and specialty coffee on every corner." },
      { name: "Hampstead", lat: 51.5559, lng: -0.1767, borough: "North London", rent: "$$$", tags: ["quiet", "coffee", "books", "film", "family"], why: "The Heath, village lanes and calm bookshop-café afternoons." },
    ],
    places: [
      { name: "Chuku's", lat: 51.47, lng: -0.069, category: "Restaurant", neighborhood: "Peckham", tags: ["afrobeats", "spicy", "budget"], reason: "Nigerian tapas — suya, jollof and plantain." },
      { name: "Peckham Audio", lat: 51.4695, lng: -0.0685, category: "Venue", neighborhood: "Peckham", tags: ["afrobeats", "music", "hip-hop", "late-night"], reason: "Late-night Afroswing and grime sets." },
      { name: "Rio Cinema", lat: 51.5527, lng: -0.074, category: "Venue", neighborhood: "Hackney", tags: ["film", "indie"], reason: "Art deco indie cinema since 1909." },
      { name: "Ozone Coffee", lat: 51.5246, lng: -0.0775, category: "Cafe", neighborhood: "Hackney", tags: ["coffee", "indie"], reason: "Roastery café with serious flat whites." },
      { name: "Kiln Ridley Road Market", lat: 51.5487, lng: -0.0724, category: "Shop", neighborhood: "Hackney", tags: ["spicy", "budget", "food"], reason: "Scotch bonnets, yams and street food stalls." },
      { name: "Daunt Books Hampstead", lat: 51.5557, lng: -0.1758, category: "Shop", neighborhood: "Hampstead", tags: ["quiet", "books"], reason: "Beautiful travel-led bookshop, perfect for slow Sundays." },
    ],
  },

  Toronto: {
    rent: { $: "C$1.9k–2.4k/mo", $$: "C$2.4k–3.0k/mo", $$$: "C$3.0k–4.0k/mo" },
    transit: "Get a PRESTO card for the TTC",
    bank: "Open an account at a big-five bank",
    local: "Grab a peameal bacon sandwich — you're a Torontonian now",
    neighborhoods: [
      { name: "Little Jamaica", lat: 43.688, lng: -79.426, borough: "Eglinton West", rent: "$", tags: ["caribbean", "spicy", "budget", "music", "hip-hop", "afrobeats"], why: "Reggae record shops, patty spots and real community roots." },
      { name: "Kensington Market", lat: 43.6547, lng: -79.4003, borough: "Downtown", rent: "$$", tags: ["indie", "coffee", "student", "budget", "film", "late-night", "food"], why: "Vintage stores, cheap eats and a student crowd from U of T." },
      { name: "The Annex", lat: 43.668, lng: -79.404, borough: "Midtown", rent: "$$$", tags: ["quiet", "books", "coffee", "film", "student"], why: "Victorian homes, bookshops and the Hot Docs cinema." },
    ],
    places: [
      { name: "Allwyn's Bakery", lat: 43.689, lng: -79.4265, category: "Restaurant", neighborhood: "Little Jamaica", tags: ["spicy", "caribbean", "budget"], reason: "Jerk chicken and curry goat that locals swear by." },
      { name: "Afro Nights at Lula Lounge", lat: 43.646, lng: -79.43, category: "Venue", neighborhood: "Little Jamaica", tags: ["afrobeats", "music"], reason: "Afrobeats, soca and live bands." },
      { name: "Hot Docs Ted Rogers Cinema", lat: 43.6667, lng: -79.41, category: "Venue", neighborhood: "The Annex", tags: ["film", "indie"], reason: "The world's biggest documentary cinema." },
      { name: "Pamenar Coffee", lat: 43.6545, lng: -79.4005, category: "Cafe", neighborhood: "Kensington Market", tags: ["coffee", "indie"], reason: "Third-wave coffee in the market's heart." },
      { name: "Seven Lives Tacos", lat: 43.6544, lng: -79.4015, category: "Restaurant", neighborhood: "Kensington Market", tags: ["spicy", "budget", "late-night"], reason: "Baja fish tacos with a permanent line." },
      { name: "Livestock", lat: 43.647, lng: -79.402, category: "Shop", neighborhood: "Kensington Market", tags: ["sneakers", "hip-hop"], reason: "Canada's sneaker boutique institution." },
    ],
  },

  Berlin: {
    rent: { $: "€900–1.2k/mo", $$: "€1.2k–1.6k/mo", $$$: "€1.6k–2.3k/mo" },
    transit: "Buy a Deutschlandticket for U-Bahn & S-Bahn",
    bank: "Do your Anmeldung and open an N26 account",
    local: "Find your Späti — you're a Berliner now",
    neighborhoods: [
      { name: "Neukölln", lat: 52.4812, lng: 13.4353, borough: "South-East", rent: "$", tags: ["budget", "student", "spicy", "late-night", "music", "afrobeats", "food"], why: "Cheap rent, Turkish & Arabic food streets and canal-side bars." },
      { name: "Kreuzberg", lat: 52.4986, lng: 13.418, borough: "Central", rent: "$$", tags: ["hip-hop", "sneakers", "nightlife", "music", "indie", "late-night"], why: "Street art, döner at 3am and the city's hip-hop heartbeat." },
      { name: "Prenzlauer Berg", lat: 52.538, lng: 13.4244, borough: "North", rent: "$$$", tags: ["quiet", "coffee", "film", "books", "family", "indie"], why: "Leafy squares, cafés and Sunday flea markets." },
    ],
    places: [
      { name: "Sahara Imbiss", lat: 52.484, lng: 13.423, category: "Restaurant", neighborhood: "Neukölln", tags: ["spicy", "budget", "african"], reason: "Sudanese peanut-sauce falafel for a few euros." },
      { name: "Afrobeats @ YAAM", lat: 52.5107, lng: 13.426, category: "Venue", neighborhood: "Kreuzberg", tags: ["afrobeats", "music"], reason: "Riverside beach club with Afro & reggae nights." },
      { name: "Mustafa's Gemüse Kebap", lat: 52.4937, lng: 13.3877, category: "Restaurant", neighborhood: "Kreuzberg", tags: ["late-night", "budget", "food"], reason: "Berlin's most famous döner queue." },
      { name: "Overkill", lat: 52.499, lng: 13.418, category: "Shop", neighborhood: "Kreuzberg", tags: ["sneakers", "hip-hop"], reason: "Legendary sneaker store and graffiti culture hub." },
      { name: "Kino Babylon", lat: 52.525, lng: 13.411, category: "Venue", neighborhood: "Prenzlauer Berg", tags: ["film", "indie"], reason: "Historic cinema with silent films & live organ." },
      { name: "Bonanza Coffee", lat: 52.534, lng: 13.421, category: "Cafe", neighborhood: "Prenzlauer Berg", tags: ["coffee", "quiet"], reason: "One of the roasters that started Berlin's coffee wave." },
    ],
  },

  Dubai: {
    rent: { $: "AED 5k–7k/mo", $$: "AED 7k–11k/mo", $$$: "AED 11k–18k/mo" },
    transit: "Get a Nol card for the Metro",
    bank: "Get your Emirates ID and open a bank account",
    local: "Try karak chai at a corner cafeteria — you're a Dubai local now",
    neighborhoods: [
      { name: "Al Karama", lat: 25.243, lng: 55.305, borough: "Bur Dubai", rent: "$", tags: ["spicy", "budget", "food", "late-night", "student"], why: "Affordable flats and some of the city's best South Asian food." },
      { name: "Jumeirah Lake Towers", lat: 25.071, lng: 55.14, borough: "New Dubai", rent: "$$", tags: ["coffee", "music", "afrobeats", "nightlife", "hip-hop"], why: "Lakeside towers, cafés and easy access to Marina nightlife." },
      { name: "Al Barsha", lat: 25.113, lng: 55.2, borough: "Inland", rent: "$$$", tags: ["quiet", "family", "film", "sneakers", "coffee"], why: "Calm residential streets next to Mall of the Emirates." },
    ],
    places: [
      { name: "Ravi Restaurant", lat: 25.252, lng: 55.297, category: "Restaurant", neighborhood: "Al Karama", tags: ["spicy", "budget", "late-night"], reason: "Pakistani curries, open late since 1978." },
      { name: "Kizomba Afro Nights", lat: 25.0715, lng: 55.141, category: "Venue", neighborhood: "Jumeirah Lake Towers", tags: ["afrobeats", "music", "nightlife"], reason: "Weekly Afrobeats & amapiano parties." },
      { name: "Nightjar Coffee", lat: 25.138, lng: 55.227, category: "Cafe", neighborhood: "Al Barsha", tags: ["coffee", "indie", "quiet"], reason: "Industrial roastery café in Alserkal-style." },
      { name: "Cinema Akil", lat: 25.1385, lng: 55.2275, category: "Venue", neighborhood: "Al Barsha", tags: ["film", "indie"], reason: "The UAE's only arthouse cinema." },
      { name: "Sole DXB pop-up", lat: 25.1135, lng: 55.2005, category: "Shop", neighborhood: "Al Barsha", tags: ["sneakers", "hip-hop"], reason: "Sneaker & streetwear culture festival drops." },
      { name: "Karama Market", lat: 25.2435, lng: 55.3055, category: "Shop", neighborhood: "Al Karama", tags: ["budget", "food"], reason: "Bargain stalls and street snacks." },
    ],
  },

  Lagos: {
    rent: { $: "₦250k–500k/mo", $$: "₦500k–1.2m/mo", $$$: "₦1.2m–3m/mo" },
    transit: "Learn the BRT routes and get a Cowry card",
    bank: "Open an account and set up a mobile money app",
    local: "Grab suya from your favorite mallam — you're a Lagosian now",
    neighborhoods: [
      { name: "Yaba", lat: 6.5158, lng: 3.3897, borough: "Mainland", rent: "$", tags: ["student", "budget", "indie", "coffee", "spicy", "music"], why: "Tech hub energy near UNILAG with cheap bukas and cafés." },
      { name: "Lekki Phase 1", lat: 6.4474, lng: 3.4723, borough: "Island", rent: "$$$", tags: ["afrobeats", "nightlife", "music", "hip-hop", "sneakers", "late-night"], why: "Lagos nightlife central — lounges, live Afrobeats and beach clubs." },
      { name: "Ikeja GRA", lat: 6.577, lng: 3.351, borough: "Mainland", rent: "$$", tags: ["quiet", "film", "coffee", "family", "food"], why: "Leafy, calmer streets with cinemas and the Afrikan Shrine nearby." },
    ],
    places: [
      { name: "New Afrika Shrine", lat: 6.601, lng: 3.34, category: "Venue", neighborhood: "Ikeja GRA", tags: ["afrobeats", "music", "jazz"], reason: "Fela's legendary home of Afrobeat." },
      { name: "Amala Shitta", lat: 6.507, lng: 3.371, category: "Restaurant", neighborhood: "Yaba", tags: ["spicy", "budget", "food"], reason: "Iconic amala and ewedu with peppery stew." },
      { name: "Hard Rock Lagos Afro Nights", lat: 6.428, lng: 3.421, category: "Venue", neighborhood: "Lekki Phase 1", tags: ["afrobeats", "nightlife", "hip-hop"], reason: "Big-name Afrobeats DJs by the beach." },
      { name: "Café Neo", lat: 6.516, lng: 3.39, category: "Cafe", neighborhood: "Yaba", tags: ["coffee", "student", "quiet"], reason: "Laptop-friendly Rwandan coffee near the tech hubs." },
      { name: "Filmhouse IMAX Lekki", lat: 6.447, lng: 3.473, category: "Venue", neighborhood: "Lekki Phase 1", tags: ["film"], reason: "Nollywood premieres on the big screen." },
      { name: "Alara Lagos", lat: 6.432, lng: 3.424, category: "Shop", neighborhood: "Lekki Phase 1", tags: ["sneakers", "indie"], reason: "Design concept store for African fashion." },
    ],
  },
};

export const SUPPORTED_CITY_NAMES = Object.keys(CITY_DATA);
