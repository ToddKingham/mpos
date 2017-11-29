var UTILS = new (function(){      
    this.htmlArray = function(obj){
        var result = [];
        for(var x in obj){
            if(typeof obj[x] === 'object'){
                result.push(obj[x]);    
            }   
        }
        return result;
    };

    this.dollarFormat = function(n){
        return '$'+parseFloat(n).toFixed(2);
    };

    this.listen = function(event,query,cb,parent){
        var parent = parent || document;
        this.htmlArray(parent.querySelectorAll(query)).map(function(el){
            el.addEventListener(event, function(e){
                e.preventDefault();
                cb.apply(this);
            });
        });
    };
    
    this.parseBoolean = function(s){
      return (!!parseFloat(s) || /^(true|yes)$/ig.test(s) );
    };

})();