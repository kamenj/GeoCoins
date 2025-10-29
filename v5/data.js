// Sample starter data (used when localStorage is empty)
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
    username: "alice",
    title: "Home",
    lat: 42.6977,
    lng: 23.3219,
    desc: "Alice's home in Sofia",
    status: "pending",
    code: "ALICE123",
    foundBy: null,
  },
  {
    id: 2,
    username: "bob",
    title: "Work",
    lat: 42.1354,
    lng: 24.7453,
    desc: "Bob's office in Plovdiv",
    status: "found",
    code: "BOB456",
    foundBy: "charlie",
  },
  {
    id: 3,
    username: "bob",
    title: "Park Treasure",
    lat: 42.6950,
    lng: 23.3350,
    desc: "Hidden treasure in the park",
    status: "hidden",
    code: "PARK777",
    foundBy: null,
  },
  {
    id: 4,
    username: "evan",
    title: "Mountain Cache",
    lat: 42.7100,
    lng: 23.3500,
    desc: "Cache hidden in the mountains",
    status: "hidden",
    code: "MOUNT999",
    foundBy: null,
  },
  {
    id: 5,
    username: "evan",
    title: "River Spot",
    lat: 42.6850,
    lng: 23.3100,
    desc: "Hidden spot by the river",
    status: "hidden",
    code: "RIVER555",
    foundBy: null,
  },
  {
    id: 6,
    username: "charlie",
    title: "Lake View",
    lat: 42.6800,
    lng: 23.3400,
    desc: "Beautiful spot overlooking the lake",
    status: "hidden",
    code: "LAKE888",
    foundBy: null,
  },
  {
    id: 7,
    username: "bob",
    title: "Forest Trail",
    lat: 42.7050,
    lng: 23.3250,
    desc: "Hidden along the forest trail",
    status: "found",
    code: "FOREST321",
    foundBy: "alice",
  },
  {
    id: 8,
    username: "evan",
    title: "City Center",
    lat: 42.6950,
    lng: 23.3280,
    desc: "Right in the heart of the city",
    status: "pending",
    code: "CITY654",
    foundBy: null,
  },
  {
    id: 9,
    username: "charlie",
    title: "Bridge View",
    lat: 42.6900,
    lng: 23.3150,
    desc: "Under the old bridge",
    status: "hidden",
    code: "BRIDGE987",
    foundBy: null,
  },
  {
    id: 10,
    username: "bob",
    title: "Garden Secret",
    lat: 42.7000,
    lng: 23.3320,
    desc: "Hidden in the botanical garden",
    status: "found",
    code: "GARDEN147",
    foundBy: "evan",
  },
];
