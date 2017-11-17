var mPOS = {};
(function(){

    //localStorage.clear();

    var private = {
        createProtocolString: function(action,obj){
            var queryString = [];
            for(var x in obj){
                if(typeof obj[x] === 'object'){
                    var subQueryString = {};
                    for (var y in obj[x]) {
                        subQueryString[y] = obj[x][y];
                    }
                    queryString.push(x+'='+JSON.stringify(subQueryString));
                } else {
                    queryString.push(x+'='+obj[x]);
                }
            }

            queryString = encodeURI(queryString.join('&')).trim();

            return action.toLowerCase()+'://?'+queryString;
        }
    };

    var eventBus = {
        // CONNECTION STATE
        LINEA_CONNECTED: function(value){},
        LINEA_DISCONNECTED: function(value){},
        
        // CONFIGURATION 
        LINEA_STORE_DEVICE_CONFIG_SUCCESS: function(value){},
        LINEA_STORE_DEVICE_CONFIG_FAILURE: function(value){},
        
        // CREDENTIALS CONFIG
        LINEA_STORE_EVENT_CREDENTIALS_SUCCESS: function(value){},
        LINEA_STORE_EVENT_CREDENTIALS_FAILURE: function(value){},
        
        // PROVIDER CONFIG
        LINEA_PROVIDER_CONFIG_SUCCESS: function(value){},
        LINEA_PROVIDER_CONFIG_FAILURE: function(value){},
        
        // CASHED TRANSACTIONS
        LINEA_CACHED_TRANSACTIONS: function(value){},
    
        // BATTERY ALERT
        LINEA_BATTERY_LEVEL: function(value){}
    };

    var callbacks = {
        onTransactionComplete: function(resp){ console.log(resp); },
        onClearedTransaction: function(resp){ console.log(resp); },
        onEvent: function(event, data){
            if(typeof eventBus[event] !== 'undefined'){
                console.log(eventBus[event]);
                eventBus[event](data);
            }
        }
    };

    this.send = function(action, obj){
        var fn;
        if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true:false){
            this.send = function(a,o){location.href=private.createProtocolString(a,o);};
        } else {
            this.send = function(a,o){console.log(o);};
        }
        this.send(action,obj);
    };

    this.setCallback = function(name, fn){
        if(typeof callbacks[name]){
            callbacks[name] = fn;
            window[name] = fn;

        }  
    };
    this.getCallback = function(name){
        return callbacks[name];
    };
    this.setEvents = function(events){
        for(var event in events){
            if(typeof eventBus[event]){ console.log()
                eventBus[event] = events[event];
            }
        }
    };
}).apply(mPOS);

/*******  mPOS CALLBACK DELEGATES!!!! *******/
window.onTransactionComplete = mPOS.getCallback('onTransactionComplete');
window.onEvent = mPOS.getCallback('onEvent');
window.onClearedTransaction = mPOS.getCallback('onClearedTransaction');

onEvent("LINEA_DEVICE_STATE",{
    "sled": "connected",
    "bluetooth": "disconnected",
    "whateverelse": "connected",
    "battery": "50"
});