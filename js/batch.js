var BATCH = new (function(){
    var transactions = {};

    var local = {
        init: function(){
            transactions = JSON.parse(localStorage.getItem('batch')) || {};
        },

        setItem: function(key, value){
            transactions[key] = value;
            localStorage.setItem('batch',JSON.stringify(transactions));
        }
    };

    this.get = function(key){
        var result = transactions;
        if(key){
            result = result[key];
        }
        return result;
    };

    this.set = function(resp){
        var success = resp.response.responseCode === "000";
            var transType = resp.response.reversalType ? 'void' : resp.response.txnType.split('.')[2];
            document.getElementById('order-number').innerHTML = resp.response.authCode;

            if(success && transType === 'sale'){ // OUR SALE WAS SUCCESSFULL
                var batchTarget = resp;
                var exclude = ['receipt','signature'];  
                        
                if(transType === 'sale'){
                    for(var x in exclude){
                        delete batchTarget[exclude[x]];             
                    }
                    batchTarget.response.reversed = false;
                }else{
                    batchTarget = this.get(resp.request.transactionId);
                    batchTarget.response.reversed = true;
                }
                                
                local.setItem(batchTarget.request.transactionId,batchTarget);
            }
            else if(success){ // OUR REFUND/VOID SUCCEEDED!
                var original = JSON.parse(resp.payload);
                var batchItem = this.get(original.transactionId);
                    batchItem.response.reversed = true;
                    local.setItem(original.transactionId,batchItem);
            }
    };

    this.remove = function(key){
        delete transactions[key];
        localStorage.removeItem(key);
    };
    
    local.init();
})();