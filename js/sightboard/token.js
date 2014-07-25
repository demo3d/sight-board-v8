function tokenConstructor(tokenNode) {

        this.id = tokenNode.attr("id");
        this.name = tokenNode.attr("name");
        this.camera = tokenNode.attr("c");  
        this.hasinfo = tokenNode.attr("hi"); 
        
        this.parent = tokenNode.attr("par"); 
        
        this.xPos = tokenNode.attr("x"); 
        this.yPos = tokenNode.attr("y"); 
        this.zPos = tokenNode.attr("z"); 

        return this;
}