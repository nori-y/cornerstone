import colors from '../colors/index.js';
import now from './now.js';

/**
 *
 * @param {Image} image A Cornerstone Image Object
 * @param {Array} grayscaleLut Lookup table array
 * @param {LookupTable|Array} colorLut Lookup table array
 * @param {Uint8ClampedArray} canvasImageDataData canvasImageData.data buffer filled with white pixels
 *
 * @returns {void}
 * @memberof Internal
 */
function storedPixelDataToCanvasImageDataPseudocolorLUT (image, grayscaleLut, colorLut, canvasImageDataData) {
  let start = now();
  const pixelData = image.getPixelData();

  image.stats.lastGetPixelDataTime = now() - start;

  const numPixels = pixelData.length;
  const minPixelValue = image.minPixelValue;
  let canvasImageDataIndex = 0;
  let storedPixelDataIndex = 0;
  let grayscale;
  let rgba;
  let clut;

  start = now();

  if (colorLut instanceof colors.LookupTable) {
    clut = colorLut.Table;
  } else {
    clut = colorLut;
  }

  const isPadding = typeof image.pixelPaddingValue !== 'undefined';

  if (minPixelValue < 0) {
    while (storedPixelDataIndex < numPixels) {
      const pixel = pixelData[storedPixelDataIndex++];

      if (isPadding && pixel === image.pixelPaddingValue) {
        rgba = [0, 0, 0, 255];

      } else {
        grayscale = grayscaleLut[pixel + (-minPixelValue)];
        rgba = clut[grayscale];
      }

      canvasImageDataData[canvasImageDataIndex++] = rgba[0];
      canvasImageDataData[canvasImageDataIndex++] = rgba[1];
      canvasImageDataData[canvasImageDataIndex++] = rgba[2];
      canvasImageDataData[canvasImageDataIndex++] = rgba[3];
    }
  } else {
    while (storedPixelDataIndex < numPixels) {
      const pixel = pixelData[storedPixelDataIndex++];

      if (isPadding && pixel === image.pixelPaddingValue) {
        rgba = [0, 0, 0, 255];

      } else {
        grayscale = grayscaleLut[pixel];
        rgba = clut[grayscale];
      }

      canvasImageDataData[canvasImageDataIndex++] = rgba[0];
      canvasImageDataData[canvasImageDataIndex++] = rgba[1];
      canvasImageDataData[canvasImageDataIndex++] = rgba[2];
      canvasImageDataData[canvasImageDataIndex++] = rgba[3];
    }
  }

  image.stats.lastStoredPixelDataToCanvasImageDataTime = now() - start;
}

export default storedPixelDataToCanvasImageDataPseudocolorLUT;
