var PageUI={
	ready:function(startup){
		$(document).ready(function(){
			if(Cooke.get("username") !== null || Cooke.get("username") !== undefined &&  Cooke.get("password") !== null || Cooke.get("password") !== undefined){
			
			}else{
			if( window.location.urlVars['username'] !== undefined && window.location.urlVars['password'] !== undefined){
				var username = window.location.urlVars['username'];
				var password = window.location.urlVars['password'];
				console.log(username + " " + password);
				if(username == "demo" && password == "demo"){
					Cooke.create("username",username);
					Cooke.create("password",password);
					window.location.replace("index.php");
				}else{
					window.location.replace("login.html");
				}
			}
			}
		});
	}
}