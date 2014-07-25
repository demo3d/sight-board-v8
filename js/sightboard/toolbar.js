function initToolbar() {
        
        $('#toolbar').empty();  
        $('#toolbar').show(); 
        var toolbarTools = '';
        toolbarTools += getHomeTool();                                                                     
        toolbarTools += getSettingsTool();   
        $('#toolbar').append(toolbarTools); 
        
        $('#settingswindow').hide(); 
        
        
}

function getHomeTool() {
        return '<a href="#" id="home" onclick="goHome();"><img src="ui/icon_home.png"></a>';
}

function getSettingsTool()
{
        return '<a href="#" id="settings" onClick="toggleSettingsWindow();"><img src="ui/icon_settings.png"></a>';

}

function goHome() {
        $('#bookmarks').hide(400);     
        flyToCamera(sightBoard.defaultCamera);
}

function toggleSettingsWindow()
{
        if ($('#settingswindow').is(':visible'))
        {
                $('#settingswindow').hide(400);       
        }
        else
        {
                initSettingsWindow();  
                $('#settingswindow').show(400);  
        }
}


function initSettingsWindow() {

        $('#settingswindow').empty();
        
        var settingsTools = '';
          
        // video toggle
        if (sightBoard.showVideos == false)
        {
                settingsTools += '<a href="#" id="videotoggle" class="settings off" onClick="setShowVideos(1);"><img src="ui/icon_unchecked.png">Videos anzeigen</a>';
        }
        else
        {
                settingsTools += '<a href="#" id="videotoggle" class="settings" onClick="setShowVideos(0);"><img src="ui/icon_checked.png">Videos anzeigen</a>';
        }

        // tools toggle
        if ($('#tools').is(':visible'))
        {
                settingsTools += '<a href="#" id="hidetools" class="settings" onClick="hideTools();"><img src="ui/icon_checked.png">Tools &amp; Schaltfl&auml;chen</a>'; 
        }
        else
        {
                settingsTools += '<a href="#" id="showtools" class="settings off" onClick="showTools();"><img src="ui/icon_unchecked.png">Tools &amp; Schaltfl&auml;chen</a>'; 
        }
        
        
        // pano start toggle
        if (sightBoard.panoStart == false)
        {
                settingsTools += '<a href="#" id="panostarton" class="settings off" onClick="setPanoStart(true);"><img src="ui/icon_unchecked.png">Panoramen automatisch starten</a>'; 
        }
        else
        {
                settingsTools += '<a href="#" id="panostartoff" class="settings" onClick="setPanoStart(false);"><img src="ui/icon_checked.png">Panoramen automatisch starten</a>'; 
        }
        
        
        settingsTools += '<a href="#" id="settingsclose" class="settings" onClick="toggleSettingsWindow();"><img src="ui/icon_closemenu.png">Men&uuml; schlie&szlig;en</a>';
        
        
        $('#settingswindow').append(settingsTools);  
}


function setShowVideos(value) 
{
        toggleSettingsWindow();
        if (value == 1) { 
                sightBoard.showVideos = true;
        }
        else {
                sightBoard.showVideos = false;  
        }
        
}

function hideTools() {
           
        $('#tools').fadeOut(400);
        $('#buttons').fadeOut(400); 
        if (null != getPanoViewer()) {
                getPanoViewer().call("set(hotspot.visible,false);");     
        }
        toggleSettingsWindow(); 
        
}

function showTools() {
        
           
        $('#tools').fadeIn(400);
        $('#buttons').fadeIn(400);
        if (null != getPanoViewer()) { 
                getPanoViewer().call("set(hotspot.visible,true);");   
        }
        toggleSettingsWindow(); 
        
}

function setPanoStart(_value)
{
        sightBoard.panoStart = _value;  
        toggleSettingsWindow();   
}