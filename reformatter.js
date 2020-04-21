const fs = require("fs");

let data = JSON.parse(fs.readFileSync("output.json").toString());

let reformatted = {}

for (let entree of data) {
    let highest = 0;
    let emojiNameOfHighest;
    for (let emojiName in entree.associated) {
      let emoji = entree.associated[emojiName];
      if (emoji.volume > highest) highest = emoji.volume;
    }

    for (let emojiName in entree.associated) {
      let emoji = entree.associated[emojiName];
      if (emoji.volume === highest) emojiNameOfHighest = emojiName;
    }
    reformatted[entree.word] = emojiNameOfHighest
}

fs.writeFileSync("reformatted.json", JSON.stringify(reformatted))
