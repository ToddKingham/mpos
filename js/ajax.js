var AJAX = new (function(){
	var methods = {
		xhr: function(mthd,url,cb,q){
			if(q){
				url += '?'+q;
			}
			var xhr = new XMLHttpRequest(); 
			xhr.onreadystatechange = function(){  
				switch(xhr.readyState){  
					case 4: 
						if ( xhr.status == 200 ){  
							cb(JSON.parse(xhr.responseText));
						}
						delete xhr;  
					break;  
				}
			};
			xhr.open( mthd.toLowerCase() , url , true );  
			xhr.send();
		}
	};

	 this.get = function(url,cb,q){
	 	var qs = '_'+new Date()*1;
	 	for(var x in q){
	 		qs+= ('&'+x+'='+q[x]);
	 	}
		methods.xhr('get', url, cb, qs);
	};

})();