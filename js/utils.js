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

    this.copyToClipboard = function(txt){
            //create an input that we can copy the text into
        var input = document.createElement('input');
            input.value=txt;

            //hide it from view (this function should be so fast it doesn't appear on the screen but we will do this anyway)
            input.style.position="absolute";
            input.style.top="-10px";
            input.style.height="0px";

            //add input to body, select the text, copy it to clipboard, then remove the input element
            document.body.append(input);
            input.select();
            document.execCommand("Copy");
            input.parentNode.removeChild(input);
    };

})();