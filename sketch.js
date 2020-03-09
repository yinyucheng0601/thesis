
// image variables
var threshold = 20; //255 is white, 0 is black
var aveX, aveY, video; //this is what we are trying to find
var objectR =255, objectG = 0, objectB = 0, randomcolor;
var debug = true;
var ctx, capture, canvas, imgToy, imgToy2, cat;
var center, mover;
var prevImgToy1Msg = { aveX: 0, aveY: 0 }, prevImgToy2Msg = { aveX: 0, aveY: 0 };

function screenshot(){
	var dataUrl = canvas.toDataURL();
	window.open(dataUrl, "toDataURL() image");
}

function preload(){
	imgToy = loadImage('toy.png');
	imgToy2 = loadImage('toy.png');
	cat= loadImage('cat1.png');
  }

function setup() {
	
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('sketch');
	//canvas.background(255);
	//ctx = createGraphics(windowWidth, windowHeight);
	// set up video things
	capture = createCapture(VIDEO);
	capture.hide();
	frameRate(60);

	mover = new Mover();
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

class Mover{
    constructor() {
      this.position = createVector(random(width),height);
      this.velocity = createVector();
      this.acceleration = createVector();
      this.topspeed = 30;
    }
  
    update() {
      // Compute a vector that points from position to mouse
      var mouse = createVector(mouseX,mouseY);
      this.acceleration = p5.Vector.sub(mouse,this.position);
      // Set magnitude of acceleration
      this.acceleration.setMag(0.1);
  
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.topspeed);
      this.position.add(this.velocity);
    }
  
    display() {
      noStroke();
      strokeWeight(2);
      fill(0);
      image(cat,this.position.x, this.position.y, 400, 400);
    }
  }


function handleDraw({ totalFoundPixels, sumX, sumY, objectR, objectB, objectG }) {
	// average location of pixels
	aveX = sumX / totalFoundPixels;
	aveY = sumY / totalFoundPixels;
	prevImgToy1Msg = {aveX: aveX, aveY: aveY}
	//console.log(aveX, aveY);
	// fill(objectR,objectG,objectB);
	// noStroke()
	// var r = Math.random()*50;
	// ellipse(width-2*aveX,2*aveY, r, r);
	clear();
	mover.update();
	mover.display();
	//image(cat, width/2-200, 400, 400, 400);
	image(imgToy, width-2*aveX, 2*aveY, 200, 200);
	image(imgToy2, width-2*prevImgToy2Msg.aveX, 2*prevImgToy2Msg.aveY, 200, 200);
}

function handleDraw2({ totalFoundPixels, sumX, sumY, objectR, objectB, objectG }) {

	aveX = sumX / totalFoundPixels;
	aveY = sumY / totalFoundPixels;
    prevImgToy2Msg = {aveX: aveX, aveY: aveY}

	clear();
    //image(cat, width/2-200, 400, 400, 400);
	image(imgToy, width-2*prevImgToy1Msg.aveX, 2*prevImgToy1Msg.aveY, 200, 200);
	image(imgToy2, width-2*aveX, 2*aveY, 200, 200);
}

function handleSendMessage(message) {
	sendMessage({ event: 'MESSAGE', msg: message })
}
