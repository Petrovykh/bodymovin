function CVImageElement(data, comp,globalData){
    this.animationItem = globalData.renderer.animationItem;
    this.assetData = this.animationItem.getAssetData(data.refId);
    this.path = this.animationItem.getPath();
    this._parent.constructor.call(this,data, comp,globalData);
    this.animationItem.pendingElements += 1;
}
createElement(CVBaseElement, CVImageElement);

CVImageElement.prototype.createElements = function(){
    var self = this;

    var imageLoaded = function(){
        self.animationItem.elementLoaded();
    };
    var imageFailed = function(){
        //console.log('imageFailed');
        self.failed = true;
        self.animationItem.elementLoaded();
    };

    this.img = new Image();
    this.img.addEventListener('load', imageLoaded, false);
    this.img.addEventListener('error', imageFailed, false);
    this.img.src = this.path+this.assetData.p;

    this._parent.createElements.call(this);

};

CVImageElement.prototype.renderFrame = function(parentMatrix){
    if(this.failed){
        return;
    }
    if(this._parent.renderFrame.call(this,parentMatrix)===false){
        return;
    }
    var ctx = this.canvasContext;
    this.globalData.renderer.save();
    var finalMat = this.finalTransform.mat.props;
    this.globalData.renderer.ctxTransform(finalMat);
    this.globalData.renderer.ctxOpacity(this.finalTransform.opacity);
    ctx.drawImage(this.img,0,0);
    this.globalData.renderer.restore(this.data.hasMask);
    if(this.firstFrame){
        this.firstFrame = false;
    }
};

CVImageElement.prototype.destroy = function(){
    this.img = null;
    this.animationItem = null;
    this._parent.destroy.call();
};