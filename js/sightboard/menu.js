String.prototype.repeat = function(times) 
{
        return (new Array(times + 1)).join(this);
} 


function menuConstructor(menuNode) 
{ 
        this.tag = menuNode.attr("tag");
        this.object = menuNode.attr("object");
        this.info = menuNode.attr("info");  
        this.camera = menuNode.attr("camera"); 
        this.name = menuNode.attr("name"); 
        this.type = menuNode.attr("type");   
        this.icon = menuNode.attr("icon");   
        this.sortorder = menuNode.attr("sortorder");   
        this.indent = menuNode.attr("indent");   
        return this;
}

function toggleBookmarks()
{
        if ($('#bookmarks').is(':visible'))
        {
                $('#navigationtools').show();
                $('#bookmarks').hide(400);       
        }
        else
        {
                $('#navigationtools').hide();
                $('#bookmarks').show(400);  
        }
}

function getMenuBookmarkList() 
{
        $('#bookmarktoggle').empty();
        $('#bookmarktoggle').append('<a href="#" class="menu" onclick="toggleBookmarks();"><img src="ui/icon_bookmarks.png">Favoriten</a>');       
        $('#bookmarks').empty();

        sortMenu();

        $(sightBoard.menu).each(function(index,item){

                if (item.type == 'bookmarkList') {
                        
                        var menuLabel = '';
                        var menuIcon = 'blank';
                        var action = ''; 
                        var addClass = '';
                          
                        if (item.camera > 0) {
                                menuLabel = item.name;
                                action = 'menuClicked(\'camera\','+item.camera+');';      
                        }
                        else if (item.object != '') {  
                                cameraID = sightBoard.tokens[item.object].camera;
                                menuLabel = item.name;
                                action = 'menuClicked(\'camera\','+cameraID+');';       
                        }

                        if (item.camera == sightBoard.currentCamera.id)
                        {
                                addClass = 'menuselected';
                        }

                        var menuEntry = getMenuEntry (index, item.indent, menuLabel, item.icon, action, addClass);
                        $('#bookmarks').append(menuEntry);
                }
        });
        
        var closeMenu = '<a href="#" class="menu indent0" id="menuclose" onclick="toggleBookmarks();"><img src="ui/icon_closemenu.png">Men&uuml; schlie&szlig;en</a>';
        $('#bookmarks').append(closeMenu); 
        
        
}

function getMenuEntry(index, indent, label, icon, action, addClass) 
{
        var menuEntry = '';
        menuEntry += '<a href="#" class="';
        menuEntry += 'menu indent'+indent;
        if (addClass != '')
        {
                 menuEntry += ' '+addClass;
        }
        menuEntry += '" id="menu'+index+'" onclick="'+action+'">';
        menuEntry += '<img src="ui/icon_'+icon+'.png">';
        menuEntry += label;
        menuEntry += '</a>';
        
        return menuEntry;
}

function menuClicked(_type,_value)
{
        if (_type == 'camera')
        {
                $('#bookmarks').hide(400); 
                flyToCamera(_value);
        }
}