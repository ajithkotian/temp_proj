// import dependencies
const console = require("console");
const dotenv = require("dotenv");
dotenv.config(); // setup dotenv

// utilise Moralis
const Moralis = require("moralis/node");

// canvas for image compile
const { createCanvas } = require("canvas");

// import config
const {
  layers,
  width,
  height,
  editionSize,
  startEditionFrom,
  rarityWeights
} = require("./input/config.js");

// import metadata
const { compileMetadata } = require("./src/metadata");

// import for saving files
const { createFile } = require("./src/filesystem");

// setup canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Moralis creds
// const serverUrl = process.env.SERVER_URL;
// const appId = process.env.APP_ID;
// const masterKey = process.env.MASTER_KEY;
// const apiUrl = process.env.API_URL;
// // xAPIKey available here: https://deep-index.moralis.io/api-docs/#/storage/uploadFolder
// const apiKey = process.env.API_KEY;

const serverUrl = "<INSERT_MORALIS_SERVER_URL>";
const appId = "<INSERT_MORALIS_APP_ID>";
const masterKey = "<INSERT_MORALIS_MASTER_KEY>";
const apiUrl = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder";
// xAPIKey available here: https://admin.moralis.io/web3Api
const apiKey = "<INSERT_API_KEY>";

// Start Moralis session
Moralis.start({ serverUrl, appId, masterKey });

// Create generative art by using the canvas api
const startCreating = async () => {
  console.log("##################");
  console.log("# Generative Art #");
  console.log("# - Generating your NFT collection");
  console.log("##################");

  // image data collection
  let imageDataArray = [];

  // create NFTs from startEditionFrom to editionSize
  let editionCount = startEditionFrom;

  while (editionCount <= editionSize) {
    console.log("-----------------");
    console.log("Creating %d of %d", editionCount, editionSize);

    const handleFinal = async () => {
      // create image files and return object array of created images
      [...imageDataArray] = await createFile(
        canvas,
        ctx,
        layers,
        width,
        height,
        editionCount,
        editionSize,
        rarityWeights,
        imageDataArray
      );
    };

    await handleFinal();
    // iterate
    editionCount++;
  }

  await compileMetadata(
    apiUrl,
    apiKey,
    editionCount,
    editionSize,
    imageDataArray
  );

  console.log();
  console.log("#########################################");
  console.log("Meet the Survivors");
  console.log("#########################################");
  console.log();
};

// Initiate code
startCreating();
