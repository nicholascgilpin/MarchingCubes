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
    console.log(input);
  }
}


function createGrid(width, height, resolution) {
    var squareWidth = width / resolution;
    var squareHeight = height / resolution;
    var sc =0;
    for (var i = 0; i < resolution; i +=2) {
        for (var j = 0; j < resolution; j +=2) {
            var x = i*squareWidth;
            var y = j*squareHeight;
            a = {x:x,y:y};
            b = {x:x,y:y+squareHeight};
            c = {x:x+squareWidth,y:y};
            d = {x:x+squareWidth,y:y+squareHeight};
            gridPoints.push(a);
            gridPoints.push(b);
            gridPoints.push(c);
            gridPoints.push(d);
            // Keep track of this square
            cells.push({a:a,b:b,c:c,d:d});
            // Draw with colors to illistrate the presence of squares
            ctx.fillStyle = rgb(50,50,255);
            ctx.fillRect(a.x, a.y, 5, 5);
            ctx.fillStyle = rgb(0,150,150);
            ctx.fillRect(b.x, b.y, 5, 5);
            ctx.fillStyle = rgb(25,25,200);
            ctx.fillRect(c.x, c.y, 5, 5);
            ctx.fillStyle = rgb(100,25,150);
            ctx.fillRect(d.x, d.y, 5, 5);
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

// Group grid into grid squares/rectangles
// function rectVertexGrouping(grid){
//   var squares = [];
//   for (var i = 0; i < grid.length; i++) {
//     var a = grid[i];
//   }
// }

// Determines if a point with within a closed shape
function pointInShape(p, s) {
  if (distance(p,s) <= radius){
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
        ctx.fillRect(verticies[j].x, verticies[j].y, 5, 5);
      }
    }
  }
}
/*
Approximates drawn volumetric data with a polygon around shadded parts
  Assumes: No holes inside drawn shape.
*/
function marchingCubes() {
    createGrid(canvas.width, canvas.height, 20);

    markPointsInShape(gridPoints,geometryLayer);
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
    //Test cases
    console.log("Main ran");
    var tp = {x:2,y:2};
    var ts = {x:0,y:0};
    testCase(0,radius,10); // Expected results assume radius = 10
    testCase(1,pointInShape(tp, ts),true);
    testCase(2,distance(tp,ts),2.8284271247461903);
}
mainJS();
