function getPanoViewer() {
        return document.getElementById("panoviewer");
}

function panoOut(cameraID) {

        getPanoViewer().call("moveto(0,0);");  
        getPanoViewer().call("zoomto(83.27);");  
        getPanoViewer().call("js(continuePanoOut("+cameraID+");)");                   
}

function continuePanoOut(cameraID) {
        $('#pano').hide();
        removepano('panoviewer');
        flyToCamera(cameraID);
}

function panoReady() {
                        
        var cameraID = sightBoard.currentCamera;
        
        if ($('#tools').is(':visible')) 
        {
                getPanoViewer().call("set(hotspot.visible,true);");          
        }
        else
        {
                getPanoViewer().call("set(hotspot.visible,false);");  
        }
        
        
        $.each(sightBoard.currentCamera.hotspots, function (index, hotspot) {
                
                var camera = getCameraByID(hotspot.link);
                
                
                
                var label = '';
                var px = 0;
                var py = 0;
                var pz = 0;
                
                if ((hotspot.px == undefined) || (hotspot.py == undefined)) {
                        px = camera.px;        
                        py = camera.py;
                        pz = camera.pz;
                } else {
                        px = hotspot.px;        
                        py = hotspot.py;
                        pz = hotspot.pz;
                }
                
                if (hotspot.label == undefined) {
                        label = getCameraName(camera.id)
                } else {
                        label = hotspot.label;
                }
                
         //       $('#message').append("hotspotting started: "+hotspot.link+'<br>'); 
                hotspotCoord = getHotspotSphericalCoords (px, py, pz); 
        //        $('#message').append("hotspotting done: "+hotspotCoord.ath+" "+hotspotCoord.atv+'<br>');
                
                ath = hotspotCoord.ath;      
                atv = hotspotCoord.atv;
                
                getPanoViewer().call("addhotspot(camera"+camera.id+");");   
                getPanoViewer().set("hotspot[camera"+camera.id+"].url", "ui/hotspot.png");
                getPanoViewer().set("hotspot[camera"+camera.id+"].ath", ath);
                getPanoViewer().set("hotspot[camera"+camera.id+"].atv", atv);
                getPanoViewer().set("hotspot[camera"+camera.id+"].scale", 1);
                getPanoViewer().set("hotspot[camera"+camera.id+"].zoom", false);
                getPanoViewer().set("hotspot[camera"+camera.id+"].onhover", "showtext('"+label+"', SIGHTBOARD);");
                getPanoViewer().set("hotspot[camera"+camera.id+"].onclick", "js(flyToCamera("+camera.id+"))");
        
                
        });    
}

function loadPano() {

        $('#pano').empty(); 
        $('#pano').show(); 
        
        cameraID = sightBoard.currentCamera.id;
        tiltAngle = sightBoard.currentCamera.getTilt();
        
        embedpano({
                swf: 'js/pano/krpano.swf', 
                xml: 'js/pano/pano.xml',  
                id: 'panoviewer',
                target: 'pano',
                html5: 'auto', 
                wmode: 'transparent',
                vars: {
                        'image.cube.url': 'pano/pano-'+cameraID+'_default_%s.jpg',
                        'image.mobile.cube.url': 'pano/pano-'+cameraID+'_mobile_%s.jpg',    
                        'view.fovtype' : 'HFOV',
                        'view.fov': 83.27,
                        'view.fovmin': 40,
                        'view.fovmax' : 110,
                        'view.hlookat': 0,  
                        'view.vlookat': tiltAngle
                }
        });  
        
}