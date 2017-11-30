var mPOS = new (function(events){
    var local = {
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
        },

        setEvents: function(events){
            for(var event in events){
                if(typeof eventBus[event]){ console.log()
                    eventBus[event] = events[event];
                }
            }
        }
    };

    var eventBus = {
        LINEA_DEVICE_STATE: function(value){},
        LINEA_STORE_DEVICE_CONFIG: function(value){},
        LINEA_STORE_EVENT_CREDENTIALS: function(value){},
        LINEA_CACHED_TRANSACTIONS: function(value){},
        LINEA_BATTERY_LEVEL: function(value){}
    };

    var callbacks = {
        onTransactionComplete: function(resp){ console.log(resp); },
        onClearedTransaction: function(resp){ console.log(resp); },
        onEvent: function(event, data){
            // var li = document.createElement('LI');
            // li.innerHTML = event +': '+JSON.stringify(data);
            // document.getElementById('stuff').appendChild(li);
            if(typeof eventBus[event] !== 'undefined'){
                eventBus[event](data);
            }
        }
    };

    this.send = function(action, obj){
        var fn;
        if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true:false){
            this.send = function(a,o){location.href=local.createProtocolString(a,o);};
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
    
    local.setEvents(events);
})(EVENTS);

/*******  mPOS CALLBACK DELEGATES!!!! *******/
window.onTransactionComplete = mPOS.getCallback('onTransactionComplete');
window.onClearedTransaction = mPOS.getCallback('onClearedTransaction');
window.onEvent = mPOS.getCallback('onEvent');