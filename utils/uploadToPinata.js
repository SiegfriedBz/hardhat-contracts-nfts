const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET
const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)

async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath)
  const files = fs.readdirSync(fullImagesPath)
  let responses = []

  for (fileIndex in files) {
    const readbleStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    )
    try {
      const response = await pinata.pinFileToIPFS(readbleStreamForFile)
      responses.push(response)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(responses)
  return { responses, files }
}

module.exports = { storeImages }
