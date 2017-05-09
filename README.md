#CouchDB client for node.js

##Example
```
let cdbClient = require('cdb-client');

let dbConfig = {
   db: 'db-name',
   user: 'db-user',
   pass: 'user-pass'
}

let dbConnection = cdbClient({
    protocol: 'http',
    host: '127.0.0.1',
    port: '5984'
});

// Callback
dbConnection.getDb(dbConfig, (err, db) => {

    if(err) {

        return console.error(err);
    }

    console.log(db);
});

// Get a reference
let db = dbConnection.getDb(dbConfig);
db.get('your-key', (err, doc) => {

    if(err) {

        return console.error(err);
    }

    console.log(doc);

    doc.prop1 = 'Update';
    db.save(doc, (err, data) > {

        if(err) {

            return console.error(err);
        }

        console.log(data);
    });
});
```
##DB Connection functions
```
dbConnection.dbExists(dbConfig, callback)

dbConnection.createDb(dbConfig, [callback])

dbConnection.getDb(dbConfig, [callback])
```

##DB functions
```
db.save(doc, [callback]);

db.getAll(callback);

db.get(key, callback);

db.delete(doc, [callback]);

db.view(data, callback);

db.saveDesign(ddoc, name, [callback]);

db.getDesign(name, callback);

db.setSecurity(data, [callback]);
```