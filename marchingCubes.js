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
var context = {}
var canvas = {}
var shape = {}
function createGrid(width,height,canvasIn){
  canvas = canvasIn
  canvas.width = width
  canvas.height = height
  context = canvas.getContext("2d");
}

function drawCircle(x,y,r){
  context.beginPath()
  // x,y,r,startingAngle,FinishAngle
  context.arc(x,y,r,0,2*Math.PI)
  context.stroke()
  var c
  c.x = x
  c.y = y
  c.r = r
  return c
}

// Determines if a point with within a closed shape
function pointInShape(point,shape){
  //TODO
}

//
function marchingCubes(){
  // group grid into cubes
  // which cube vertexes in shape
  // select half way point
  // draw polygonalization
}

function mainJS(canvas){
  createGrid(100,100,canvas)
  shape = drawCircle(50,50,25)
}
