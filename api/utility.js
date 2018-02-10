const Image = require('../models/Image');
const ImageWrapper = require('../models/ImageWrapper');
const ProcessedDatum = require('../models/ProcessedDatum');

const {detectedFaceToVector} = require('./face-detection');
const {getDetectedFaceFromFile} = require('../playground/getDetectedFaceFromFile');

const imagesToValues = (images, detectedTime) => new Promise(async (resolve, reject) => {
    try {
        let faceImageIds = [];
        let processedDataIds = [];

        const values = await Promise.all(images.map(async image => {
            const processedDatum = await getDetectedFaceFromFile(image); // mock function.
            if (!processedDatum) throw new Error("no datum.");

            const faceImage = new Image({image});
            await faceImage.save(); // save image.

            const datum = new ProcessedDatum({processedDatum});
            await datum.save(); // save json file.

            processedDataIds.push(datum.id); // save the id for images.
            faceImageIds.push(faceImage.id);

            return detectedFaceToVector(processedDatum);
        }));

        const imageWrapper = new ImageWrapper({
            images: faceImageIds,
            processedData: processedDataIds,
            detectedTime
        });
        await imageWrapper.save();
        resolve({
            values,
            imageWrapperId : imageWrapper.id
        });
    } catch (e) {
        reject(e);
    }
});

module.exports = {imagesToValues};