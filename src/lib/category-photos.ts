// Varied fallback photos per place category (Wikimedia Commons), rotated so spots never repeat.
import { CAFE_PHOTO, FOOD_PHOTO } from "./photos";

const COMMONS: Record<string, string[]> = {
  "cafe": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Starbucks_coffee_shop_interior_design.jpg/960px-Starbucks_coffee_shop_interior_design.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Interior_Johnie%27s_Coffee_Shop_2021.jpg/960px-Interior_Johnie%27s_Coffee_Shop_2021.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Interior_Johnie%27s_Coffee_Shop_2021_2.jpg/960px-Interior_Johnie%27s_Coffee_Shop_2021_2.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Newark-on-Trent%2C_Interior_of_%27Cherizena_Coffee_Shop%27%2C_23-24_Stodman_Street_-_geograph.org.uk_-_7846323.jpg/960px-Newark-on-Trent%2C_Interior_of_%27Cherizena_Coffee_Shop%27%2C_23-24_Stodman_Street_-_geograph.org.uk_-_7846323.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/2019_02_Awesome_Coffee_Shop_in_Korat.jpg/960px-2019_02_Awesome_Coffee_Shop_in_Korat.jpg"
  ],
  "bar": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Interior_of_Czeczotka_Cocktail_Bar%2C_Krak%C3%B3w%2C_2019.jpg/960px-Interior_of_Czeczotka_Cocktail_Bar%2C_Krak%C3%B3w%2C_2019.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Interior_of_Last_Tuesday_Society_cocktail_bar.jpg/960px-Interior_of_Last_Tuesday_Society_cocktail_bar.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Bartender_at_Sylvarum_cocktail_bar%2C_Alicante.jpg/960px-Bartender_at_Sylvarum_cocktail_bar%2C_Alicante.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Cocktail-Bar_%28Kleines_Phi%29_in_Hamburg.jpg/960px-Cocktail-Bar_%28Kleines_Phi%29_in_Hamburg.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Cure_cocktail_bar_New_Orleans_2011.jpg/960px-Cure_cocktail_bar_New_Orleans_2011.jpg"
  ],
  "restaurant": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Restaurant_room_of_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg/960px-Restaurant_room_of_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_06.jpg/960px-The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_06.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_03.jpg/960px-The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_03.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_08.jpg/960px-The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_08.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_09.jpg/960px-The_interior_dining_room_of_a_Red_Lobster_restaurant_in_Knoxville%2C_Tennessee_09.jpg"
  ],
  "park": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/M%C3%BCnster%2C_WestLotto_--_2013_--_3296.jpg/960px-M%C3%BCnster%2C_WestLotto_--_2013_--_3296.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Park_%C5%9Arodula%2C_Sosnowiec%2C_Jesie%C5%84_2021.jpg/960px-Park_%C5%9Arodula%2C_Sosnowiec%2C_Jesie%C5%84_2021.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Lawn_by_St_Breock_residential_home_-_geograph.org.uk_-_6390708.jpg/960px-Lawn_by_St_Breock_residential_home_-_geograph.org.uk_-_6390708.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Wentworth_Park_1928a.jpg/960px-Wentworth_Park_1928a.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Wentworth_Park_Arch.jpg/960px-Wentworth_Park_Arch.jpg"
  ],
  "museum": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Morning%2C_Interior_-_Luce.jpeg/960px-Morning%2C_Interior_-_Luce.jpeg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Kelvingrove_Art_Gallery_and_Museum_Central_Hall.jpg/960px-Kelvingrove_Art_Gallery_and_Museum_Central_Hall.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Kelvingrove_Art_Gallery_and_Museum_-_interior_-_2025-04-17_01.jpg/960px-Kelvingrove_Art_Gallery_and_Museum_-_interior_-_2025-04-17_01.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Kelvingrove_Art_Gallery_and_Museum_East_Court.jpg/960px-Kelvingrove_Art_Gallery_and_Museum_East_Court.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/General_view_of_one_of_the_halls_of_the_museum._Kelvingrove_Art_Gallery_and_Museum%2C_Glasgow%2C_Scotland.jpg/960px-General_view_of_one_of_the_halls_of_the_museum._Kelvingrove_Art_Gallery_and_Museum%2C_Glasgow%2C_Scotland.jpg"
  ],
  "music": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Musician_performs_on_stage_with_bass_guitar_during_live_concert_in_an_outdoor_venue_at_night.jpg/960px-Musician_performs_on_stage_with_bass_guitar_during_live_concert_in_an_outdoor_venue_at_night.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Musician_performs_on_stage_with_electric_guitar_during_live_concert_at_local_venue_in_evening_light.jpg/960px-Musician_performs_on_stage_with_electric_guitar_during_live_concert_at_local_venue_in_evening_light.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/DFC_5470_A_guitarist_performs_on_stage_under_colorful_lights_at_a_live_music_venue_in_Pattaya_City_Thailand.jpg/960px-DFC_5470_A_guitarist_performs_on_stage_under_colorful_lights_at_a_live_music_venue_in_Pattaya_City_Thailand.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Musicians_perform_live_on_stage_during_a_concert_at_a_local_venue.jpg/960px-Musicians_perform_live_on_stage_during_a_concert_at_a_local_venue.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Enjoying_a_live_rock_concert_at_an_outdoor_venue_with_vibrant_lights_and_enthusiastic_fans.jpg/960px-Enjoying_a_live_rock_concert_at_an_outdoor_venue_with_vibrant_lights_and_enthusiastic_fans.jpg"
  ],
  "shop": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/ArtAmbient_boutique_interior_Arta.jpg/960px-ArtAmbient_boutique_interior_Arta.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/TWG_Tea_shop_entrance_in_Singapore.jpg/960px-TWG_Tea_shop_entrance_in_Singapore.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/HK_TST_ISQUARE_mall_shop_interior_%E7%B2%BE%E5%B7%A5%E9%8C%B6%E5%B0%88%E9%96%80%E5%BA%97_SEIKO_Boutique_watch_dealer_glass_door.JPG/960px-HK_TST_ISQUARE_mall_shop_interior_%E7%B2%BE%E5%B7%A5%E9%8C%B6%E5%B0%88%E9%96%80%E5%BA%97_SEIKO_Boutique_watch_dealer_glass_door.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Former_Katrina_Boutique%3B_Playground_Pier_Shops%3B_Atlantic_City_NJ.jpg/960px-Former_Katrina_Boutique%3B_Playground_Pier_Shops%3B_Atlantic_City_NJ.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Redbone_Guitar_Boutique_Showroom.jpg/960px-Redbone_Guitar_Boutique_Showroom.jpg"
  ],
  "market": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Street_market_in_Marsaxlokk_12.jpg/960px-Street_market_in_Marsaxlokk_12.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Pek_Kio_Market_and_Food_Centre_food_stalls_%2855652%29.jpg/960px-Pek_Kio_Market_and_Food_Centre_food_stalls_%2855652%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_05.jpg/960px-Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_05.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_01.jpg/960px-Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_01.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_06.jpg/960px-Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_06.jpg"
  ],
  "place": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Manhattan_New_York_City_2009_PD_20091129_009.JPG/960px-Manhattan_New_York_City_2009_PD_20091129_009.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Manhattan_New_York_City_2009_PD_20091129_010.JPG/960px-Manhattan_New_York_City_2009_PD_20091129_010.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/West_Thames_Park_td_%282019-01-29%29_053_-_Rector_Street_Pedestrian_Bridge.jpg/960px-West_Thames_Park_td_%282019-01-29%29_053_-_Rector_Street_Pedestrian_Bridge.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/West_Thames_Park_td_%282019-01-29%29_052_-_Rector_Street_Pedestrian_Bridge.jpg/960px-West_Thames_Park_td_%282019-01-29%29_052_-_Rector_Street_Pedestrian_Bridge.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/West_Thames_Park_td_%282019-01-29%29_049_-_Rector_Street_Pedestrian_Bridge.jpg/960px-West_Thames_Park_td_%282019-01-29%29_049_-_Rector_Street_Pedestrian_Bridge.jpg"
  ]
};

export const CATEGORY_POOLS: Record<string, string[]> = {
  ...COMMONS,
  cafe: [CAFE_PHOTO, ...COMMONS["cafe"]!],
  restaurant: [FOOD_PHOTO, ...COMMONS["restaurant"]!],
};

const RULES: [RegExp, string][] = [
  [/\b(caf[eé]|coffee|espresso|roaster|tea ?house|bakery)\b/i, "cafe"],
  [/\b(bar|pub|tavern|cocktail|brewery|taproom|wine|speakeasy|lounge)\b/i, "bar"],
  [/\b(park|garden|gardens|heath|common|green|beach|square)\b/i, "park"],
  [/\b(museum|gallery|galerie|art centre|art center|exhibition)\b/i, "museum"],
  [/\b(club|venue|hall|jazz|music|concert|theatre|theater|arena|live|records?)\b/i, "music"],
  [/\b(market|food hall|stalls?|bazaar)\b/i, "market"],
  [/\b(shop|store|boutique|books?|vintage)\b/i, "shop"],
  [/\b(restaurant|kitchen|grill|bistro|diner|eatery|food|pizza|sushi|ramen|bbq|suya|jerk)\b/i, "restaurant"],
];

/** Picks a pool key from the place name first (more specific), then the AI category. */
export function photoCategory(name: string, category?: string): string {
  for (const [re, key] of RULES) if (re.test(name)) return key;
  const c = (category ?? "").toLowerCase();
  if (c === "cafe") return "cafe";
  if (c === "restaurant") return "restaurant";
  if (c === "venue") return "music";
  if (c === "shop") return "shop";
  for (const [re, key] of RULES) if (re.test(c)) return key;
  return "place";
}
