function updateBreadCrumb() 
{

        $('#breadcrumb').empty(); 
        
        cameraPath = getCameraPathUp (sightBoard.currentCamera);

        // update the breadcrumb list of the sightBoard object
        sightBoard.breadcrumb = new Array();
        for (i in cameraPath) { 
                cameraID = cameraPath[i].id;
                if (isCamera(cameraID)) {
                        tokenID = sightBoard.cameras[cameraID].token;
                        sightBoard.breadcrumb.push(tokenID);
                }
        }
        
        // update the breadcrumb
        for (i in cameraPath) {
                
                cameraID = cameraPath[i].id;
                
                if (isCamera(cameraID)) { 
                
                        tokenID = sightBoard.cameras[cameraID].token;
                        tokenCameraID = sightBoard.tokens[tokenID].camera;

                        var entry = '';
                          
                        if (tokenCameraID == cameraID) 
                        {
                                var label = sightBoard.tokens[tokenID].name;
                                var action = 'flyToCamera('+cameraID+');';
                        } 
                        else 
                        { 
                                var label = sightBoard.cameras[cameraID].menuname;
                                var action = 'flyToCamera('+cameraID+');';  
                        }
                            
                        var itemClass = "breadcrumb";
                        if (cameraID == sightBoard.currentCamera.id) {
                                itemClass = "breadcrumb breadcrumbselected";
                        }
                            
                        var nextItem = '';
                        
                        if (label != '')
                        {
                                nextItem = '<a href="#" class="'+itemClass+'" onclick="'+action+'" id="breadcrumb'+i+'">';
                                nextItem += '<img src="ui/icon_breadcrumb.png">';
                                nextItem += label;
                                nextItem += '</a>';
                                
                                $('#breadcrumb').prepend(nextItem);
                        }
                                 
                }
                 
        }
        
        var pos = $('.breadcrumb:last').position();
 
        while (pos.top > 0) {
                $('.breadcrumb:first').remove();
                pos = $('.breadcrumb:last').position();  
        }
 }