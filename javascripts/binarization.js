var binarized, image, thresholdLine;
var maxWidth = 550;

function loadImage(imvis){
  var grayscale = document.querySelector('.sourceImage img');
  var source = imvis ? imvis.pixels.image.src : grayscale.src;

  binarized = imageVision({ source: source, width: maxWidth }).appendTo('.applyThreshold', true);
  binarized.threshold(128);

  binarized.on('loaded', function(){
    renderHistogram(binarized.getHistogram(), 128);
  });
}

loadImage();

var slider = document.querySelector('#threshold');
var sliderValue = document.querySelector('#threshold + .value');

slider.addEventListener('input', function(){
  onThreshold(this.value);
});

var adaptiveThresholdButton = document.querySelector('#adaptiveThreshold');

adaptiveThresholdButton.addEventListener('click', function(){
  var threshold = binarized.getAdaptiveThreshold();
  slider.value = threshold;
  onThreshold(threshold);
});

function onThreshold(threshold){
  binarized.threshold(threshold);
  sliderValue.textContent = threshold;
  thresholdLine.style.left = threshold/255 * 100 + "%";
}

var ownImageInput = document.querySelector('#ownImage');

ownImageInput.addEventListener('change', function(){
  var reader = new FileReader();
  reader.addEventListener('load', function(event) {
    imageVision({ source: event.target.result, width: maxWidth })
      .appendTo('.sourceImage', true)
      .on('loaded', loadImage);
  });
  reader.readAsDataURL(this.files[0]);
});

function renderHistogram(histogram, threshold){
  var histograms = document.querySelectorAll('.histogram');
  var fragment = document.createDocumentFragment();
  var max = 0;
  var height = histograms[0].clientHeight;

  for(var i=0; i<histogram.length; i++){
    if(histogram[i] > max)
      max = histogram[i];
  }

  for(var i=0; i<histogram.length; i++){
    var column = document.createElement('div');
    column.style.height = height/max * histogram[i] + "px";
    fragment.appendChild(column);
  }

  thresholdLine = document.createElement('div');
  thresholdLine.className = 'threshold';
  thresholdLine.style.left = threshold/255 * 100 + "%";
  fragment.appendChild(thresholdLine);

  while(histograms[0].firstChild)
    histograms[0].removeChild(histograms[0].firstChild);

  histograms[0].appendChild(fragment);

  // potentially clone the histogram
  for(var i=1; i<histograms.length; i++){
    histograms[i].innerHTML = histograms[0].innerHTML;
  }
}
