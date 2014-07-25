function showInfo(_tokenID)
{
        var infoURL = 'data/sb'+sightboardID+'/public/sb'+sightboardID+'-'+languageName+'-info-'+_tokenID+'.html';   
        $('#infowindow').show();
        $('#infocontent').load(infoURL);
}