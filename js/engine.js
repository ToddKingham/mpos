ENGINE = {};
	(function(cart,batch,mpos,events){
		var viewDelegates = {};

		var methods = {
			htmlCollectionToArray: function(obj){
				var result = [];
				for(var x in obj){
					if(typeof obj[x] === 'object'){
						result.push(obj[x]);	
					}	
				}
				return result;
			}

   //          ,parseBoolean: function(s){
			//   return (!!parseFloat(s) || /^(true|yes)$/ig.test(s) );
			// }
		};

		this.dollarFormat = function(n){
			return '$'+parseFloat(n).toFixed(2);
		};

		this.setViewDelegate = function(view, cb){
			viewDelegates[view] = cb;
		};

		this.changeView = function (v, args){
			var t = document.getElementById(v);
			
			if(t !== null){

				this.elMap(document.getElementsByClassName('page'),function(el){
					el.style.display = (el === t) ? 'block' : 'none';
				});
			}

			var veiwObject = {view:v};
			if(typeof viewDelegates["_global"]!=='undefined'){
				viewDelegates["_global"].apply(veiwObject, args);
			}
			if(typeof viewDelegates[v]!=='undefined'){
				viewDelegates[v].apply(veiwObject, args);
			}

			document.location.href="#"+v;
		};

		this.listen = function(event,query,cb,parent){
			var parent = parent || document;
 			var obj = methods.htmlCollectionToArray(parent.querySelectorAll(query))
			obj.map(function(el){
				el.addEventListener(event, function(e){
					e.preventDefault();
					cb.apply(this);
				});
			});
		};

		this.elMap = function(obj,cb){
			methods.htmlCollectionToArray(obj).map(cb);
		};

		this.updatePageTotal = function(){
			document.getElementById('pagetotal').innerHTML = this.dollarFormat(cart.getTotal());
		};

		this.updateItemQty = function(el,id){
			var qtyEl = el;
			var cartItem = cart.getItems()[id];
			if(typeof cartItem !== 'undefined'){
				var qty = cartItem.qty;
				qtyEl.innerHTML = qty ? qty : '+';
				qtyEl.setAttribute('class',qty ? 'qty green' : 'qty');
				this.updatePageTotal();	
			}
		};

        this.buildBatchesList = function(cb){
        	var batches = JSON.parse(localStorage.getItem('batch'));
        	var li, a, span, bat;
        	var ul = document.getElementById('batch-list');
        	var clone = ul.cloneNode(false);

        	var ancr = function(type, bat){
        		a = document.createElement("A");
        			a.href = '#';
        			a.className = 'refund';
        			a.innerHTML = type;
        			a.dataset.type = type;
        			a.dataset.batch = bat;
        		return a;	
        	}

        	for(var x in batches){
        		bat = batches[x];
        		li = document.createElement("LI");
        		li.innerHTML = x.substr(x.length-4,x.length) +' - '+ bat.response.name.split('/')[1] +' - '+ this.dollarFormat(bat.response.approvedAmt);
        		span = document.createElement("SPAN");
        		span.id = 'refund-span';
        		
        		if(!bat.response.reversed){
	        		span.appendChild(ancr('return', x));
	        		span.appendChild(ancr('void', x));	
        		} else {
        			span.innerHTML = 'aweddydoe';
        		}
        		
        		li.appendChild(span);
        		clone.appendChild(li);
        	}
        	ul.parentNode.replaceChild(clone,ul);
        	

        	this.listen('click','.refund', function(){
        		cb(this);
        	});
        };

        this.buildUL = function(id, obj){
            var ul = document.getElementById(id);
            var clone = ul.cloneNode(false);
            var addEl = function(parent, obj){
                var text, newUL;
                for(var x in obj){
                  el = document.createElement('li');
                  parent.appendChild(el);
                  if(typeof obj[x] === 'object'){
                    newUL = document.createElement('ul');
                    el.innerHTML = x;
                    el.appendChild(newUL);
                    addEl(newUL,obj[x]);
                  }else{
                    text = obj[x].toString();
                    text = x + ' = ' + (text.substr(0,50) + (text.length > 50 ? '...' : ''));
                    el.innerHTML = text;
                  }
                }
            }
            addEl(clone, obj);
            ul.parentNode.replaceChild(clone,ul);
        };

        this.sendToBatch = function(resp){
			var transactionType = resp.response.txnType.split('.')[2];
			var batchTarget = resp;
            var exclude = ['receipt','signature']; 	
            		
        	if(transactionType === 'sale'){
				for(var x in exclude){
		        	delete batchTarget[exclude[x]];            	
		        }
				batchTarget.response.reversed = false;
    		}else{
				batchTarget = batch.getItem(resp.request.transactionId);
    			batchTarget.response.reversed = true;
    		}
        				   	
	        batch.setItem(batchTarget.request.transactionId,batchTarget);
		};



    		mpos.setCallback("onTransactionComplete", function(resp){

                var success = resp.result && resp.response.responseCode === "000";
                var transType = resp.response.reversalType ? 'void' : resp.response.txnType.split('.')[2];

                document.getElementById('order-number').innerHTML = resp.response.authCode;
                this.buildUL('transaction-response',resp);
    	        this.changeView('confirm');
    	        
    	      
	           if(success && transType === 'sale'){ // OUR SALE WAS SUCCESSFULL
    	          this.sendToBatch(resp);
    	        } else if(transType !== 'sale'){ // OUR REFUND/VOID FAILED!
                    var original = JSON.parse(resp.payload);
    	            var batchItem = batch.getItem(original.transactionId);
    		            batchItem.response.reversed = true;
    		            batch.setItem(original.transactionId,batchItem);
    	           mpos.send("clearTransaction", resp.request);
	           }
    	    }.bind(this));



    		mpos.setCallback("onClearedTransaction", function(obj){
    			if(!obj.result){
                    alert(obj.errorMessage);
                }
                //alert(obj.result+' '+obj.errorMessage);
    		});

// if ([transaction.transactionType compare:kTransactionTypeSale] == NSOrderedSame) {
//   predicate = [NSPredicate predicateWithFormat:@"transactionId == %@ AND cardType == %@ AND transactionType == %@ AND amount == %@", transaction.transactionId, transaction.cardType, transaction.transactionType, transaction.amount];
// } else if ([transaction.transactionType compare:kTransactionTypeReturn] == NSOrderedSame) {
//   predicate = [NSPredicate predicateWithFormat:@"transactionId == %@ AND cardType == %@ AND transactionType == %@ AND token == %@", transaction.transactionId, transaction.cardType, transaction.transactionType, transaction.token];
// } else {
//   predicate = [NSPredicate predicateWithFormat:@"transactionId == %@ AND cardType == %@ AND transactionType == %@ AND referenceNum == %@", transaction.transactionId, transaction.cardType, transaction.transactionType, transaction.referenceNum];
// }


    	mpos.setEvents(events);


	}).apply(ENGINE,[CART,BATCH,mPOS,EVENTS]);
