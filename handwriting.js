const canvasWidth = Math.min(800, document.documentElement.clientWidth - 20);
let canvasHeight = canvasWidth;

let strockColor = "black";
let isMouseDown = false;
let isOn = false;
let lastloc = {x: 0, y: 0};
let lastTimestamp = 0;
let lastLineWidth = 0;



var aColorBtn = document.querySelectorAll(".color_btn")
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


canvas.width = canvasWidth;
canvas.height = canvasHeight;

drawgraph();

document.getElementById("clear_btn").addEventListener("click",function (e) {
  e.preventDefault();
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawgraph();
})

!function(){
  for(var i = 0, len = aColorBtn.length; i< len; i++){

      aColorBtn[i].addEventListener("click", function () {
        for(var m = 0, len = aColorBtn.length; m< len; m++){
          aColorBtn[m].classList.remove("color_btn_selected");
        }
        this.classList.add("color_btn_selected");
        strockColor = this.dataset.color

      })

  }
}();

canvas.addEventListener("mousedown",function (e) {
  e.preventDefault();
  beginStroke({x: e.clientX, y: e.clientY})


})
document.addEventListener("mouseup",function (e) {
  e.preventDefault();
  isOn = isMouseDown = false;;

})
canvas.addEventListener("mouseover",function (e) {
  e.preventDefault();
  isMouseDown = true;
  lastloc = widnowToCanvas(e.clientX,e.clientY)

})
canvas.addEventListener("mouseout",function (e) {
  e.preventDefault();
  isMouseDown = false;

})

canvas.addEventListener("mousemove",function (e) {
  e.preventDefault();
  if(isMouseDown && isOn){
    moveStroke({x: e.clientX, y: e.clientY})
  }

})

canvas.addEventListener("touchstart",function (e) {
  e.preventDefault();
  var touch = e.touches[0];
  beginStroke({x: touch.pageX, y: touch.pageY})


})
canvas.addEventListener("touchend",function (e) {
  e.preventDefault();
 isMouseDown = false;;

})


canvas.addEventListener("touchmove",function (e) {
  e.preventDefault();
  if(isMouseDown){
    var touch = e.touches[0];
    moveStroke({x: touch.pageX, y: touch.pageY})
  }

})

function moveStroke(point) {
  var curloc = widnowToCanvas(point.x, point.y);
  var curTimeStamp = new Date().getTime();
  var s = calcDistance(curloc, lastloc);
  var t = curTimeStamp - lastTimestamp;
  var lineWidth = calcLineWidth(t, s)
  context.strokeStyle = strockColor;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  draw(lastloc.x, lastloc.y, curloc.x, curloc.y)

  lastloc = curloc;
  lastTimestamp = curTimeStamp;
  lastLineWidth = lineWidth;
}

function beginStroke(point) {
  isMouseDown = true;
  isOn = true;
  lastloc = widnowToCanvas(point.x, point.y)
  lastTimestamp = new Date().getTime();
}



let maxLineWidth = 30;
let minLineWidth = 1;
let maxStrokeV = 10;
let minStrokeV = 0.1;

function calcLineWidth(t, s) {
  var v = s/t;
  var resultLineWidth;
  if(v <= minStrokeV){
    resultLineWidth = maxLineWidth;
  }else if(v >= maxStrokeV){
    resultLineWidth = minLineWidth;
  }else{
    resultLineWidth = maxLineWidth - (v - minStrokeV)/(maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth)
  }
  if(lastLineWidth == 0){

    return resultLineWidth;
  }



  return lastLineWidth * 2/3 + resultLineWidth * 1/3;
}

function draw(ox, oy, x, y) {
  context.beginPath();
  context.lineTo(ox, oy);
  context.lineTo(x, y);


  context.stroke()
}

function calcDistance(loc1,loc2) {
  return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
}

function widnowToCanvas(x, y) {
  var bbox = canvas.getBoundingClientRect();
  return {
    x: Math.round(x - bbox.left),
    y: Math.round(y - bbox.top)
  }

}


function drawgraph() {
  context.save();
  context.strokeStyle = "#c41a1a";
  context.lineWidth = 6;
  context.beginPath()
  context.moveTo(3, 3);
  context.lineTo(canvasWidth - 3, 3);
  context.lineTo(canvasWidth - 3, canvasHeight - 3);
  context.lineTo(3, canvasHeight - 3);
  context.closePath()
  context.stroke();

  context.setLineDash([10,4]);
  context.lineWidth = 2;

  context.moveTo(1, 1);
  context.lineTo(canvasWidth - 1, canvasHeight - 1);

  context.moveTo(canvasWidth - 1, 1);
  context.lineTo(1, canvasHeight - 1);

  context.moveTo(canvasWidth/2, 1);
  context.lineTo(canvasWidth/2, canvasHeight - 1);

  context.moveTo(1, canvasHeight/2);
  context.lineTo(canvasWidth - 1, canvasHeight/2);

  context.stroke()
  context.restore();
}


