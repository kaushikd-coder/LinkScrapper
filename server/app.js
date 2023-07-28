const express = require('express');
const app = express();
const connecttomongo = require('./db');
const cors = require('cors')
const { URL } = require('url');
const bodyParser = require('body-parser');
require('dotenv').config()
const cron = require('node-cron');
const Link = require('./model/Link');
const cheerio = require('cheerio');
const axios = require('axios')
app.use(cors())
connecttomongo();
// app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// app.use(upload.array()); 
app.use(express.json({ limit: '50mb' }));

app.post('/addlink', async (req, res) => {
  try {
    const { link } = req.body;
    const urlObj = new URL(link);
    const output = urlObj.pathname.split('/dp/')[1].split('/')[0];
    const prodlink = `https://www.amazon.in/dp/${output}`;

    const websiteData = await scrapeWebsiteData(prodlink);
    if (websiteData === 'Error') {
      res.status(500).json({ success: false, message: "Failed to fetch website data" });
    } else {
      const data = await Link.create({ link: prodlink, name: websiteData.name, data: [websiteData] });
      res.status(200).json({ success: true, data })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch website data' });
  }
});
app.get('/links', async (req, res) => {
  try {
    const data = await Link.find();
    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch website data' });
  }
});

function extractNumberFromString(inputString) {
  // Replace all commas in the input string with an empty string
  const stringWithoutCommas = inputString.replace(/,/g, '');

  const regex = /\d+/;
  const match = stringWithoutCommas.match(regex);
  if (match) {
    const number = parseInt(match[0]);
    return number;
  } else {
    return 0; // Return 0 if no number is found in the string
  }
}

function extractNumber2FromString(inputString) {
  const regex = /(\d+)\s*with\s+reviews/;
  const stringWithoutCommas = inputString.replace(/,/g, '');

  const match = stringWithoutCommas.match(regex);
  if (match && match[1]) {
    const number = parseInt(match[1]);
    return number;
  } else {
    return 0; // Return null if no number is found in the string
  }
}


// async function scrapeWebsiteData(link) {
//   try {
//     let options = { headless: "new"};
//     const browser = await puppeteer.launch(options);
//     const page = await browser.newPage();
//     await page.setUserAgent(UserAgent.toString()); // added this

//     await page.goto(link, { waitUntil: 'domcontentloaded' });

//     // Get the name element using Puppeteer
//     const nameElement = await page.$('.pdp-title');
//     const name = await nameElement.evaluate((element) => element.textContent);

//     // Get the element containing the price
//     const priceElement = await page.$('.pdp-price');

//     // Use evaluate function to extract the text content of the <strong> tag
//     const price = await priceElement.evaluate((element) => element.querySelector('strong').textContent);

//     const reviewsElement = await page.$('.detailed-reviews-headline');
//     const reviewdata = await reviewsElement.evaluate((element) => element.textContent);
//     const reviews = extractNumberFromString(reviewdata)

//     const ratingsElement = await page.$('.index-countDesc');
//     const ratingdata = await ratingsElement.evaluate((element) => element.textContent);
//     const ratings = extractNumberFromString(ratingdata)

//     await browser.close();

//     return { name, reviews, ratings, price };
//   } catch (error) {
//     console.log(error)
//     return 'Error'
//   }
// }
async function scrapeWebsiteData(link) {
  try {

    const response = await retryAxiosGet(link);
    if (!response || ![200, 201].includes(response.status)) {
      return res.status(200).json({ message: `Failed to fetch review data from ${link}.` });
    }
    const urlObj = new URL(link);
    const output = urlObj.pathname.split('/dp/')[1].split('/')[0];
    const newlink = `https://www.amazon.in/product-reviews/${output}`;
    console.log(newlink);

    const reviewresponse = await retryreviewAxiosGet(newlink);
    if (!reviewresponse || ![200, 201].includes(reviewresponse.status)) {
      return res.status(200).json({ message: `Failed to fetch review data from ${newlink}.` });
    }

    const $ = cheerio.load(response.data);
    const review$ = cheerio.load(reviewresponse.data);


    const priceElement = $('.a-price .a-offscreen').first();
    const price = priceElement.text().trim();

    // Get the element containing the name
    const nameElement = $('#productTitle');
    const name = nameElement.text().trim();

    // Get the ratings data
    const ratingsElement = $('#acrCustomerReviewText');
    const ratings = extractNumberFromString(ratingsElement.text());
    // Get the reviews data
    const reviewsElement = review$('#filter-info-section .a-row');

    // Extract the text content from the selected element
    const reviewsText = reviewsElement.text().trim();

    // Extract the number of reviews from the text using a regular expression
    console.log(reviewsText)
    let reviews = extractNumber2FromString(reviewsText)
    return { name, ratings, price, reviews };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function retryAxiosGet(url, retryLimit = 5) {
  let retryCount = 0;

  while (retryCount < retryLimit) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error(`Failed to fetch data from ${url}. Retrying...`);
      retryCount++;
    }
  }
  console.log(`failed to fetch from ${url}`)

  return 'Error';
}
async function retryreviewAxiosGet(url, retryLimit = 5) {
  let retryCount = 0;

  while (retryCount < retryLimit) {
    try {
      const response = await axios.get(url);
      console.log(response.data)
      return response;
    } catch (error) {
      console.error(`Failed to fetch data from ${url}. Retrying...`);
      retryCount++;
    }
  }
  console.log(`failed to fetch from ${url}`)

  return 'Error';
}

// async function scrapeWebsiteData(link) {
//   try {
//     const response = await axios.get(link);
//     const urlObj = new URL(link);
//     const output = urlObj.pathname.split('/dp/')[1].split('/')[0];
//     const newlink = `https://www.amazon.in/product-reviews/${output}`
//     console.log(newlink)
//     const $ = cheerio.load(response.data);
//     const reviewresponse = await axios.get(newlink)
//     const review$ = cheerio.load(reviewresponse.data)
//     // Get the name element
//     const priceElement = $('.a-price .a-offscreen').first();
//     const price = priceElement.text().trim();

//     // Get the element containing the name
//     const nameElement = $('#productTitle');
//     const name = nameElement.text().trim();

//     // Get the ratings data
//     const ratingsElement = $('#acrCustomerReviewText');
//     const ratings = extractNumberFromString(ratingsElement.text());
//     // Get the reviews data
//     const reviewsElement = review$('#filter-info-section .a-row');

//     // Extract the text content from the selected element
//     const reviewsText = reviewsElement.text().trim();

//     // Extract the number of reviews from the text using a regular expression
//     console.log(reviewsText)
//    let reviews=extractNumber2FromString(reviewsText)
//     return { name, ratings, price, reviews };
//   } catch (error) {
//     console.error(error);
//     return 'Error';
//   }
// }


const updateLinkdata = async () => {
  const links = await Link.find();
  for (const element of links) {
    let dataobj = await scrapeWebsiteData(element.link);
    console.log(dataobj)
    let newdata = element.data;
    newdata.push(dataobj)
    await Link.findByIdAndUpdate(element._id, {
      data: newdata
    })
  }
}

// Schedule the cron job to run every 2 hours
// cron.schedule('*/10 * * * *', () => {
//   updateLinkdata();
// });
cron.schedule('0 */2 * * *', () => {
  updateLinkdata();
});

module.exports = app