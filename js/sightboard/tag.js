function tagConstructor(tagNode) { 
        this.id = tagNode.attr("id");
        this.name = tagNode.attr("name");
        this.tokens = new Array();
        return this;     
}

function getTag(id) {
        return sightBoard.tags[id];  
};

function isTag(_id) {
        return (typeof sightBoard.tags[_id] !== 'undefined');  
}

function addTokenToTag(_tokenID, _tagID) {
        sightBoard.tags[_tagID].tokens.push(_tokenID); 
}