function sightBoardConstructor(sightboardID, languageName){
       
        this.baseXMLFileName = 'data/sb'+sightboardID+'/public/sb'+sightboardID+'-'+languageName+'-data-basic.xml';
        this.tokenXMLFileName = 'data/sb'+sightboardID+'/public/sb'+sightboardID+'-'+languageName+'-data-list-objects.xml'; 
        
        this.cameras = new Array();
        this.menu = new Array();  
        this.tokens = new Array(); 
        this.tags = new Array();  
        
        this.breadcrumb = new Array();
        
        this.videoQueue = new Array();
        
        this.defaultCamera = undefined;
        this.defaultTag = undefined;
        
        this.currentCamera = undefined;
        this.currentTag = undefined; 
        this.destinationCamera = undefined;
        
        // settings
        this.showVideos = true;
        this.panoStart = true;
        
        // rules
        this.ruleRemoveParentObjects = false;
        this.ruleRemoveIfOutsideBreadcrumb = false;  
        this.ruleRemoveCurrentModelObject = false;  
        this.ruleRemoveIfCenterOutside = false;  
        this.ruleremoveIfDifferentState = false;  
        this.ruleRemoveIfParentOnScreen = false;  
        this.ruleRemoveIfParentNotInBreadcrumb = false;  
        this.ruleRemoveAboveParent = false;  
                       
        // presentation controls
        $('#presentationcontrol').empty(); 
        var presentationControlTools = '';
        presentationControlTools += '<div id="prev"><a href="#" class="tool" onclick="showPrev();"><img id="prev-img" src="ui/icon_prev_big.png"></a></div>';
        presentationControlTools += '<div id="next"><a href="#" class="tool" onclick="showNext();"><img id="next-img" src="ui/icon_next_big.png"></a></div>';
        $('#presentationcontrol').append(presentationControlTools); 
         
         // video controls
        $('#videocontrol').empty(); 
        var videoControlTools = '';
        videoControlTools += '<a href="#" id="skip" class="tool" onclick="skipVideo();"><img id="skip-img" src="ui/icon_skip_big.png"></a>';   
        $('#videocontrol').append(videoControlTools); 

        $('#pano').hide();     
}


function loadSightBoardData()
{
           
        $.get(sightBoard.baseXMLFileName, function(baseXML){   
                
                $(baseXML).find("c").each(function(){
                        var cameraNode = $(this);
                        var id = cameraNode.attr("id");   
                        sightBoard.cameras[id] = new Camera(cameraNode);  
                });

                $(baseXML).find("menu").each(function(){
                        var menuNode = $(this);   
                        sightBoard.menu.push(new menuConstructor(menuNode));  
                }); 
                
                $(baseXML).find("tg").each(function(){
                        var tagNode = $(this);  
                        var id = tagNode.attr("id");  
                        sightBoard.tags[id] = new tagConstructor(tagNode);  
                }); 

                $(baseXML).find("sb").add($(baseXML).filter("sb")).each(function(){                           
                      
                        var sightBoardNode = $(this);
                        
                        var sc = sightBoardNode.attr("sc");  
                        sightBoard.defaultCamera = sc;
                        sightBoard.currentCamera = getCameraByID(sc);  
                        
                        var t = sightBoardNode.attr("t");  
                        sightBoard.defaultTag = t; 
                        sightBoard.currentTag = getTag(t);                       
                });  

                $(baseXML).find("ruleremoveparentobjects").each(function(){     
                        sightBoard.ruleRemoveParentObjects = true;
                });
                
                $(baseXML).find("ruleremoveifoutsidebreadcrumb").each(function(){     
                        sightBoard.ruleRemoveIfOutsideBreadcrumb = true;  
                });
                
                $(baseXML).find("ruleremovecurrentmodelobject").each(function(){     
                        sightBoard.ruleRemoveCurrentModelObject = true;  
                });
                
                $(baseXML).find("ruleremoveifcenteroutside").each(function(){     
                        sightBoard.ruleRemoveIfCenterOutside = true;  
                });
                
                $(baseXML).find("ruleremoveifdifferentstate").each(function(){     
                        sightBoard.ruleremoveIfDifferentState = true;  
                });
                
                $(baseXML).find("ruleremoveifparentonscreen").each(function(){     
                        sightBoard.ruleRemoveIfParentOnScreen = true;  
                });
    
                $(baseXML).find("ruleremoveifparentnotinbreadcrumb").each(function(){     
                        sightBoard.ruleRemoveIfParentNotInBreadcrumb = true;  
                });
                
                $(baseXML).find("ruleremoveaboveparent").each(function(){   
                        sightBoard.ruleRemoveAboveParent = true;  
                }); 
                

                $.get(sightBoard.tokenXMLFileName, function(tokenXML){  
                        $(tokenXML).find("o").each(function(){
                                var tokenNode = $(this);
                                var tokenID = tokenNode.attr("id");                             
                                sightBoard.tokens[tokenID] = new tokenConstructor(tokenNode);  
                                
                                $(tokenNode).find("tag").each(function(){   
                                       
                                        var tokenTagNode = $(this);
                                        var tagID = tokenTagNode.attr("id"); 
                                        
                                        if (isTag(tagID)) {   
                                                addTokenToTag(tokenID, tagID); 
                                        }
                                });
                        });
                        
                        startSightBoard();
                });   
        
        });
}

function startSightBoard() {

        var panoViewer = createPanoViewer();   
        
        initToolbar();
        getMenuBookmarkList();    
        loadCamera(sightBoard.currentCamera.id);
        
}

function sortMenu() {
        sightBoard.menu.sort(function (a, b) {
                if (parseInt(a.sortorder) > parseInt(b.sortorder)) {
                        return 1;
                } else {
                        return -1;
                }
        }); 
}

function getScreen3DWidth() {
        return $('#screen').width();
}

function getScreen3DHeight() {
        return $('#screen').height();
}

function leadingZeros (value) {
        var s = "0000" + value;
        return s.substr(s.length-4);
}