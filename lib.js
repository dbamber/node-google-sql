var querystring = require("querystring");
var csv = require('csv');

exports.gac = require('googleclientlogin').GoogleClientLogin;

exports.login = function(username,password,onLogin)
{
	exports.ga = new exports.gac({
		email: username,
		password: password,
		service: 'fusiontables',
		accountType: exports.gac.accountTypes.google
	});
	
	exports.ga.on(exports.gac.events.login, function(){
		onLogin();
  	});
  	exports.ga.on(exports.gac.events.error, function(e) {
  		
  		console.log('ERROR');
  	});
  	
  	exports.ga.login();
} 

exports.query = function(sql,callback)
{	
	var resFunc = function (res)
	{
		res.on('data', function (chunk) {
			var data = [];
			csv()
				.from(chunk)
				.transform(function(aData,index) {
					data.push(aData);				
				})
				.on('end',function(count){
					callback(data);
				});
				
  		});
	}    
	    
	    
	var path = "https://www.google.com/fusiontables/api/query";
	var query =querystring.stringify({sql: sql});
	
	lsql =sql.toLowerCase();
	if (lsql.indexOf("select") == 0||
			lsql.indexOf("show")  == 0||
			lsql.indexOf("describe")  == 0) {
        	
		exports.get(path,query,resFunc);
	} else {
		exports.post(path,query,resFunc);
	}
}

exports.post = function(url,query,callback)
{
	var options = {
		host: 'www.google.com',
		port: 443,
	    path:  url,
	    method: 'POST',
	    headers: {
	      'Authorization': 'GoogleLogin auth=' + exports.ga.getAuthId(),
	      'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': query.length
	     }
	};
	console.log(query);
	var req= require('https').request(options,callback);
	req.write(query);
	req.end();
}

exports.get = function(url,query,callback)
{
	var options = {
		host: 'www.google.com',
		port: 443,
	    path:  url + '?' + query,
	    method: 'GET',
	    headers: {
	      'Authorization': 'GoogleLogin auth=' + exports.ga.getAuthId()
	     }
	};
	
	var req= require('https').request(options,callback);
	req.end();
}

exports.createTable = function(name,data,callback)
{

	var columns = "";
	data.forEach(function(i){
		if (columns.length >0) columns+=",";
		columns += '\'' + i[0]+'\'' +":"+i[1]
	});
	
	var sql = 'CREATE TABLE \'' + name + '\' (' + columns + ')';
	console.log(sql);
	exports.query(sql,function(output)
	{
		callback(output[1][0]);
	});
}

exports.insertRow=function(table,data,callback)
{
	var sql = "";
	
	data.forEach(function (row){
		
		var fields = "";
		var values = "";
		row.forEach(function(i){
			if (fields.length >0) { fields+=",", values+=","; }
			fields += '\''+i[0]+'\'';
			values += '\''+i[1]+'\'';
		});
		
		if (sql.length > 0) sql+=";";
		
		sql += 'INSERT INTO ' + table + '(' + fields + ') values (' + values + ')';
		
	});
	
	if (data.length > 1) sql+=";";

	exports.query(sql,function (e){
		callback(e);
	});
	

}


exports.getTables = function(callback)
{
	exports.query('SHOW TABLES', function(output)
	{
		var tables = [];	
		for (var i=1;i<output.length;i++)
			tables.push({name:output[i][1],id:output[i][0]});
		
		callback(tables);
		
	});
}
