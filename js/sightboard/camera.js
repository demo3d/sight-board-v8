function Camera(xmlData) {

        this.xmlData = xmlData;
        
        this.id = xmlData.attr("id");
        this.parent = xmlData.attr("par");
        this.next = xmlData.attr("next");  
        this.prev = xmlData.attr("prev"); 
        
        this.pano = xmlData.attr("pano"); 
        this.appr = xmlData.attr("appr");  
        this.mf = xmlData.attr("mf");  
        
        this.token = xmlData.attr("o"); 
        this.menuname = xmlData.attr("mn"); 
        this.type = xmlData.attr("t"); 
        
        this.px = xmlData.attr("px");  
        this.py = xmlData.attr("py");  
        this.pz = xmlData.attr("pz");  
        
        this.tx = xmlData.attr("tx");  
        this.ty = xmlData.attr("ty");  
        this.tz = xmlData.attr("tz");  
        
        this.aperture = 0.036;
        this.focus = 0.02025;  

        this.hotspots = new Array();
        
   /*     $(xmlData).find("hs").each(function(){
                var hotspotNode = $(this); 
                this.hotspots.push(new hotspotConstructor(hotspotNode)); 
        });  */
}


Camera.prototype.getName = function () 
{
        var cameraName = this.menuname;
        
        if (cameraName == '') {
                cameraName = sightBoard.tokens[this.token].name;
        }

        return cameraName;
};


Camera.prototype.getTilt = function () 
{

        var xDiff = this.tx - this.px;
        var yDiff = this.ty - this.py;
        var zDiff = this.tz - this.pz;  
        
        var horDistance = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
        
        if (horDistance > 0) 
        {
                var tiltAngle = (360 * Math.atan(zDiff/horDistance) / (2*Math.PI));        
        } else 
        {
                var tiltAngle = 0;
        }
        
        return tiltAngle;
        
}
        
function getCameraByID(id) {
        return sightBoard.cameras[id];  
};

function isCamera(id) {
        return (typeof sightBoard.cameras[id] !== 'undefined');  
};



function getCameraPathUp(camera) {
        
        var currentCameraID = camera.id;
        var cameraPath = new Array(getCameraByID(currentCameraID));  
        
        while (isCamera(getCameraByID(currentCameraID).parent)) {
                var parentCameraID = getCameraByID(currentCameraID).parent;
                currentCameraID = parentCameraID;
                cameraPath.push(getCameraByID(currentCameraID));
        }

        return cameraPath;
        
}

function combineCameraPath(firstPath, secondPath)
{

        firstPathIndex = firstPath.length - 1;
        secondPathIndex = 0;
        
        $.each(firstPath, function (firstIndex, firstValue) {
                $.each(secondPath, function (secondIndex, secondValue) {
                        if (firstValue == secondValue) {
                                if (firstIndex < firstPathIndex) {
                                        firstPathIndex = firstIndex;
                                }
                                if (secondIndex > secondPathIndex) {
                                        secondPathIndex = secondIndex;
                                }
                        }
                        
                });
        });
        
        newFirstPath = firstPath.slice(0,firstPathIndex);
        newSecondPath = secondPath.slice(secondPathIndex);

        return newFirstPath.concat(newSecondPath);  
              
}



function flyToCamera(cameraID) {

        if ($('#pano').is(":visible"))
        {
                panoOut(cameraID);
        }
        else
        {
                $('#pano').empty(); 
                $('#buttons').empty();   
                
                $('#cameraloading').show();     
                
                if ((sightBoard.showVideos == true) && (sightBoard.currentCamera.appr == 1) && (getCameraByID(cameraID).appr == 1))
                {
                        var cameraPathCurrent = getCameraPathUp(sightBoard.currentCamera);
                        var cameraPathDestination = getCameraPathUp(getCameraByID(cameraID)).reverse();
        
                        sightBoard.videoQueue = combineCameraPath(cameraPathCurrent, cameraPathDestination);
                        
                        nextVideo();
                }
                else
                {
                        $('#cameraback').html($('#camera').html());   
                        sightBoard.currentCamera = getCameraByID(cameraID);
                        
                        loadCamera();
                }
        }    
}

function showPrev() {
        flyToCamera(sightBoard.currentCamera.prev);
}

function showNext() {
        flyToCamera(sightBoard.currentCamera.next);
}


function loadCamera() {
        
        var cameraFileName = 'model1280/model-'+sightBoard.currentCamera.id+'.jpg'; 

        $('#camera').empty();
        $('#camera').hide(); 
        $('#camera').append('<img src="'+cameraFileName+'">'); 
        
        
        $('#camera').imagesLoaded(function( $images, $proper, $broken ){
                initCamera();
        });
}

function initCamera() {  
        
        updateBreadCrumb();  
        getMenuBookmarkList();
        initNavigationTools();
         
        $('#cameraloading').hide();  
        $('#camera').fadeIn(800); 
        
        $('#videocontrol').hide(); 
        $('#bookmarktoggle').show(); 
        $('#breadcrumb').show();   
        $('#presentationcontrol').show();  
        $('#pano').hide();  
        $('#videoquality').hide();  
        
        $('#buttons').hide();  
        $('#buttons').empty(); 
        
        if (sightBoard.currentCamera.prev>0) {
                $('#prev').show(); 
        } else {
                $('#prev').hide();
        }
        
        if (sightBoard.currentCamera.next>0) {
                $('#next').show();
        } else {
                $('#next').hide();
        }
        
        
        sightBoard.currentCamera.transformationMatrix = getTransformationMatrix(sightBoard.currentCamera);
        
   
        // draw buttons
        draw3DButtons();  
        
        // draw hotspots
        drawHotspots();
        
        if ((sightBoard.currentCamera.pano==1) && (sightBoard.panoStart == true)) {
                loadPano();
        }      

        $('#buttons').show();
        
        
        
        // version control
        $('#versioncontrol').hide(); 

        if (sightBoard.currentCamera.type != '') {
                
                var versionCams = new Array();
                currentToken = sightBoard.currentCamera.token;
                for (i in sightBoard.cameras) {
                        if ((sightBoard.cameras[i].token == currentToken) && (sightBoard.cameras[i].type != '') && (sightBoard.cameras[i].type != 'flight') && (sightBoard.cameras[i].type != 'walk')) { 
                                versionCams.push(sightBoard.cameras[i].id);   
                        }
                }
                
                
                if (versionCams.length > 1) {
                        
                        $('#versioncontrol').empty();
                           
                        $('#versioncontrol').show(); 
                        
                        var versionControlContent = '';
                        versionCams.sort();
                        for (i in versionCams) {
                                
                                cameraID = versionCams[i];
                                
                                if (isCamera(cameraID)) {
                                        icon = sightBoard.cameras[cameraID].type+'_big'
                                        versionControlContent += '<a href="#" id="camera-'+cameraID+'" class="tool" style="margin:8px;" onclick="flyToCamera('+cameraID+');"><img src="ui/icon_'+icon+'.png">'+sightBoard.cameras[cameraID].menuname+'</a>'; 
                                }
                        }
                        
                        $('#versioncontrol').append(versionControlContent); 
                }
                
        }

}
  




function getButton3D (posLeft, posTop, label, cameraID) {

        var buttonContent = '';
        
        posLeft -= 16;
        posTop -= 16;
        
        buttonContent += '<div class="button" style="position:absolute; left:'+posLeft+'px; top:'+posTop+'px;">';
        buttonContent += '<a href="#" class="button" onclick="flyToCamera('+cameraID+');">';
        buttonContent += '<img id="button-'+cameraID+'-img" class="button" src="ui/hotspot.png">';
        buttonContent += label;
        buttonContent += '</a>';
        buttonContent += '</div>';  
        
        return buttonContent;
}

function getScreenPos(_camera, _x, _y, _z) {

        var _vectorHom = new matrixConstructor(1,4);
        
        _vectorHom.matrix = new Array(
                new Array(_x, _y, _z, 1)
        );     
         
        _vectorHom.matrixMultiplication(_camera.transformationMatrix);

        var _vectorProjectedX = _vectorHom.matrix[0][0] / _vectorHom.matrix[0][3];
        var _vectorProjectedY = _vectorHom.matrix[0][1] / _vectorHom.matrix[0][3];
   
        var _screenPosX = - _vectorProjectedX / _camera.aperture * getScreen3DWidth();
        var _screenPosY = _vectorProjectedY / _camera.aperture * getScreen3DWidth();

        return new Array(_screenPosX, _screenPosY);
        
}


function draw3DButtons() {

        // get all tokens marked with the current tag
        var tokens = new Array();
        
        $.each(sightBoard.currentTag.tokens, function (_index, _tokenID) {  
                tokens.push(sightBoard.tokens[_tokenID]);    
        }); 

        
        // apply the rules for displaying objects on screen
        
        // hide objects that are in the breadcrumb (parents) 
        // rule "removeParentObjects"
        if (sightBoard.ruleRemoveParentObjects == true) {     
                $.each(tokens, function(_index, _token) {
                        if (_token != undefined) { 
                                if(sightBoard.breadcrumb.inArray(_token.id)){
                                        tokens[_index] = undefined; 
                                }
                        }
                });    
        }
        
        
        // hide current object
        // rule "ruleRemoveCurrentModelObject"
        if (sightBoard.ruleRemoveCurrentModelObject == true) {                
                $.each(tokens, function(_index, _token) {  
                        if (_token != undefined) {                         
                                if(_token.id == sightBoard.currentCamera.token){
                                        tokens[_index] = undefined;
                                }
                        }
                });
        }
        
        
        
        
       
        
        
        // get the 2d position on the screen
        $.each(tokens, function (_index, _token) {  
                if (_token != undefined) { 
                        var _pos = getScreenPos(sightBoard.currentCamera, _token.xPos, _token.yPos, _token.zPos);      
                        _token.xPosScreen = Math.round(_pos[0] + (getScreen3DWidth()/2));
                        _token.yPosScreen = Math.round(_pos[1] + (getScreen3DHeight()/2));     
                }
        });
        
        
        
        // remove objects with center outside of the visible screen 
        // ruleRemoveIfCenterOutside
        if (sightBoard.ruleRemoveIfCenterOutside == true) {  
                $.each(tokens, function (_index, _token) {  
                        if (_token != undefined) {
                                if ((_token.xPosScreen < 0) || (_token.xPosScreen > getScreen3DWidth()) || (_token.yPosScreen < 0) || (_token.yPosScreen > getScreen3DHeight())) {
                                        tokens[_index] = undefined; 
                                }
                        }
                });
        }
        
        
        
        
        
        // TODO : removeIfDifferentState
        
        // hide objects for which the parentobject is visible on the screen
        // removeIfParentOnScreen
        if(sightBoard.ruleRemoveIfParentOnScreen == true) {
        
                // get all visible tokens
                var tokensOnScreen = new Array();
                $.each(tokens, function (_index, _token) {
                        if (_token != undefined) { 
                                tokensOnScreen.push (_token.id);     
                        }
                });
                
                // check if a tokens parent is visible
                $.each(tokens, function (_index, _token) { 
                        if (_token != undefined) { 
                                if (_token.parent != '') {
                                        if(tokensOnScreen.inArray(_token.parent)) { 
                                                tokens[_index] = undefined;  
                                        }            
                                }
                        }
                });  
      
        }
        
        
        // TODO: removeIfParentNotInBreadcrumb
        
        // TODO: removeIfOutsideBreadcrumb
        
        // TODO: removeAboveParent
        
        
            
        
        // output buttons
      //  $('#buttons').empty();
        
        
        $.each(tokens, function(_index, _token){
                if (_token != undefined) {
                
                        var buttonContent = ''; 
                        buttonContent += '<div class="button" style="position:absolute; left:'+_token.xPosScreen+'px; top:'+_token.yPosScreen+'px;">';
                        buttonContent += '<a href="#" class="button" onclick="flyToCamera('+_token.camera+');">';
                        buttonContent += '<img id="button-'+_token.camera+'-img" class="button" src="ui/hotspot.png">';
                        buttonContent += _token.name;
                        buttonContent += '</a>';
                        buttonContent += '</div>'; 
                        
                        $('#buttons').append(buttonContent);    
                }
        });
        
        
        
        // add camera buttons

        $.each(sightBoard.cameras, function(_index, _camera){ 
                if (_camera != undefined) {
                        if (_camera.type == 'flight') {
                                if (_camera.parent == sightBoard.currentCamera.id) {
                                
                                        var _pos = getScreenPos(sightBoard.currentCamera, _camera.px, _camera.py, _camera.pz);   
                                        xPosScreen = Math.round(_pos[0] + (getScreen3DWidth()/2));
                                        yPosScreen = Math.round(_pos[1] + (getScreen3DHeight()/2)); 
                                        
                                        var buttonContent = '';  
                                        
                                        buttonContent += '<div class="button" style="position:absolute; left:'+xPosScreen+'px; top:'+yPosScreen+'px;">';
                                        buttonContent += '<a href="#" onclick="flyToCamera('+_camera.id+');" class="button">'+_camera.menuname+'</a>';
                                        buttonContent += '</div>'; 
                                        
                                        $('#buttons').append(buttonContent);
                                }
                        }  
                }
        });    
        

                        
}
  
  
function initNavigationTools(){
        
        $('#navigationtools').empty(); 
        
        if (getCameraByID(sightBoard.currentCamera.parent) != undefined)
        {
                var parentID = sightBoard.currentCamera.parent;
                var navToolHTML = '<div id="parent"><a href="#" class="tool" onclick="flyToCamera(\''+parentID+'\');"><img id="parent-img" src="ui/icon_up_big.png"></a></div>';
                
                $('#navigationtools').append(navToolHTML);
   
        }
        
        $('#navigationtools').show();
}