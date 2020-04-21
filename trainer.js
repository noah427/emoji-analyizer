const fs = require("fs");
const emoji = require("node-emoji");

class Word {
  constructor(word) {
    this.word = word;
    this.associated = {};
  }

  addEmoji(emojiName) {
    let emoji = new Emoji(emojiName);
    this.associated[emojiName] = emoji;
  }
}

class Emoji {
  constructor(emojiName) {
    this.emojiName = emojiName;
    this.commonName = this.volume = 1;
  }
}

class WordStatsManager {
  constructor(workingFile) {
    this.words = new Map();

    this.workingFile = workingFile;
  }

  writeToFile() {
    let outputT = [];

    this.words.forEach((word, key) => {
      if (word.associated != {}) {
        outputT.push(word);
      }
    });

    fs.writeFileSync(this.workingFile, JSON.stringify(outputT));
  }

  countPairs(pairs) {
    // this is cancer

    for (let pair of pairs) {
      // checks if word exists in word list
      if (this.words.get(pair.word)) {
        let word = this.words.get(pair.word);

        // if word is already assoc with this emoji
        if (word.associated[pair.emoji]) {
          // increase volume
          word.associated[pair.emoji].volume++;

          this.words.set(pair.word, word);
        } else {
          // if word is not assoc with this emoji. fix.
          word.associated[pair.emoji] = new Emoji(pair.emoji);

          this.words.set(pair.word, word);
        }
      } else {
        // add word to word list
        let word = new Word(pair.word);
        word.addEmoji(pair.emoji);
        this.words.set(pair.word, word);
      }
    }
    // prob write to working file here
    this.writeToFile();
  }
}

class Trainer {
  constructor(workingFile) {
    this.workingFile = workingFile;
    this.workingFileContent = fs.readFileSync(workingFile).toString();
    // fucking regex
    this.wordEmojiPair = /(?:(\w{2,}) (:\w*:))/g;
    // .

    this.wordManager = new WordStatsManager(this.workingFile);
  }

  loadFromWorkingFile() {
    this.loadFile(JSON.parse(this.workingFileContent));
  }

  loadNewData(data) {
    this.wordManager.countPairs(this.gatherPairs(emoji.unemojify(data)));
  }

  loadFile(object) {
    for (let word of object) {
      this.wordManager.words.set(word.word, word);
    }
  }

  gatherPairs(input) {
    let pairs = [];
    let m;

    do {
      m = this.wordEmojiPair.exec(input);
      if (m) {
        pairs.push({ word: m[1].toLowerCase(), emoji: m[2].replace(/:/g, "") });
      }
    } while (m);

    return pairs;
  }
}

module.exports = Trainer;
