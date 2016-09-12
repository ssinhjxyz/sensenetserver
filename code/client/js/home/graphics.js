$(function()
{
var canvas = document.getElementById('Canvas');
console.log(canvas);
var context = canvas.getContext("2d");

// Map sprite
var mapSprite = new Image();
mapSprite.src = "images/eb2west1.jpg";

var Marker = function () {
    this.Sprite = new Image();
    this.Sprite.src = "images/redSquare.png"
    this.Width = 32;
    this.Height = 32;
    this.XPos = 0;
    this.YPos = 0;
}

var Markers = new Array();

var locations = [{XPos:1426, YPos:750}];

var initializeMarkers = function()
{
    var numLocations = locations.length;
    for(var i =0; i < numLocations; i++)
    {
        var marker = new Marker();
        marker.XPos = locations[i].XPos;
        marker.YPos = locations[i].YPos;
        Markers.push(marker);
    }
}

var mouseClicked = function (mouse) {
    // Get corrent mouse coords
    var rect = canvas.getBoundingClientRect();
    var mouseXPos = (mouse.x - rect.left);
    var mouseYPos = (mouse.y - rect.top);
    var nearestMarker = getNearestMarker(mouseXPos, mouseYPos, displayWindow); 
    if(nearestMarker != null)
    {
        displayWindow(nearestMarker);
    }
}


var mouseMove = function (mouse) {
    // Get corrent mouse coords
    //alert("moving");
    var rect = canvas.getBoundingClientRect();
    var mouseXPos = (mouse.x - rect.left);
    var mouseYPos = (mouse.y - rect.top);
    var nearestMarker = getNearestMarker(mouseXPos, mouseYPos); 
    if(nearestMarker != null)
    {
        //alert("mouse over");
    }
}


var getNearestMarker = function(mouseXPos, mouseYPos)
{
    var nearestMarker = null;
    var numMarkers = Markers.length;
    for(var i = 0; i < numMarkers; i++)
    {
        var marker = Markers[i]
        if(mouseYPos > marker.YPos && mouseYPos < marker.YPos + marker.Width)
        {
            if(mouseXPos > marker.XPos && mouseYPos < marker.XPos + marker.Width)
            {
                nearestMarker = marker[i];
                break;
            }
        }
    }
    return nearestMarker;
}

var displayWindow = function(mouseXPos, mouseYPos)
{
    $('#bbbInfoWindow').modal('show')
}

// Add mouse click event listener to canvas
canvas.addEventListener("mousedown", mouseClicked, false);
canvas.addEventListener("mousemove", function(pos){mouseMove(pos);}, false);

var firstLoad = function () {
    context.font = "15px Georgia";
    context.textAlign = "center";
}

firstLoad();

var main = function () {
    draw();
};

var draw = function () {
    // Clear Canvas
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw map
    // Sprite, X location, Y location, Image width, Image height
    // You can leave the image height and width off, if you do it will draw the image at default size
    context.drawImage(mapSprite, 0, 0, 2448, 1584);

    // Draw markers
    for (var i = 0; i < Markers.length; i++) {
        var tempMarker = Markers[i];
        // Draw marker
        context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

        /*// Calculate postion text
        var markerText = "Postion (X:" + tempMarker.XPos + ", Y:" + tempMarker.YPos;

        // Draw a simple box so you can see the position
        var textMeasurements = context.measureText(markerText);
        context.fillStyle = "#666";
        context.globalAlpha = 0.7;
        context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
        context.globalAlpha = 1;

        // Draw position above
        context.fillStyle = "#000";
        context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);*/
    }
};

initializeMarkers();
setInterval(main, (1000 / 60)); // Refresh 60 times a second
});