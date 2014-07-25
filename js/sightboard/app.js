$(document).ready(function()
{
        
        // adjust the container according to screen size  
        $(window).resize(function () 
        { 
                var availableWidth = $(window).width();
                var availableHeight = $(window).height();   

                if ((availableWidth / availableHeight) > 16/9) 
                {
                        var contentWidth = availableHeight * 16/9; 
                        var contentHeight = availableHeight;
                }
                else
                {
                        var contentWidth = availableWidth;
                        var contentHeight = availableWidth * 9/16;
                }

                $('#screen').width(contentWidth);
                $('#screen').height(contentHeight); 
                   
        }).resize(); 

        
        // get the stup from loader.xml
        var loaderXMLFileName = 'loader.xml';  
        $.get(loaderXMLFileName, function(loaderXML)
        {   
                sightboardID = $(loaderXML).find("id").text();
                languageName = $(loaderXML).find("language").text();
                
                sightBoard = new sightBoardConstructor(sightboardID, languageName);      
                loadSightBoardData();
        });
        
});