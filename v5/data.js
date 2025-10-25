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
];

export var SAMPLE_POINTS = [
  {
    id: 1,
    username: "alice",
    title: "Home",
    lat: 42.6977,
    lng: 23.3219,
    desc: "Alice's home in Sofia",
  },
  {
    id: 2,
    username: "bob",
    title: "Work",
    lat: 42.1354,
    lng: 24.7453,
    desc: "Bob's office in Plovdiv",
  },
];
