
// image variables
var threshold = 20; //255 is white, 0 is black
var aveX, aveY, video; //this is what we are trying to find
var objectR =255, objectG = 255, objectB = 255, randomcolor;
var debug = true;
var ctx, capture, canvas, imgToy, imgToy2, cat;
var center;



function screenshot(){
	var dataUrl = canvas.toDataURL();
	window.open(dataUrl, "toDataURL() image");
}

function preload(){
	imgToy = loadImage('toy.png');
	imgToy2 = loadImage('toy.png');
	cat= loadImage('cat1.gif');
  }

function setup() {
	//background(255,255,255,50);
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('sketch');
	//ctx = createGraphics(windowWidth, windowHeight);
	// set up video things
	capture = createCapture(VIDEO);
	capture.hide();
	frameRate(60);


	//randomcolor = "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)';

}

function draw() {


	capture.loadPixels();

	var totalFoundPixels = 0; //we are going to find the average location of change pixes so
	var sumX = 0; //we will need the sum of all the x find, the sum of all the y find and the total finds
	var sumY = 0;


	//enter into the classic nested for statements of computer vision
	for (var row = 0; row < capture.height; row++) {
		for (var col = 0; col < capture.width; col++) {
			//the pixels file into the room long line you use this simple formula to find what row and column the sit in

			var offset = (row * capture.width + col) * 4;
			//pull out the same pixel from the current frame
			var thisColor = capture.pixels[offset];

			//pull out the individual colors for both pixels
			var r = capture.pixels[offset];
			var g = capture.pixels[offset + 1];
			var b = capture.pixels[offset + 2];

			//in a color "space" you find the distance between color the same whay you would in a cartesian space, phythag or dist in processing
			var diff = dist(r, g, b, objectR, objectG, objectB);

			if (diff < threshold) { //if it is close enough in size, add it to the average
				sumX = sumX + col;
				sumY = sumY + row;
				totalFoundPixels++;
				//if (debug) video.pixels[offset] = 0xff000000;//debugging
			}
		}
	}
	capture.updatePixels();

	//image(capture, 0, 0);
	//console.log(objectR,objectG,objectB);

    console.log(1)

	const msg = {
		totalFoundPixels,
		sumX,
		sumY,
		objectR,
		objectB,
		objectG
	}

	if (totalFoundPixels > 0) {
        handleDraw(msg)
        sendMessage({ ...msg, event: 'DRAW' });
	}
}

function rgbToHsv(r, g, b) {
	r /= 255, g /= 255, b /= 255;

	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, v = max;

	var d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
	  h = 0; // achromatic
	} else {
	  switch (max) {
		case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		case g: h = (b - r) / d + 2; break;
		case b: h = (r - g) / d + 4; break;
	  }

	  h /= 6;
	}

	return [ 100*h, 50*s, 100 , 60 ];
  }

function handleDraw({ totalFoundPixels, sumX, sumY, objectR, objectB, objectG }) {
	// average location of pixels
	aveX = sumX / totalFoundPixels;
	aveY = sumY / totalFoundPixels;
	// rgbToHsv(objectR,objectG,objectB);
	// //console.log(rgbToHsv(objectR,objectG,objectB));

	// //fill(objectR,objectG+10,objectB+10, Math.random() * 80);
	// fill(objectR,objectG,objectB);
	// noStroke()
	// var r = Math.random()*50;
	// ellipse(width-2*aveX,2*aveY, r, r);
    clear();
  //image(cat, width/2-200, height-400, 400, 300);
	image(imgToy, width-2*aveX, 2*aveY, 200, 200);

}

function handleDraw2({ totalFoundPixels, sumX, sumY, objectR, objectB, objectG }) {
	// average location of pixels
	aveX = sumX / totalFoundPixels;
	aveY = sumY / totalFoundPixels;
	// rgbToHsv(objectR,objectG,objectB);
	// //console.log(rgbToHsv(objectR,objectG,objectB));

	// //fill(objectR,objectG+10,objectB+10, Math.random() * 80);
	// fill(objectR,objectG,objectB);
	// noStroke()
	// var r = Math.random()*50;
	// ellipse(width-2*aveX,2*aveY, r, r);
    clear();
  //image(cat, width/2-200, height-400, 400, 300);
	image(imgToy2, width-2*aveX, 2*aveY, 200, 200);

}
function handleSendMessage(message) {
	sendMessage({ event: 'MESSAGE', msg: message })
}
