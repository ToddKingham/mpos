(function(){
		init();

		//on Menu
		ENGINE.listen('click','#menu-link', toggleNav);

		//on Navigate
		ENGINE.listen('click', 'UL#menu-list li a', function(el){
			ENGINE.changeView(this.href.split('#')[1]);
			toggleNav();
		});

		//on Login
		ENGINE.listen('submit','#login-form', function(){
			ENGINE.changeView('events');

			ajax.get('server/device_config.json', function(reply){
				mPOS.send("config", reply);
			});
		});

		//on History
		ENGINE.listen('click','#history', function(){
			ENGINE.changeView('batches');
		});
		
		//on Set Event
		ENGINE.listen('click','.event', function(){
			ENGINE.changeView('gates');
			
			var key = this.dataset.event;
			ajax.get('server/credentials.json?_=1', function(reply){
				reply[key].deviceId = 123;
				mPOS.send("credentials", reply[key]);
			});
		});

		//on Set Gate
		ENGINE.listen('click','.gate', function(){
			ENGINE.changeView('items');
		});
		
		//on Add Item
		ENGINE.listen('click','.qty', function(){
			var data = this.parentElement.dataset;
			CART.add(data.item,parseFloat(data.price));
			ENGINE.updateItemQty(this,data.item);
		});

		//on Remove Item
		ENGINE.listen('click','.remove', function(){
			var parent = this.parentElement;
			var data = parent.dataset;
			CART.remove(data.item);
			ENGINE.updateItemQty(parent.getElementsByClassName('qty')[0],data.item);
		});

		//on Checkout
		ENGINE.listen('click','#checkout', function(){
			if(CART.getQuantity()){
				ENGINE.changeView('payment');
			}
		});

		//start transaction
		ENGINE.listen('click','.start-transaction', function(){
			var type = this.dataset.type;
			var params;

			if(type !== 'cash'){
				params = {
					"transactionId": new Date()*1,
					"cardType": type,
					"transactionType": "sale",
					"amount": CART.getTotal()
				};

				mPOS.send("starttransaction", params);
			}
		});

		//new order
		ENGINE.listen('click','#new-order', function(){
			ENGINE.changeView("items");
		});

		//put prices into UI from item dataset
		ENGINE.elMap(document.getElementsByClassName('price'), function(el){
			el.innerHTML = ENGINE.dollarFormat(el.parentElement.dataset.price);
		});

		function init(){
			ENGINE.setViewDelegate('_global', function(){
				document.getElementById('menu-link').style.display = (this.view==='login') ? 'none' : 'inline';
			});

			ENGINE.setViewDelegate('batches', function(){
				ENGINE.buildBatchesList(function(el){
					var type = el.dataset.type;
					var batch = BATCH.getItem(el.dataset.batch);
					var params;

					switch(type){
						case 'return':
							params = {
								"transactionId": new Date()*1,
							    "cardType":  "credit",
							    "transactionType": "return",
							    "amount": batch.response.approvedAmt * -1,
							    "token": batch.response.token,
							    "payload": batch.request
							};
							break;

						case 'void':
							params = {
								"transactionId": new Date()*1,
							    "cardType":  "credit",
							    "transactionType": "void",
							    "referenceNum": batch.response.referenceNum,
							    "payload": batch.request
							};
							break;
					}
					
					mPOS.send("starttransaction", params);
				});
			});

			ENGINE.changeView(document.location.href.split('#')[1] || 'login');
		}

		function toggleNav(){
			var el = document.getElementById('menu');
				el.className = el.className === 'open' ? '' : 'open';
		};

	})();


// switch(obj.response.txnType.split('.')[2]){
// 	case 'sale':
// 		params = {
// 			"transactionId": obj.request.transactionId,
// 			"cardType": obj.request.cardType,
// 			"transactionType": obj.request.transactionType,
// 			"amount": CART.getTotal()
// 		};
// 	break;
	
// 	case 'return':
// 		params = {
// 			"transactionId": batch.response.orderNumber,
// 		    "cardType":  "credit",
// 		    "transactionType": "return",
// 		    "amount": batch.response.approvedAmt * -1,
// 		    "token": batch.response.token
// 		};
// 	break;

// 	case 'void':
// 		params = {
// 			"transactionId": batch.response.orderNumber,
// 		    "cardType":  "credit",
// 		    "transactionType": "void",
// 		    "referenceNum": batch.response.referenceNum
// 		};
// 	break;
// }


    

    
	