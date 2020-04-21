require("dotenv").config();
const snoowrap = require("snoowrap");
const Trainer = require("./trainer");



const r = new snoowrap({
  userAgent: process.env.USERAGENT,
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

const t = new Trainer("output.json");

t.loadFromWorkingFile();

r.getNew("emojisquad").then((posts) => {
  for (let post of posts) {
    t.loadNewData(post.selftext);
  }
});

r.getNew("emojipasta").then((posts) => {
  for (let post of posts) {
    t.loadNewData(post.selftext);
  }
});

