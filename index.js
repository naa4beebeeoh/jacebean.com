#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs");
const prettier = require("prettier");
const validator = require("html-validator");

const countries = [
  { code: "gb", name: "United Kingdom" },
  { code: "hk", name: "Hong Kong" },
  { code: "jp", name: "Japan" },
  { code: "tw", name: "Taiwan" },
  { code: "us", name: "United States" },
];

const prettierHtml = async (html, filepath) => {
  html = prettier.format(html, { parser: "html" });

  const result = await validator({
    data: html,
    format: "text",
  });
  console.log(result);

  fs.writeFileSync(filepath, html);
};

const run = async () => {
  try {
    for (let country of countries) {
      const res = await axios.get(
        `https://rss.itunes.apple.com/api/v1/${country.code}/movies/top-movies/all/100/explicit.json`
      );

      const top10 = res.data.feed.results
        .slice(0, 10)
        .map((m) => m.name)
        .join(", ");

      let html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="itunes, movie, ${top10}" />
    <title>Top 100 Movies - ${country.name}</title>
    <meta property="title" content="Top 100 Movies - ${country.name}" />
    <meta property="og:title" content="Top 100 Movies - ${country.name}" />
    <meta property="description" content="${top10}" />
    <meta property="og:description" content="${top10}" />
    <link href="/favicon.ico" rel="icon" type="image/png" />
    <style>
      div.container {
        margin: 0 auto;
        text-align: center;
      }
      div.movie {
        display: inline-block;
        width: 180px;
        height: 280px;
        overflow: hidden;
        text-align: center;
      }
      a {
        text-decoration: none;
        color: black;
      }
      a:hover {
        color: red;
      }
    </style>
  </head>
  <body>
  <div class="container">
    <div class="chart">`;

      for (let movie of res.data.feed.results) {
        html += `
      <div class="movie">
        <a
          href="${movie.url}?at=1000lHjy"
          ><img
            loading="lazy"
            alt="${movie.name}"
            src="${movie.artworkUrl100}"
          /><br />${movie.name}<br />${movie.releaseDate}</a
        >
      </div>`;
      }

      html += `
    </div>
    </div>
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/7.13.2/firebase-analytics.js"></script>

    <script>
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyDWpRDJR-QXfoJpC4owgAjAcAJI1lCo5Fg",
        authDomain: "jacebean-715.firebaseapp.com",
        databaseURL: "https://jacebean-715.firebaseio.com",
        projectId: "jacebean-715",
        storageBucket: "jacebean-715.appspot.com",
        messagingSenderId: "837393448164",
        appId: "1:837393448164:web:0103c5b195fa486799c0f1",
        measurementId: "G-YCNJGDFT77",
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    </script>
  </body>
</html>`;

      await prettierHtml(html, `docs/itunes/${country.code}/index.html`);
    }

    fs.copyFileSync("docs/itunes/hk/index.html", "docs/index.html");
  } catch (e) {
    console.error(e);
  }
};

run();
