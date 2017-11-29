var CART = new (function(){
	var basket = {
		items : {},
		total : 0,
		quantity : 0
	};

	var parseMoney = function(n){
		return parseFloat(n.toFixed(2));
	}

	this.add = function(id,prc){
		if(typeof basket.items[id] === 'undefined'){
			basket.items[id] = {qty:0,prc:prc,subtotal:0};
		}
		basket.total = parseMoney(basket.total + prc);
		basket.quantity++;
		basket.items[id].qty ++;
		basket.items[id].subtotal = parseMoney(basket.items[id].qty * basket.items[id].prc);

	};
	this.remove = function(id){
		if(typeof basket.items[id] !== 'undefined' && basket.items[id].qty){
			basket.total = parseMoney(basket.total - basket.items[id].prc);
			basket.quantity --;
			basket.items[id].qty --;
			basket.items[id].subtotal = parseMoney(basket.items[id].qty * basket.items[id].prc);
		}
		
	};
	this.clearCart = function(){
		basket.items = {};
		basket.total = parseMoney(0);
		basket.quantity = 0;
	};

	this.getItems = function(){return basket.items;};
	this.getTotal = function(){return basket.total};
	this.getQuantity = function(){return basket.quantity};
})();