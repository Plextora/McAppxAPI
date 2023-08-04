import express = require("express");
import("node-fetch");
// imports are like that cause intellisense

const app = express();

const PORT = process.env.PORT || 3000;

function removeLinesWithKeywords(inputString: string) {
  const keywords = [
    "BlockMap",
    "x86",
    "arm",
    "Microsoft.VCLibs",
    "Microsoft.Services.Store.Engagement",
  ];
  const lines = inputString.split("\n");
  const filteredLines = lines.filter((line) => {
    return !keywords.some((keyword) => line.includes(keyword));
  });
  return filteredLines.join("\n");
}

function removeNonMatchingSubstring(inputString: string) {
  const keywords = [
    "tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files",
    "undefined",
    "Microsoft.MinecraftUWP",
  ];

  const filteredString = inputString
    .split("\n")
    .filter((line) => {
      return keywords.some((keyword) => line.includes(keyword));
    })
    .join("\n");

  return filteredString;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
