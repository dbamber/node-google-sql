# node-google-sql

This is the first version of a node module to access the google sql (fusion tables) api.

Please get in touch if you use this or would like more information.



More to follow

## Install
```
npm install node-google-sql
```
## Test script
I have included a small test file. It should let you know that everything is up and running 

```
node test.js <username> <password>
```

## Usage

Some example usage to get you started...


```
googleSql.login('<user>','<password>', function () {
		googleSql.getTables(function (d) {
			console.log(JSON.stringify(d));
		});
});
```

```
	var data =
		[
			[['name','test'],['location','53.48214672 -2.237863541']],
			[['name','test2'],['location','53.48417373 -2.237230539']]
        ];
		googleSql.insertRow(1307518,data,
			function (d) {
				console.log(JSON.stringify(d));
			});
```
```
	var tableDesc = [
		['name','STRING'],
		['location','LOCATION']
	];

	googleSql.createTable('testTable',tableDesc,
		function (d) {
			console.log(JSON.stringify(d));
	});

```
