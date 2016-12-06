/*
Timeline:
  createGrid
  Test Shape
  pointInShape
  marchingCubes
    group grid into cubes
    which cube vertexes in shape
    select half way point
    draw polygonalization
*/
// Global Variables
var canvas = document.querySelector('#paint');
var ctx = canvas.getContext('2d');
var sketch = document.querySelector('#sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = parseInt(sketch_style.getPropertyValue('width'));
canvas.height = parseInt(sketch_style.getPropertyValue('height'));
var radius = 10;
var mouse = {
    x: 0,
    y: 0
};
var geometryLayer = []; // Stores geometric information for later manipulation
var gridPoints = [];

// Utility Functions
function rgb(r, g, b, def) {
    def = parseInt(def, 10) || 0;
    return 'rgb(' + [(r || def), (g || def), (b || def)].join(',') + ')';
}

function testCase(caseNumber,input,expectedResult){
  if (input === expectedResult){
    console.log("Test case " + caseNumber + " passed!");
  }
  else{
    console.log("Test case " + caseNumber + " failed!");
    console.log(input);
  }
}


function createGrid(width, height, resolution) {
    squareWidth = width / resolution;
    squareHeight = height / resolution;
    sc =0;
    for (y = 0; y < width; y += squareHeight) {
        for (x = 0; x < width; x += squareWidth) {
            ctx.fillStyle = rgb(0,0,0);
            ctx.fillRect(x, y, 5, 5);
            gridPoints.push({x:x,y:y});
        }
    }
}

function distance(p,s){
  x1 = p.x;
  y1 = p.y;
  x2 = s.x;
  y2 = s.y;

  a  = x2-x1;
  b  = y2-y1;
  aa = a*a;
  bb = b*b;
  d  = Math.sqrt(aa+bb);
  return d;
}

// Determines if a point with within a closed shape
function pointInShape(p, s) {
  if (distance(p,s) < radius){
    return true;
  }
  else{
    return false;
  }
}

/*
Approximates drawn volumetric data with a polygon around shadded parts
  Assumes: No holes inside drawn shape.
*/
function marchingCubes() {
    createGrid(canvas.width, canvas.height, 10);
    // group grid into cubes
    // which cube vertexes in shape
    for (var i = 0; i < geometryLayer.length; i++) {
      for (var j = 0; j < gridPoints.length; j++) {
        if (pointInShape(gridPoints[j], geometryLayer[i])) {
          gridPoints[j].in = true;
          ctx.fillStyle = rgb(255,0,0);
          ctx.fillRect(gridPoints[j].x, gridPoints[j].y, 5, 5);
        }
      }

    }
    // select half way point
    // draw polygonalization
}

// Painting Code //////////////////////////////////////////////////////////////
/* Painting code based on a tutorial by Rishabh
http://codetheory.in/creating-a-paint-application-with-html5-canvas/
*/
var onPaint = function() {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    geometryLayer.push({x:mouse.x, y:mouse.y});

    ctx.arc(mouse.x, mouse.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
};

/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX - canvas.offsetLeft - 15;
    mouse.y = e.pageY - canvas.offsetTop - 15;
}, false);

canvas.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);

document.getElementById("clickMe").onclick = marchingCubes;

function mainJS() {
    console.log("Main ran");
    //Test cases
    tp = {x:2,y:2};
    ts = {x:0,y:0};
    testCase(0,radius,10); // Expected results assume radius = 10
    testCase(1,pointInShape(tp, ts),true);
    testCase(2,distance(tp,ts),2.8284271247461903);
}
mainJS();
