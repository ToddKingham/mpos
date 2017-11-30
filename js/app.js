(function(){
	init();

	//on Menu (open it)
	UTILS.listen('click','#menu-link', function(){
        var el = document.getElementById('menu');
            el.className = el.className === 'open' ? '' : 'open';
    });

	//on Menu Navigate
	UTILS.listen('click', 'UL#menu-list li a', function(el){
		VIEW.changeView(this.href.split('#')[1]);
	});

	//on Login
	UTILS.listen('submit','#login-form', function(){
		VIEW.changeView('events');

		AJAX.get('server/device_config.json', function(reply){
			mPOS.send("config", reply);
		});
	});
	
	//on Set Event
	UTILS.listen('click','.event', function(){
		VIEW.changeView('gates');
		
		var key = this.dataset.event;
		AJAX.get('server/credentials.json?_=1', function(reply){
			reply[key].deviceId = 123;
			mPOS.send("credentials", reply[key]);
		});
	});

	//on Set Gate
	UTILS.listen('click','.gate', function(){
		VIEW.changeView('items');
	});
	
	//on Add Item
	UTILS.listen('click','.qty', function(){
		var data = this.parentElement.dataset;
		CART.add(data.item,parseFloat(data.price));
		updateItemQty(this,data.item);
	});

	//on Remove Item
	UTILS.listen('click','.remove', function(){
		var parent = this.parentElement;
		var data = parent.dataset;
		CART.remove(data.item);
		updateItemQty(parent.getElementsByClassName('qty')[0],data.item);
	});

	//on Checkout
	UTILS.listen('click','#checkout', function(){
		if(CART.getQuantity()){
			VIEW.changeView('payment');
		}
	});

	//start sale
	UTILS.listen('click','.start-transaction', function(){
		var type = this.dataset.type;
		var params;

		if(type !== 'cash'){
			params = {
				"transactionType": "sale",
				"transactionId": new Date()*1,
				"isDebit": type.toLowerCase() === "debit",
				"amount": CART.getTotal()
			};

			mPOS.send("starttransaction", params);
		}
	});

	//new order
	UTILS.listen('click','#new-order', function(){
		VIEW.changeView("items");
	});

	//submit a batch
	UTILS.listen('submit', '#batch-form', function(){ alert('set it');
		BATCH.set(JSON.parse(this.batch.value));
	});

	function init(){

		VIEW.init('page', document.location.href.split('#')[1] || 'login');

		VIEW.setViewDelegate('_global', function(){ //perform these actions whenever the view changes
	        document.getElementById('menu').className = '';//close the nav
	        document.getElementById('menu-link').style.display = (this.view==='login') ? 'none' : 'inline';
	    });

		VIEW.setViewDelegate('batches', function(){
	    	var batches = BATCH.get();
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
	    		li.innerHTML = x.substr(x.length-4,x.length) +' - '+ bat.response.name.split('/')[1] +' - '+ UTILS.dollarFormat(bat.response.approvedAmt);
	    		li.dataset.transactionId = x
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
	    	

	    	UTILS.listen('click','.refund', function(){
	            var type = this.dataset.type;
	            var bat = BATCH.get(this.dataset.batch); console.log('BAT2', bat);
	            var params;

	            switch(type){
	                case 'return':
	                    params = {
	                        "transactionType": "return",
	                        "transactionId": new Date()*1,
	                        "isDebit":  false,
	                        "amount": bat.response.approvedAmt * -1,
	                        "token": bat.response.token,
	                        "cardType": bat.response.cardType,
	                        "expDate": bat.response.expDate,
	                        "payload": bat.request,
	                        "returnReason": " ",
	                        "saleDate": bat.response.saleDate
	                    };

	                    break;

	                case 'void':
	                    params = {
	                        "transactionType": "void",
	                        "transactionId": new Date()*1,
	                        "isDebit":  false,
	                        "referenceNum": bat.response.referenceNum,
	                        "transactionData": bat.transactionData,
	                        "payload": bat.request
	                    };
	                    break;
	            }
	            
	            mPOS.send("starttransaction", params);
	        });


	    });

	    VIEW.setViewDelegate('playground', function(){
	    	var batches = BATCH.get();
	    	var ul = document.getElementById('stuff');
	    	var clone = ul.cloneNode(false);
	    	var li, a;
		    	for(var batch in batches){
		    		a = document.createElement('A');
		    		a.href="#";
		    		a.className='stuff-li';
		    		a.dataset.transactionId = batch;
		    		a.innerHTML = batch;
		    		li = document.createElement('LI');
		    		li.appendChild(a);
		    		clone.appendChild(li);
		    	}
		    	ul.parentNode.replaceChild(clone, ul);
		    	UTILS.listen('click', '.stuff-li', function(){
		    		document.getElementById('something').value = JSON.stringify(BATCH.get(this.dataset.transactionId));
		    	});
	    });

		//put prices into UI from item dataset
		UTILS.htmlArray(document.getElementsByClassName('price')).map(function(el){
			el.innerHTML = UTILS.dollarFormat(el.parentElement.dataset.price);
		});
	}

	function updateItemQty(el,id){
		var qtyEl = el;
		var cartItem = CART.getItems()[id];
		if(typeof cartItem !== 'undefined'){
			var qty = cartItem.qty;
			qtyEl.innerHTML = qty ? qty : '+';
			qtyEl.setAttribute('class',qty ? 'qty green' : 'qty');
			document.getElementById('pagetotal').innerHTML = UTILS.dollarFormat(CART.getTotal());
		}
	}

})();



// mPOS interfaces
mPOS.setCallback("onTransactionComplete", function(resp){
    var buildUL = function(id, obj){
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

    buildUL('transaction-response',resp);
    VIEW.changeView('confirm');

    if(resp.result){
        BATCH.set(resp);
    } else {
        alert(resp.errorMessage);
    }
}.bind(this));

mPOS.setCallback("onClearedTransaction", function(obj){
    if(!obj.result){
        alert(obj.errorMessage);
    }
});