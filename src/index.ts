import express = require("express");
import("node-fetch");
const rateLimit = require("express-rate-limit");
// imports are like that cause intellisense

const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

const PORT = process.env.PORT || 3000;

function filterHTML(inputString: string) {
  const removeKeywords = [
    "BlockMap",
    "x86",
    "arm",
    "Microsoft.VCLibs",
    "Microsoft.Services.Store.Engagement",
  ];
  const lines = inputString.split("\n");
  const lessHTML = lines
    .filter((line) => {
      return !removeKeywords.some((keyword) => line.includes(keyword));
    })
    .join("\n");

  const keepKeywords = [
    "tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files",
    "undefined",
    "Microsoft.MinecraftUWP",
  ];

  const filteredString = lessHTML
    .split("\n")
    .filter((line) => {
      return keepKeywords.some((keyword) => line.includes(keyword));
    })
    .join("\n");

  const match = filteredString.match(
    /<a href="([^"]+)"[^>]*>([^<]+)<\/a><\/td><td[^>]*>[^<]+<\/td><td[^>]*>[^<]+<\/td><td[^>]*>([^<]+)<\/td>/
  );

  if (match) {
    if (match) {
      const [, link, fileName, sizeStr] = match;

      return {
        fileName,
        link,
        sizeMB: sizeStr,
      };
    }

    return null;
  }
}

app.get("/", (req, res) => {
  fetch("https://store.rg-adguard.net/api/GetFiles", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      type: "url",
      url: "https://xbox.com/en-us/games/store/minecraft-for-windows/9nblggh2jhxj",
      ring: '"RP"',
      lang: '"en-US"',
    }),
  })
    .then((response) => {
      response.text().then((baseHTML: string) => {
        res.send(filterHTML(baseHTML));
      });
    })
    .catch((err) => console.error(err));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});