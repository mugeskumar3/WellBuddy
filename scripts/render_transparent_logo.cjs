const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  try {
    const win = new BrowserWindow({
      width: 512,
      height: 512,
      show: false,
      transparent: true,
      frame: false,
      webPreferences: {
        offscreen: true,
      },
    });

    const svgPath = path.resolve('public/logo.svg');
    const svgUrl = 'file://' + svgPath.replace(/\\/g, '/');
    await win.loadURL(svgUrl);

    // Give it a moment to render vector filters
    await new Promise((r) => setTimeout(r, 600));

    const image = await win.capturePage();
    const pngBuffer = image.toPNG();
    fs.writeFileSync('public/logo.png', pngBuffer);
    fs.writeFileSync('public/icon.png', pngBuffer);
    fs.writeFileSync('dist/logo.png', pngBuffer);
    fs.writeFileSync('dist/icon.png', pngBuffer);
    console.log('SUCCESS: Rendered transparent PNGs, buffer size:', pngBuffer.length);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    app.quit();
  }
});
