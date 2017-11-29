var BATCH = new (function(){
    var transactions = {};

    this.setItem = function(key, value){
        transactions[key] = value;
        localStorage.setItem('batch',JSON.stringify(transactions));
    };

    this.getItem = function(key){
        return transactions[key];
    };

    this.removeItem = function(key){
        delete transactions[key];
        localStorage.removeItem(key);
    };

    var init = function(){
        transactions = JSON.parse(localStorage.getItem('batch')) || {};
    };

    init();
})();