const sharp = require('sharp');

async function removeWhiteBackground() {
  try {
    const image = sharp('public/logo.png');
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // if pixel is close to white
      if (r > 230 && g > 230 && b > 230) {
        data[i + 3] = 0; // set alpha to 0
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile('public/logo-transparent.png');
      
    console.log('Success');
  } catch (err) {
    console.error(err);
  }
}
removeWhiteBackground();
