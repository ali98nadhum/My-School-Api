const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const compressImage = async (inputPath, fileName, options = {}) => {
    const {
        width = 1000,
        quality = 70,
        format = "webp",
        outputDir = "uploads/images",
    } = options;

    const compressedFileName = `compressed-${fileName.split('.')[0]}.${format}`;
    const outputPath = path.join(outputDir, compressedFileName);

    await sharp(inputPath)
        .resize({ width })
    [format]({ quality })
        .toFile(outputPath);

    fs.unlinkSync(inputPath);

    return compressedFileName;
};

module.exports = compressImage;
