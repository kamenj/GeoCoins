// Sample starter data (used when localStorage is empty)

// Map point status mappings (corresponds to map_point_status table)
export var SAMPLE_MAP_POINT_STATUS = [
  { id: 1, status_name: "pending", description: "Point is newly created and waiting to be hidden" },
  { id: 2, status_name: "hidden", description: "Point is hidden and waiting to be found" },
  { id: 3, status_name: "found", description: "Point has been found by someone" }
];

// Status ID constants for easy reference
export const STATUS_ID = {
  PENDING: 1,
  HIDDEN: 2,
  FOUND: 3
};

// Roles available in the system
export var SAMPLE_ROLES = [
  { id: 1, name: "admin", description: "System administrator with full access" },
  { id: 2, name: "seeker", description: "User who searches for hidden geocoins" },
  { id: 3, name: "hider", description: "User who hides geocoins for others to find" },
  { id: 4, name: "developer", description: "Developer with access to development features" },
  { id: 5, name: "tester", description: "Tester with access to testing features" }
];

export var SAMPLE_USERS = [
  {
    id: 1,
    username: "alice",
    password: "1234",
    name: "Alice",
    // surname: "Anderson", //§kamen_20251010_175213
    gender: "female",
    // §kamen_20251010_180320
    //roles: ["seeker"]
    roles: ["admin", "seeker"]
  },
  {
    id: 2,
    username: "bob",
    password: "1234",
    name: "Bob",
    // surname: "Brown",//§kamen_20251010_175213
    gender: "male",
    //§kamen_20251010_180320
    roles: ["hider"]
  },
  {
    id: 3,
    username: "charlie",
    password: "1234",
    name: "Charlie",
    gender: "male",
    roles: ["admin", "seeker", "hider"]
  },
  {
    id: 4,
    username: "diana",
    password: "1234",
    name: "Diana",
    gender: "female",
    roles: ["seeker","developer","tester"]
  },
  {
    id: 5,
    username: "evan",
    password: "1234",
    name: "Evan",
    gender: "male",
    roles: ["seeker", "hider"]
  },
  {
    id: 6,
    username: "frank",
    password: "1234",
    name: "Frank",
    gender: "male",
    roles: ["tester"]
  },
  {
    id: 7,
    username: "grace",
    password: "1234",
    name: "Grace",
    gender: "female",
    roles: ["developer"]
  },
];

export var SAMPLE_POINTS = [
  {
    id: 1,
    user_id: 1, // alice
    title: "Home",
    lat: 42.6977,
    lng: 23.3219,
    desc: "Alice's home in Sofia",
    status_id: 1, // pending
    code: "ALICE123",
    found_by: null,
  },
  {
    id: 2,
    user_id: 2, // bob
    title: "Work",
    lat: 42.1354,
    lng: 24.7453,
    desc: "Bob's office in Plovdiv",
    status_id: 3, // found
    code: "BOB456",
    found_by: "charlie",
  },
  {
    id: 3,
    user_id: 2, // bob
    title: "Park Treasure",
    lat: 42.6950,
    lng: 23.3350,
    desc: "Hidden treasure in the park",
    status_id: 2, // hidden
    code: "PARK777",
    found_by: null,
  },
  {
    id: 4,
    user_id: 5, // evan
    title: "Mountain Cache",
    lat: 42.7100,
    lng: 23.3500,
    desc: "Cache hidden in the mountains",
    status_id: 2, // hidden
    code: "MOUNT999",
    found_by: null,
  },
  {
    id: 5,
    user_id: 5, // evan
    title: "River Spot",
    lat: 42.6850,
    lng: 23.3100,
    desc: "Hidden spot by the river",
    status_id: 2, // hidden
    code: "RIVER555",
    found_by: null,
  },
  {
    id: 6,
    user_id: 3, // charlie
    title: "Lake View",
    lat: 42.6800,
    lng: 23.3400,
    desc: "Beautiful spot overlooking the lake",
    status_id: 2, // hidden
    code: "LAKE888",
    foundBy: null,
  },
  {
    id: 7,
    user_id: 2, // bob
    title: "Forest Trail",
    lat: 42.7050,
    lng: 23.3250,
    desc: "Hidden along the forest trail",
    status_id: 3, // found
    code: "FOREST321",
    foundBy: "alice",
  },
  {
    id: 8,
    user_id: 5, // evan
    title: "City Center",
    lat: 42.6950,
    lng: 23.3280,
    desc: "Right in the heart of the city",
    status_id: 1, // pending
    code: "CITY654",
    foundBy: null,
  },
  {
    id: 9,
    user_id: 3, // charlie
    title: "Bridge View",
    lat: 42.6900,
    lng: 23.3150,
    desc: "Under the old bridge",
    status_id: 2, // hidden
    code: "BRIDGE987",
    foundBy: null,
  },
  {
    id: 10,
    user_id: 2, // bob
    title: "Garden Secret",
    lat: 42.7000,
    lng: 23.3320,
    desc: "Hidden in the botanical garden",
    status_id: 3, // found
    code: "GARDEN147",
    foundBy: "evan",
  },
  {
    id: 11,
    user_id: 1, // alice
    title: "Historic Square",
    lat: 42.6960,
    lng: 23.3200,
    desc: "Ancient treasure near the old square",
    status_id: 2, // hidden
    code: "SQUARE222",
    foundBy: null,
  },
  {
    id: 12,
    user_id: 3, // charlie
    title: "University Campus",
    lat: 42.6550,
    lng: 23.3700,
    desc: "Cache hidden on campus grounds",
    status_id: 1, // pending
    code: "UNI333",
    foundBy: null,
  },
  {
    id: 13,
    user_id: 2, // bob
    title: "Stadium Corner",
    lat: 42.6900,
    lng: 23.3450,
    desc: "Near the old stadium entrance",
    status_id: 3, // found
    code: "STADIUM444",
    foundBy: "charlie",
  },
  {
    id: 14,
    user_id: 5, // evan
    title: "Metro Station",
    lat: 42.6980,
    lng: 23.3240,
    desc: "Underground cache near metro",
    status_id: 2, // hidden
    code: "METRO555",
    foundBy: null,
  },
  {
    id: 15,
    user_id: 1, // alice
    title: "Museum Steps",
    lat: 42.6940,
    lng: 23.3310,
    desc: "Hidden at the museum entrance",
    status_id: 2, // hidden
    code: "MUSEUM666",
    foundBy: null,
  },
  {
    id: 16,
    user_id: 3, // charlie
    title: "Cathedral View",
    lat: 42.6970,
    lng: 23.3230,
    desc: "Cache with cathedral view",
    status_id: 3, // found
    code: "CHURCH777",
    foundBy: "bob",
  },
  {
    id: 17,
    user_id: 2, // bob
    title: "Market Plaza",
    lat: 42.6920,
    lng: 23.3290,
    desc: "Busy marketplace treasure",
    status_id: 1, // pending
    code: "MARKET888",
    foundBy: null,
  },
  {
    id: 18,
    user_id: 5, // evan
    title: "Airport Road",
    lat: 42.6890,
    lng: 23.4100,
    desc: "Along the road to airport",
    status_id: 2, // hidden
    code: "AIRPORT999",
    foundBy: null,
  },
  {
    id: 19,
    user_id: 1, // alice
    title: "Zoo Entrance",
    lat: 42.6500,
    lng: 23.3400,
    desc: "Near the zoo main gate",
    status_id: 2, // hidden
    code: "ZOO101",
    foundBy: null,
  },
  {
    id: 20,
    user_id: 3, // charlie
    title: "Tower Monument",
    lat: 42.7020,
    lng: 23.3180,
    desc: "At the base of the monument",
    status_id: 3, // found
    code: "TOWER202",
    foundBy: "alice",
  },
];
