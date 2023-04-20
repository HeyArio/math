var model;

async function loadModel() {
  model = await tf.loadGraphModel("TFJS/model.json");
}

function predictImage() {
    

    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);

    var height = image.rows;
    var width = image.cols;

    if (height > width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols/scaleFactor);
    }
    else {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows/scaleFactor);
    }

    let newSize = new cv.Size(width, height);
    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    const left = Math.ceil(4 + (20 - width)/2)
    const right = Math.floor(4 + (20 - width)/2)
    const top = Math.ceil(4 + (20 - height)/2)
    const bot = Math.floor(4 + (20 - height)/2)
   

    const black = new cv.Scalar(0, 0, 0, 0)
    cv.copyMakeBorder(image, image, top, bot, left, right, cv.BORDER_CONSTANT, black);

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const moments = cv.moments(cnt, false);

    const cx = moments.m10/moments.m00;
    const cy = moments.m01/moments.m00;
    

    const xShift = Math.round(image.cols/2 - cx);
    const yShift = Math.round(image.rows/2 - cy);

    newSize = new cv.Size(image.cols, image.rows);
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, xShift, 0, 1, yShift]);
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, black);

    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map(function (item) {
      return item/255.0;
    });

    const X = tf.tensor([pixelValues]);
    var result = model.predict(X);
    console.log(`Prediction: ${result}`);

    console.log(tf.memory());

    const outoput = result.dataSync()[0];

   
    image.delete();
    contours.delete();
    hierarchy.delete();
    cnt.delete();
    M.delete();
    X.dispose();
    result.dispose();

    return outoput;
}