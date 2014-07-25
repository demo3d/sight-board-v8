function nextVideo() 
{
 
        $('#pano').hide(); 
        $('#presentationcontrol').hide();
        $('#navigationtools').hide(); 
        
        $('#videocontrol').show();    
        $('#versioncontrol').hide();  
        $('#buttons').empty(); 
        $('#videoquality').hide(); 
          
        if (sightBoard.videoQueue.length > 0) 
        {
                nextCamera = sightBoard.videoQueue.shift(); 
                
                if (nextCamera.id != sightBoard.currentCamera.id) 
                {
                        if (sightBoard.showVideos == true)
                        {
                                prepareVideo(sightBoard.currentCamera, nextCamera);        
                        }
                } 
                else 
                {
                        nextVideo();
                }
        }
        else
        {
                loadCamera();
        }
}

function prepareVideo(startCam, endCam) {
        
        var cameraFileName = 'model1280/model-'+endCam.id+'.jpg'; 
        
        $('#cameraback').empty();
        $('#cameraback').hide(); 
        $('#cameraback').append('<img src="'+cameraFileName+'">'); 
        
        
        $('#cameraback').imagesLoaded(function( $images, $proper, $broken ){
                $('#cameraback').show();
                loadVideo (startCam, endCam);
        });
}

function loadVideo(startCam, endCam) {

        var videoFileName = 'video1280/video1280-'+startCam.id+'-'+endCam.id;
                 
        $('#message').html(videoFileName);
        
        $('#video').empty();                                                                                                                                                                                             
        $('#video').append('<video id="sb_video" class="video-js vjs-default-skin" width="'+getScreen3DWidth()+'" height="'+getScreen3DHeight()+'" preload="auto"><source src="'+videoFileName+'.mp4" type="video/mp4"></source><source src="'+videoFileName+'.ogg" type="video/ogg"></source></video>');
        
        //
        
        sightBoard.currentCamera = endCam;    
        
        var videoPlayer = videojs('sb_video');
        
        videoPlayer.ready(function(){ 

                videojs("sb_video").on("playing", function()         
                {                      
                        $('#camera').hide();   
                });   
                 
                videojs("sb_video").on("ended", function()
                {
                         videoEnded();
                });
                
                videojs("sb_video").currentTime(0).play();  

        });          
}

function videoEnded() 
{
        $('#camera').html($('#cameraback').html()); 
        $('#camera').show(); 

        // destroy the player  
        videojs("sb_video").dispose();
        $('#message').empty();  
                                      
        nextVideo();
}

function skipVideo() 
{
        while (nextCamera = sightBoard.videoQueue.shift()) 
        {
                sightBoard.currentCamera = nextCamera; 
        }
        videoEnded();
        
}