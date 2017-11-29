var EVENTS = {
      LINEA_DEVICE_STATE: function(obj){},
      
      LINEA_STORE_DEVICE_CONFIG: function(obj){},

      LINEA_STORE_EVENT_CREDENTIALS: function(obj){},

      LINEA_CACHED_TRANSACTIONS: function(obj){
            var trans;
            var ul = document.getElementById('cache-list');
            var clone = ul.cloneNode(false);
 
            if(obj.length){
               var li, a, span, bat;
               
                  for(var i in obj){
                        trans = JSON.parse(obj[i].data);
                        li = document.createElement("LI");
                        li.innerHTML = trans.request.transactionId +" - "+ trans.request.transactionType;
                        a = document.createElement("A");
                        a.href="#";
                        a.className = "doer";
                        a.innerHTML = " do it";
                        a.dataset.original = JSON.stringify(trans.request);
                        li.appendChild(a);
                        clone.appendChild(li);
                  }
                  
                  utils.listen('click','a.doer', function(){
                        mPOS.send("clearTransaction", JSON.parse(this.dataset.original));
                  });
            }

            ul.parentNode.replaceChild(clone,ul);
            
            utils.listen('click','a.doer', function(){
                  mPOS.send("clearTransaction", JSON.parse(this.dataset.original));
            });     
      },

      LINEA_BATTERY_LEVEL: function(obj){}
};