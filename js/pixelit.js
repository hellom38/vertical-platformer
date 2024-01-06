class pixelit {
  constructor(config = {}) {
    this.drawto = document.getElementById(config.to) || document.getElementById("pixelitcanvas");
    this.drawfrom = document.getElementById(config.from) || document.getElementById("pixelitimg");
    this.hideFromImg();
    this.scale = config.scale && config.scale > 0 && config.scale <= 50 ? config.scale * 0.01 : 8 * 0.01;
    this.palette = config.palette || [
      [140, 143, 174],
      [88, 69, 99],
      [62, 33, 55],
      [154, 99, 72],
      [215, 155, 125],
      [245, 237, 186],
      [192, 199, 65],
      [100, 125, 52],
      [228, 148, 58],
      [157, 48, 59],
      [210, 100, 113],
      [112, 55, 127],
      [126, 196, 193],
      [52, 133, 157],
      [23, 67, 75],
      [31, 14, 28],
    ];
    this.maxHeight = config.maxHeight;
    this.maxWidth = config.maxWidth;
    this.ctx = this.drawto.getContext("2d");
    this.endColorStats = {};
  }

  hideFromImg() {
    this.drawfrom.style.visibility = "hidden";
    this.drawfrom.style.position = "fixed";
    this.drawfrom.style.top = 0;
    this.drawfrom.style.left = 0;
    return this;
  }

  setFromImgSource(src) {
    this.drawfrom.src = src;
    return this;
  }

  setDrawFrom(elem) {
    this.drawfrom = elem;
    return this;
  }

  setDrawTo(elem) {
    this.drawto = elem;
    return this;
  }

  setPalette(arr) {
    this.palette = arr;
    return this;
  }

  setMaxWidth(width) {
    this.maxWidth = width;
    return this;
  }

  setMaxHeight(height) {
    this.maxHeight = height;
    return this;
  }

  setScale(scale) {
    this.scale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01;
    return this;
  }

  getPalette() {
    return this.palette;
  }

  colorSim(rgbColor, compareColor) {
    let i;
    let max;
    let d = 0;
    for (i = 0, max = rgbColor.length; i < max; i++) {
      d += (rgbColor[i] - compareColor[i]) * (rgbColor[i] - compareColor[i]);
    }
    return Math.sqrt(d);
  }

  similarColor(actualColor) {
    let selectedColor = [];
    let currentSim = this.colorSim(actualColor, this.palette[0]);
    let nextColor;
    this.palette.forEach((color) => {
      nextColor = this.colorSim(actualColor, color);
      if (nextColor <= currentSim) {
        selectedColor = color;
        currentSim = nextColor;
      }
    });
    return selectedColor;
  }

  pixelate() {
    this.drawto.width = this.drawfrom.naturalWidth;
    this.drawto.height = this.drawfrom.naturalHeight;
    let scaledW = this.drawto.width * this.scale;
    let scaledH = this.drawto.height * this.scale;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.drawto.width;
    tempCanvas.height = this.drawto.height;
    tempCanvas.style.visibility = "hidden";
    tempCanvas.style.position = "fixed";
    tempCanvas.style.top = "0";
    tempCanvas.style.left = "0";

    if (this.drawto.width > 900 || this.drawto.height > 900) {
      this.scale *= 0.5;
      scaledW = this.drawto.width * this.scale;
      scaledH = this.drawto.height * this.scale;
      tempCanvas.width = Math.max(scaledW, scaledH) + 50;
      tempCanvas.height = Math.max(scaledW, scaledH) + 50;
    }

    const tempContext = tempCanvas.getContext("2d");
    tempContext.drawImage(this.drawfrom, 0, 0, scaledW, scaledH);
    document.body.appendChild(tempCanvas);

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    let finalWidth = this.drawfrom.naturalWidth;
    if (this.drawfrom.naturalWidth > 300) {
      finalWidth +=
        this.drawfrom.naturalWidth > this.drawfrom.naturalHeight
          ? parseInt(this.drawfrom.naturalWidth / (this.drawfrom.naturalWidth * this.scale)) / 1.5
          : parseInt(this.drawfrom.naturalWidth / (this.drawfrom.naturalWidth * this.scale));
    }
    let finalHeight = this.drawfrom.naturalHeight;
    if (this.drawfrom.naturalHeight > 300) {
      finalHeight +=
        this.drawfrom.naturalHeight > this.drawfrom.naturalWidth
          ? parseInt(this.drawfrom.naturalHeight / (this.drawfrom.naturalHeight * this.scale)) / 1.5
          : parseInt(this.drawfrom.naturalHeight / (this.drawfrom.naturalHeight * this.scale));
    }

    this.ctx.drawImage(
      tempCanvas,
      0,
      0,
      scaledW,
      scaledH,
      0,
      0,
      finalWidth,
      finalHeight
    );

    tempCanvas.remove();
    return this;
  }

  convertGrayscale() {
    const w = this.drawto.width;
    const h = this.drawto.height;
    var imgPixels = this.ctx.getImageData(0, 0, w, h);
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var i = y * 4 * imgPixels.width + x * 4;
        var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return this;
  }

  convertPalette() {
    const w = this.drawto.width;
    const h = this.drawto.height;
    var imgPixels = this.ctx.getImageData(0, 0, w, h);
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var i = y * 4 * imgPixels.width + x * 4;
        const finalcolor = this.similarColor([
          imgPixels.data[i],
          imgPixels.data[i + 1],
          imgPixels.data[i + 2],
        ]);
        imgPixels.data[i] = finalcolor[0];
        imgPixels.data[i + 1] = finalcolor[1];
        imgPixels.data[i + 2] = finalcolor[2];
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return this;
  }

  resizeImage() {
    const canvasCopy = document.createElement("canvas");
    const copyContext = canvasCopy.getContext("2d");
    let ratio = 1.0;

    if (!this.maxWidth && !this.maxHeight) {
      return 0;
    }

    if (this.maxWidth && this.drawto.width > this.maxWidth) {
      ratio = this.maxWidth / this.drawto.width;
    }

    if (this.maxHeight && this.drawto.height > this.maxHeight) {
      ratio = this.maxHeight / this.drawto.height;
    }

    canvasCopy.width = this.drawto.width;
    canvasCopy.height = this.drawto.height;
    copyContext.drawImage(this.drawto, 0, 0);

    this.drawto.width = this.drawto.width * ratio;
    this.drawto.height = this.drawto.height * ratio;
    this.ctx.drawImage(
      canvasCopy,
      0,
      0,
      canvasCopy.width,
      canvasCopy.height,
      0,
      0,
      this.drawto.width,
      this.drawto.height
    );

    return this;
  }

  draw() {
    this.drawto.width = this.drawfrom.width;
    this.drawto.height = this.drawfrom.height;
    this.ctx.drawImage(this.drawfrom, 0, 0);
    this.resizeImage();
    return this;
  }

  saveImage() {
    const link = document.createElement("a");
    link.download = "pxArt.png";
    link.href = this.drawto
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    document.querySelector("body").appendChild(link);
    link.click();
    document.querySelector("body").removeChild(link);
  }
}
