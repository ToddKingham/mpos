var EVENTS = {
      // CONNECTION STATE
      LINEA_CONNECTED: function(obj){},
      LINEA_DISCONNECTED: function(obj){},

      // CONFIGURATION 
      LINEA_STORE_DEVICE_CONFIG_SUCCESS: function(obj){},
      LINEA_STORE_DEVICE_CONFIG_FAILURE: function(obj){},

      // CREDENTIALS CONFIG
      LINEA_STORE_EVENT_CREDENTIALS_SUCCESS: function(obj){},
      LINEA_STORE_EVENT_CREDENTIALS_FAILURE: function(obj){},

      // CASHED TRANSACTIONS
      LINEA_CACHED_TRANSACTIONS: function(obj){
            var trans;
            var ul = document.getElementById('stuff');
            var clone = ul.cloneNode(false);

            if(obj.length){
               var li, a, span, bat;
               
                  for(var i in obj){
                        trans = JSON.parse(obj[i].data);
                        ENGINE.sendToBatch(trans);
                        li = document.createElement("LI");
                        li.innerHTML = trans.request.transactionId +" - "+ trans.request.transactionType;
                        a = document.createElement("A");
                        a.href="#";
                        a.className = "doer";
                        a.innerHTML = "do it";
                        a.dataset.original = JSON.stringify(trans.request);//.transactionId;
                        li.appendChild(a);
                        clone.appendChild(li);
                        //alert(typeof trans.request.payload);
                  }
                  
                  ENGINE.listen('click','a.doer', function(){
                        mPOS.send("clearTransaction", JSON.parse(this.dataset.original));
                  });
            }

            ul.parentNode.replaceChild(clone,ul);
            
            ENGINE.listen('click','a.doer', function(){
                  mPOS.send("clearTransaction", JSON.parse(this.dataset.original));
            });     

      },

      // BATTERY ALERT
      LINEA_BATTERY_LEVEL: function(obj){}
};

function dooo(el){
      alert(el);
}