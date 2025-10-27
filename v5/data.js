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
];
