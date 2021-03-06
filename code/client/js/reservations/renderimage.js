$(function()
{
  renderImage('/images/eb2_csc_1.jpg');
});

var url, bounds, w, h, map;

var renderImage = function(image)
{
    if(!map)
    {
      map = L.map('image-map', {
      minZoom: 1,
      maxZoom: 4,
      center: [0, 0],
      zoom: 1,
      crs: L.CRS.Simple
    });

    }

    // dimensions of the image
    w = 1650;
    h = 1450;
    url = image;
   
    // calculate the edges of the image, in coordinate space
    var southWest = map.unproject([0, h], map.getMaxZoom()-1);
    var northEast = map.unproject([w, 0], map.getMaxZoom()-1);
    var bounds = new L.LatLngBounds(southWest, northEast);
    
    L.imageOverlay(url, bounds).removeFrom(map);

    // add the image overlay, 
    // so that it covers the entire map
    L.imageOverlay(url, bounds).addTo(map);
    // tell leaflet that the map is exactly as big as the image
    map.setMaxBounds(bounds);
}  