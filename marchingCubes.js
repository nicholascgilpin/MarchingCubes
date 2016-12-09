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
var gridPoints = []; // location of each grid vertix and if it is in a shape
var cells = [];

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
    console.log("Failed output: ");
    console.log(input);
  }
}

// @TODO: Starting 2017, use escma6 promises and asybc functions instead
function sleep(ms){
    var waitUntil = new Date().getTime() + ms;
    while(new Date().getTime() < waitUntil){}
}

function createGrid(width, height, resolution) {
    var squareWidth = width / resolution;
    var squareHeight = height / resolution;
    var sc =0;
    for (var i = 0; i < resolution; i++) {
        for (var j = 0; j < resolution; j++) {
            var x = i*squareWidth;
            var y = j*squareHeight;
            var a = {x:x,y:y,in:false};
            var b = {x:x,y:y+squareHeight,in:false};
            var c = {x:x+squareWidth,y:y,in:false};
            var d = {x:x+squareWidth,y:y+squareHeight,in:false};
            gridPoints.push(a);
            gridPoints.push(b);
            gridPoints.push(c);
            gridPoints.push(d);
            // Keep track of this square
            cells.push({a:a,b:b,c:c,d:d});
            // Draw with colors to illistrate the presence of squares
            ctx.fillStyle = rgb(50,50,255);
            ctx.fillRect(a.x, a.y, 1, 1);
            ctx.fillStyle = rgb(0,150,150);
            ctx.fillRect(b.x, b.y, 1, 1);
            ctx.fillStyle = rgb(25,25,200);
            ctx.fillRect(c.x, c.y, 1, 1);
            ctx.fillStyle = rgb(100,25,150);
            ctx.fillRect(d.x, d.y, 1, 1);
        }
    }
}

function distance(p,s){
  var x1 = p.x;
  var y1 = p.y;
  var x2 = s.x;
  var y2 = s.y;

  var a  = x2-x1;
  var b  = y2-y1;
  var aa = a*a;
  var bb = b*b;
  var d  = Math.sqrt(aa+bb);
  return d;
}

function midpoint(a,b){
  return {x:(a.x+b.x)/2,y:(a.y+b.y)/2};
}

// Determines which of 16 configurations of vertex covers is active
//  a---b
//  |   |
//  c---d
function determineCase(cell){
  var c = 0;
  if (cell.a.in){
    c = c | 1;
  }
  if (cell.b.in){
    c = c | 2;
  }
  if (cell.c.in){
    c = c | 4;
  }
  if (cell.d.in){
    c = c | 8;
  }
  return c;
}

// Draws a line between the midpoints of cell's/grid's walls
// @TODO: Test this function!!!!!!!!!!!!!!!!!!!
function approximateBoundry(cell){
  var a = cell.a;
  var b = cell.b;
  var c = cell.c;
  var d = cell.d;
  linesToDraw = [];
  l = midpoint(a,b);
  t = midpoint(a,c);
  b = midpoint(d,b);
  r = midpoint(d,c);
  switch (determineCase(cell)) {
      case 0:
      // 0 vertexes covered
      break;
      case 1:
      linesToDraw.push([t,l]);
      break;
      case 2:
      linesToDraw.push([l,b]);
      break;
      case 3:
      linesToDraw.push([t,b]);
      break;
      case 4:
      linesToDraw.push([t,r]);
      break;
      case 5:
      linesToDraw.push([l,r]);
      break;
      case 6:
      linesToDraw.push([t,r]);
      linesToDraw.push([b,l]);
      break;
      case 7:
      linesToDraw.push([b,r]);
      break;
      case 8:
      linesToDraw.push([b,r]);
      break;
      case 9:
      linesToDraw.push([t,l]);
      linesToDraw.push([b,r]);
      break;
      case 10:
      linesToDraw.push([l,r]);
      break;
      case 11:
      linesToDraw.push([t,r]);
      break;
      case 12:
      linesToDraw.push([t,b]);
      break;
      case 13:
      linesToDraw.push([b,l]);
      break;
      case 14:
      linesToDraw.push([t,l]);
      break;
      case 15:
      // 4 vertexes covered
      break;
    default:
      console.log("Error: approximateBoundry failed");
  }
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'red';
  for (var i = 0; i < linesToDraw.length; i++) {
    ctx.beginPath();
    ctx.moveTo(linesToDraw[i][0].x,linesToDraw[i][0].y);
    ctx.lineTo(linesToDraw[i][1].x,linesToDraw[i][1].y);
    ctx.stroke();
  }
}
// Determines if a point with within a closed shape
function pointInShape(p, s) {
  sensitivity = 0;
  if (distance(p,s) <= radius+sensitivity){
    return true;
  }
  else{
    return false;
  }
}

// Marks cube vertexes if in shaded area
function markPointsInShape(verticies,circleLocations){
  for (var i = 0; i < circleLocations.length; i++) {
    for (var j = 0; j < verticies.length; j++) {
      if (pointInShape(verticies[j], circleLocations[i])) {
        verticies[j].in = true;
        ctx.fillStyle = rgb(255,255,0);
        ctx.fillRect(verticies[j].x, verticies[j].y, 1, 1);
      }
    }
  }
}
/*
Approximates drawn volumetric data with a polygon around shadded parts
  Assumes: No holes inside drawn shape.
*/
function marchingCubes() {
    var resolution = 100; //20
    createGrid(canvas.width, canvas.height, resolution);
    markPointsInShape(gridPoints,geometryLayer);
    for (var i = 0; i < cells.length; i++) {
      approximateBoundry(cells[i]);
    }
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
    //Test cases
    console.log("Main ran");
    // var tp = {x:2,y:2};
    // var ts = {x:0,y:0};
    // testCase(0,radius,10); // Expected results assume radius = 10
    // testCase(1,pointInShape(tp, ts),true);
    // testCase(2,distance(tp,ts),2.8284271247461903);
    // testCase(3,determineCase({a:{in:true},b:{in:true},c:{in:true},d:{in:true}}),15);
    // testCase(4,midpoint({x:0,y:0},{x:0,y:2}).y,1);
}
mainJS();
