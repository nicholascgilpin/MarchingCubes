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

// Determines if a point with within a closed shape
function pointInShape(point, shape) {
    //TODO
}

//
function marchingCubes() {
    // group grid into cubes
    // which cube vertexes in shape
    // select half way point
    // draw polygonalization
}

// Painting Code //////////////////////////////////////////////////////////////
/* Painting code based on a tutorial by Rishabh
http://codetheory.in/creating-a-paint-application-with-html5-canvas/
*/
var mouse = {
    x: 0,
    y: 0
};
var geometryLayer = [] // Stores geometric information for later manipulation
ctx.lineWidth = 1;
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';

var onPaint = function() {
    geometryLayer.push([mouse.x, mouse.y]);
    ctx.arc(mouse.x, mouse.y, 10, 0, 2 * Math.PI, false);
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

function mainJS(canvas) {
    createGrid(100, 100, canvas)
    shape = drawCircle(50, 50, 25)
}
