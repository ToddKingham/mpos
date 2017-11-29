var VIEW = new (function(){
    // browser back button stuff
    window.onhashchange = function() {
        if (params.innerDocClick) {
            params.innerDocClick = false;
        } else {
            var v = document.location.href.split('#')[1];
            if(v){
                this.changeView(v);
            }
        }
    }.bind(this);

    document.onmouseover = function() { //User's mouse is inside the page.
        params.innerDocClick = true;
    }.bind(this);

    document.onmouseleave = function() { //User's mouse has left the page.
        params.innerDocClick = false;
    }.bind(this);

    var params = {
        innerDocClick: false,
        currentView: "",
        viewClass: "page",
        viewDelegates: {}
    };

    this.setViewDelegate = function(v, cb, args){
        params.viewDelegates[v] = cb;

        if(['_global',params.currentView].indexOf(v) !== -1){
            cb.apply({view:params.currentView}, args);
        }
    };

    this.changeView = function (v, args){
        var t = document.getElementById(v);
        
        if(t !== null){
            var pages = document.getElementsByClassName(params.viewClass);
            for(var x in pages){
                if(typeof pages[x] === 'object'){
                    pages[x].style.display = (pages[x] === t) ? 'block' : 'none';
                }   
            }
        }

        var veiwObject = {view:v};
        if(typeof params.viewDelegates["_global"]!=='undefined'){
            params.viewDelegates["_global"].apply(veiwObject, args);
        }
        if(typeof params.viewDelegates[v]!=='undefined'){
            params.viewDelegates[v].apply(veiwObject, args);
        }

        document.location.href="#"+v;
        params.currentView = v;
    };

    this.init  = function(cls, v){
        params.viewClass = cls || 'page';
        var startingView = (document.getElementById(v) || document.getElementsByClassName(params.viewClass)[0]).id;
        this.changeView(startingView);
    };

})();