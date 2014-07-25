function hotspotConstructor(hotspotNode)
{
        
        var newHotspot = {};
        newHotspot.link = hotspotNode.attr("link"); 
        newHotspot.label = hotspotNode.attr("label"); 
        newHotspot.px = hotspotNode.attr("x"); 
        newHotspot.py = hotspotNode.attr("y"); 
        newHotspot.pz = hotspotNode.attr("z"); 
        
        return newHotspot;   
}

function getHotspotSphericalCoords (hx, hy, hz) {
        
  //      $('#message').append("getHotspotSphericalCoords started: "+hx+' '+hy+' '+hz+'<br>');   
                
        // get camera angles
        var _dx = sightBoard.currentCamera.tx - sightBoard.currentCamera.px;
        var _dy = sightBoard.currentCamera.ty - sightBoard.currentCamera.py;
        var _dz = sightBoard.currentCamera.tz - sightBoard.currentCamera.pz;
        
        var _dxy = Math.sqrt(_dx*_dx + _dy*_dy);  
        
        if (_dy == 0) {
                var _camRotateZ = 0;
        } else if (_dy > 0) {
                var _camRotateZ = Math.atan(_dx/_dy);
        } else {
                var _camRotateZ = Math.PI + Math.atan(_dx/_dy);
        }
        
        if (_dz == 0) {
                var _camRotateX = 0;
        } else {
                var _camRotateX = Math.atan(_dxy/_dz);
        }
        
        // get hostspot angles
        var _dx = hx - sightBoard.currentCamera.px;
        var _dy = hy - sightBoard.currentCamera.py;
        var _dz = hz - sightBoard.currentCamera.pz;
        
        var _dxy = Math.sqrt(_dx*_dx + _dy*_dy);  

        if (_dy == 0) {
                var _hotspotRotateZ = 0;
        } else if (_dy > 0) {
                var _hotspotRotateZ = Math.atan(_dx/_dy);
        } else {
                var _hotspotRotateZ = Math.PI + Math.atan(_dx/_dy);
        }
        
        if (_dz == 0) {
                var _hotspotRotateX = 0;
        } else {
                var _hotspotRotateX = Math.atan(_dz/_dxy);
        }
       
        var _atv = -(_hotspotRotateX-_camRotateX) / Math.PI * 180;
        var _ath = (_hotspotRotateZ-_camRotateZ) / Math.PI * 180;    
         
        return {ath: _ath, atv: _atv};
        
}



function drawHotspots () {

        $.each(sightBoard.currentCamera.hotspots, function (index, hotspot) {
                
                var targetCamera = getCameraByID(hotspot.link);
                
                var label = '';
                var px = 0;
                var py = 0;
                var pz = 0;
                
                if ((hotspot.px == undefined) || (hotspot.py == undefined)) {
                        px = targetCamera.px;        
                        py = targetCamera.py;
                        pz = targetCamera.pz;
                } else {
                        px = hotspot.px;        
                        py = hotspot.py;
                        pz = hotspot.pz;
                }
                
                if (hotspot.label == undefined) {
                        label = getCameraName(targetCamera.id)
                } else {
                        label = hotspot.label;
                }

                // check if hotspot is in front of camera (not behind)
                var sphericalCoords = getHotspotSphericalCoords (px, py, pz);  

                if ((sphericalCoords.ath > -90) && (sphericalCoords.ath < 90))
                {
                        var screenPos = getScreenPos(sightBoard.currentCamera, px, py, pz)
                        var hotspotX = Math.round( -screenPos[0] + (getScreen3DWidth()/2));          
                        var hotspotY = Math.round(screenPos[1] + (getScreen3DHeight()/2));       
                        var buttonContent = getButton3D (hotspotX, hotspotY, label, targetCamera.id);
     
                        $('#buttons').append(buttonContent);            
                        
                }               
        });    
}