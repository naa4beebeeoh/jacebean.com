#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const prettier = require("prettier");

const prettierHtml = async (html, filepath) => {
  html = prettier.format(html, { parser: "html" });

  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, html);
};

const getFirebaseSnippet = () => {
  return `
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
    </script>`;
};

const getChpStyle = () => {
  return `
    <link href="/favicon.ico" rel="icon" type="image/png" />
    <style>
      .finger {
        display: inline-block;
        position:relative;
        -webkit-animation:linear infinite alternate;
        -webkit-animation-name: run;
        -webkit-animation-duration: 0.5s;
      }

      @-webkit-keyframes run {
        0% { left: 0;}
        50%{ left : 1%;}
        100%{ left: 0;}
      }

      table {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      hr {
        border: none;
        height: 1px;
        background-color: #ddd;
      }

      td, th {
        border: 1px solid #ddd;
        padding: 8px;
      }

      tr:nth-child(even){background-color: #f2f2f2;}

      tr:hover {background-color: #ddd;}

      th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #4CAF50;
        color: white;
      }

      a {
        text-decoration: none;
      }

      a:link {
        color: black;
      }

      a:visited {
        color: green;
      }

      a:hover {
        color: red;
      }

      a:active {
        color: blue;
      }

      th a:link {
        color: white;
      }

      th a:visited {
        color: yellow;
      }

      th a:hover {
        color: red;
      }

      th a:active {
        color: blue;
      }
    </style>
    <script data-ad-client="ca-pub-2845669748705451" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>`;
};

const writeCaseDetail = async (caseDetails, now) => {
  let html = `
<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="新型冠狀病毒, 個案, ${
      caseDetails[0].attributes["個案編號"]
    }" />
    <title>新型冠狀病毒個案 - ${caseDetails[0].attributes["個案編號"]}</title>
    <meta property="title" content="新型冠狀病毒個案 - ${
      caseDetails[0].attributes["個案編號"]
    }" />
    <meta property="og:title" content="新型冠狀病毒個案 - ${
      caseDetails[0].attributes["個案編號"]
    }" />
    <meta property="description" content="${
      caseDetails[0].attributes["發病日期"]
    } ${caseDetails[0].attributes["性別"]} ${
    caseDetails[0].attributes["年齡"]
  }歲 ${caseDetails[0].attributes["住院_出院_死亡"]} ${
    caseDetails[0].attributes["香港_非香港居民"]
  } ${caseDetails[0].attributes["個案分類"]}" />
    <meta property="og:description" content="${
      caseDetails[0].attributes["發病日期"]
    } ${caseDetails[0].attributes["性別"]} ${
    caseDetails[0].attributes["年齡"]
  }歲 ${caseDetails[0].attributes["住院_出院_死亡"]} ${
    caseDetails[0].attributes["香港_非香港居民"]
  } ${caseDetails[0].attributes["個案分類"]}" />
    <meta property="og:image" content="https://www.jacebean.com/favicon.png" />
    ${getChpStyle()}
  </head>
  <body>
    <table>
      <tr>
        <th>
          <span style="float: left;">最後更新日期</span
          ><span style="float: right;"><a href="/">🏠</a>&nbsp;</span>
        </th>
      </tr>
      <tr>
        <td>${now.format("DD/MM/YYYY, hh:mm:ss A")}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>個案編號</th>
        <th>${caseDetails[0].attributes["個案編號"]}</th>
      </tr>`;

  for (let key of [
    "實驗室確診報告日期",
    "發病日期",
    "性別",
    "年齡",
    "住院_出院_死亡",
    "香港_非香港居民",
    "個案分類",
  ]) {
    html += `
      <tr>
        <td>${key.replace(/_/g, "/")}</td>
        <td>${caseDetails[0].attributes[key]}</td>
      </tr>`;
  }

  let isFirst = true;

  for (let caseDetail of caseDetails) {
    const relatedCases =
      caseDetail.attributes.Related_confirmed_cases.match(/\d+/g);

    html += `
      <tr>
        <th>相關確診個案</th>
        <th>${relatedCases
          .sort()
          .map((c, index) => {
            if (isFirst)
              return `<a href="/chp/${c}.html">${c}</a><div class="finger">👈</div>`;
            else return `<a href="/chp/${c}.html">${c}</a>`;
          })
          .join("<hr />")}</th>
      </tr>
      <tr>
        <td>地區</td>
        <td><a href="/chp/${caseDetail.attributes["地區"]}.html">${
      caseDetail.attributes["地區"]
    }</a>`;

    if (isFirst) {
      html += '<div class="finger">👈</div>';
    }

    html += `
        </td>
      </tr>
      <tr>
        <td>大廈名單</td>
        <td><a target="_blank" href="https://www.google.com/maps?q=${
          caseDetail.attributes["地區"]
        }+${caseDetail.attributes["大廈名單"]
      .replace(/ \(非住宅\)$/, "")
      .replace(/ /g, "+")}">${caseDetail.attributes["大廈名單"].replace(
      / \(非住宅\)$/,
      ""
    )}</a>`;

    if (isFirst) {
      html += '<div class="finger">👈</div>';
      isFirst = false;
    }

    html += `
        </td>
      </tr>`;

    const date = moment(caseDetail.attributes.DateoftheLastCase);

    html += `
      <tr>
        <td>最後有個案在出現病徵期間逗留的日期</td>
        <td>${date.format("DD")}/${date.format("MM")}/${date.format(
      "YYYY"
    )}</td>
      </tr>`;
  }

  html += `
    </table>
    ${getFirebaseSnippet()}
  </body>
</html>`;

  await prettierHtml(
    html,
    `docs/chp/${caseDetails[0].attributes["個案編號"]}.html`
  );
};

const chp = async () => {
  try {
    const now = moment();

    const baseUrl =
      "https://services8.arcgis.com/PXQv9PaDJHzt8rp0/arcgis/rest/services";
    const urlSuffix =
      "FeatureServer/0/query?f=json&where=Status%3D%27Existing%27&outFields=*";
    const buildingUrl = `${baseUrl}/StayBuildingWithHistory_0227_test_View/${urlSuffix}`;
    const caseUrl = `${baseUrl}/Merge_Display_0227_test_view/${urlSuffix}`;

    console.log(`curl '${buildingUrl}'`);
    console.log(`curl '${caseUrl}'`);

    const buildings = await axios.get(buildingUrl);
    if (buildings.data.error) {
      console.error(buildings.data.error);
      process.exit(30002);
    }

    const cases = await axios.get(caseUrl);
    if (cases.data.error) {
      console.error(cases.data.error);
      process.exit(30003);
    }

    fs.mkdirSync("docs/chp", { recursive: true });
    fs.writeFileSync(
      "docs/chp/buildings.json",
      JSON.stringify(buildings.data, null, 2)
    );
    fs.writeFileSync(
      "docs/chp/cases.json",
      JSON.stringify(cases.data, null, 2)
    );

    const districts = [
      {
        name: "中西區",
        district: "Central & Western",
      },
      {
        name: "東區",
        district: "Eastern",
      },
      {
        name: "離島",
        district: "Islands",
      },
      {
        name: "九龍城",
        district: "Kowloon City",
      },
      {
        name: "葵青",
        district: "Kwai Tsing",
      },
      {
        name: "觀塘",
        district: "Kwun Tong",
      },
      {
        name: "北區",
        district: "North",
      },
      {
        name: "西貢",
        district: "Sai Kung",
      },
      {
        name: "沙田",
        district: "Sha Tin",
      },
      {
        name: "深水埗",
        district: "Sham Shui Po",
      },
      {
        name: "南區",
        district: "Southern",
      },
      {
        name: "大埔",
        district: "Tai Po",
      },
      {
        name: "荃灣",
        district: "Tsuen Wan",
      },
      {
        name: "屯門",
        district: "Tuen Mun",
      },
      {
        name: "灣仔",
        district: "Wan Chai",
      },
      {
        name: "黃大仙",
        district: "Wong Tai Sin",
      },
      {
        name: "油尖旺",
        district: "Yau Tsim Mong",
      },
      {
        name: "元朗",
        district: "Yuen Long",
      },
      {
        name: "有待提供",
        district: "",
      },
    ];

    for (let feature of buildings.data.features) {
      for (let district of districts) {
        if (!district.residential) district.residential = [];
        if (!district.nonResidential) district.nonResidential = [];

        if (feature.attributes.District === district.district) {
          feature.attributes.Related_confirmed_cases =
            feature.attributes.Related_confirmed_cases.match(/\d+/g);

          if (
            feature.attributes &&
            feature.attributes.Related_confirmed_cases
          ) {
            for (let buildingCase of feature.attributes
              .Related_confirmed_cases) {
              feature.attributes.caseDetails = cases.data.features.filter(
                (c) => c.attributes.Case_no_ === parseInt(buildingCase)
              );

              if (feature.attributes.caseDetails.length > 0)
                await writeCaseDetail(feature.attributes.caseDetails, now);
            }
          }

          if (feature.attributes.ResidentialCase === "Y") {
            district.residential.push(feature.attributes);
          } else {
            district.nonResidential.push(feature.attributes);
          }
        }
      }
    }

    districts.sort((a, b) => {
      return (
        b.residential.length +
        b.nonResidential.length -
        (a.residential.length + a.nonResidential.length)
      );
    });

    let html = `
<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="新型冠狀病毒, 個案, 大廈名單" />
    <title>新型冠狀病毒個案大廈名單</title>
    <meta property="title" content="新型冠狀病毒個案大廈名單" />
    <meta property="og:title" content="新型冠狀病毒個案大廈名單" />
    <meta property="description" content="新型冠狀病毒個案大廈名單" />
    <meta property="og:description" content="新型冠狀病毒個案大廈名單" />
    <meta property="og:image" content="https://www.jacebean.com/favicon.png" />
    ${getChpStyle()}
  </head>
  <body>
    <table>
      <tr>
        <th>
          <span style="float: left;">最後更新日期</span
          ><span style="float: right;"><a href="/">🏠</a>&nbsp;</span>
        </th>
      </tr>
      <tr>
        <td>${now.format("DD/MM/YYYY, hh:mm:ss A")}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>地區</th>
        <th>總數 (${districts.reduce(
          (a, b) => a + b.residential.length + b.nonResidential.length,
          0
        )})</th>
      </tr>`;

    let isFirst = true;

    for (let district of districts) {
      html += `
      <tr>
        <td><a href="/chp/${district.name}.html">${district.name}</a>`;

      if (isFirst) {
        html += '<div class="finger">👈</div>';
        isFirst = false;
      }

      html += `
        </td>
        <td>${district.residential.length + district.nonResidential.length}</td>
      </tr>`;
    }

    html += `
    </table>
    ${getFirebaseSnippet()}
  </body>
</html>`;

    await prettierHtml(html, `docs/chp/index.html`);

    for (let district of districts) {
      let html = `
<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="新型冠狀病毒, 個案, 大廈名單, ${
      district.name
    }" />
    <title>新型冠狀病毒個案大廈名單 - ${district.name}</title>
    <meta property="title" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="og:title" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="description" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="og:description" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="og:image" content="https://www.jacebean.com/favicon.png" />
    ${getChpStyle()}
  </head>
  <body>
    <table>
      <tr>
        <th>
          <span style="float: left;">最後更新日期</span
          ><span style="float: right;"><a href="/">🏠</a>&nbsp;</span>
        </th>
      </tr>
      <tr>
        <td>${now.format("DD/MM/YYYY, hh:mm:ss A")}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>${district.name} (曾有確診或疑似個案居住過的住宅大廈名單)</th>
        <th>相關確診/疑似個案編號</th>
      </tr>`;

      district.residential.sort((a, b) => {
        return a["大廈名單"].localeCompare(b["大廈名單"]);
      });

      isFirst = true;

      for (let building of district.residential) {
        let isNew = "";
        if (now.diff(moment(building.FirstReportedDate), "days") < 2)
          isNew = " ⛔";
        else if (now.diff(moment(building.FirstReportedDate), "days") < 3)
          isNew = " ⚠️";

        html += `
      <tr>
        <td><a target="_blank" href="https://www.google.com/maps?q=${
          district.name
        }+${building["大廈名單"]
          .replace(/ \(非住宅\)$/, "")
          .replace(/ /g, "+")}">${building["大廈名單"].replace(
          / \(非住宅\)$/,
          ""
        )}${isNew}</a>`;

        if (isFirst) {
          html += '<div class="finger">👈</div>';
        }

        if (building.Related_confirmed_cases) {
          html += `
          </td>
        <td style="min-width: 60px">${building.Related_confirmed_cases.sort()
          .map((c, index) => {
            if (isFirst)
              return `<a href="/chp/${c}.html">${c}</a><div class="finger">👈</div>`;
            else return `<a href="/chp/${c}.html">${c}</a>`;
          })
          .join("<hr />")}</td>`;
        } else html += `<td style="min-width: 60px">&nbsp;</td>`;

        html += `</tr>`;

        isFirst = false;
      }

      html += `
    </table>
    <table>
      <tr>
        <th>${district.name} (曾有確診或疑似個案在自出現病徵前兩天起到訪過的大廈或兩宗或以上確診或疑似個案在潛伏期內到訪過的大廈名單)</th>
        <th>報告日期/曾有涉及個案最後到訪的日期</th>
        <th>相關確診/疑似個案編號</th>
      </tr>`;

      district.nonResidential.sort((a, b) => {
        return a["大廈名單"].localeCompare(b["大廈名單"]);
      });

      isFirst = true;

      for (let building of district.nonResidential) {
        const date = moment(building.DateoftheLastCase);

        let isNew = "";
        if (now.diff(moment(building.FirstReportedDate), "days") < 2)
          isNew = " ⛔";
        else if (now.diff(moment(building.FirstReportedDate), "days") < 3)
          isNew = " ⚠️";

        html += `
      <tr>
        <td><a target="_blank" href="https://www.google.com/maps?q=${
          district.name
        }+${building["大廈名單"]
          .replace(/ \(非住宅\)$/, "")
          .replace(/ /g, "+")}">${building["大廈名單"].replace(
          / \(非住宅\)$/,
          ""
        )}${isNew}</a>`;

        if (isFirst) {
          html += '<div class="finger">👈</div>';
        }

        html += `
          </td>
        <td>${date.format("DD")}/${date.format("MM")}/${date.format(
          "YYYY"
        )}</td>`;

        if (building.Related_confirmed_cases) {
          html += `
        <td style="min-width: 60px">${building.Related_confirmed_cases.sort()
          .map((c, index) => {
            if (isFirst)
              return `<a href="/chp/${c}.html">${c}</a><div class="finger">👈</div>`;
            else return `<a href="/chp/${c}.html">${c}</a>`;
          })
          .join("<hr />")}</td>`;
        } else html += `<td style="min-width: 60px">&nbsp;</td>`;

        html += `</tr>`;

        isFirst = false;
      }

      html += `
    </table>
    ${getFirebaseSnippet()}
  </body>
</html>`;

      await prettierHtml(html, `docs/chp/${district.name}.html`);
    }

    fs.copyFileSync("docs/chp/index.html", "docs/index.html");
    fs.copyFileSync("docs/chp/index.html", "docs/404.html");
  } catch (e) {
    console.error(e);
    process.exit(30001);
  }
};

const itunes = async () => {
  try {
    const countries = [
      { code: "gb", name: "United Kingdom" },
      { code: "hk", name: "Hong Kong" },
      { code: "jp", name: "Japan" },
      { code: "tw", name: "Taiwan" },
      { code: "us", name: "United States" },
    ];

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
<html lang="en" translate="no">
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
    <meta property="og:image" content="https://www.jacebean.com/favicon.png" />
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
              alt="${movie.name.replace(/"/g, "&quot;")}"
              src="${movie.artworkUrl100}"
            /><br />${movie.name.replace(/"/g, "&quot;")}<br />${
          movie.releaseDate
        }</a
          >
        </div>`;
      }

      html += `
      </div>
    </div>
    ${getFirebaseSnippet()}
  </body>
</html>`;

      await prettierHtml(html, `docs/itunes/${country.code}/index.html`);
    }

    fs.copyFileSync("docs/itunes/hk/index.html", "docs/itunes/index.html");
  } catch (e) {
    console.error(e);
    process.exit(20001);
  }
};

const run = async () => {
  try {
    await chp();
//    await itunes();
  } catch (e) {
    console.error(e);
    process.exit(10001);
  }
};

run();
