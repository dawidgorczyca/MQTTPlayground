const MongoClient = require('mongodb').MongoClient;

const dbConfig = {
    dbUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    dbUser: process.env.DB_USER,
    dbMainCollection: process.env.DB_MAIN_COLLECTION,
    dbName: process.env.DB_NAME
}

module.exports.getAllData = (cb) => {
    const { dbUrl, dbUser, dbMainCollection } = dbConfig

    MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
        if (err) console.log(err);

        const db = client.db(dbUser);
        const collection = db.collection(dbMainCollection);

        collection.find({topic: {'$regex': '^/Tracking'}}).toArray((err, docs) => {
            docs = docs.map(doc => {
                doc.value = doc.value.toString();
                return doc;
            });
            cb(docs);
            client.close();
        });

    });
}

module.exports.getDataForClient = (clientId, cb) => {
    const { dbUrl, dbUser, dbMainCollection } = dbConfig

    MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
        if (err) console.log(err);

        const db = client.db(dbUser);
        const collection = db.collection(dbMainCollection);
        const clientTopic = `/Tracking/${clientId}`
        collection.find({topic: {'$regex': `^${clientTopic}$`}}).toArray((err, docs) => {
            docs = docs.map(doc => {
                doc.value = doc.value.toString();
                return doc;
            });
            cb(docs);
            client.close();
        });
    });
}

module.exports.getClients = (cb) => {
    const clients = [];
    let client;

    this.getAllData(data => {

        data.forEach(obj => {
            client = obj.topic.match(/^\/Tracking\/(\S+)$/)[1] || null;
            if (clients.indexOf(client) === -1) {
                clients.push(client);
            }
        });
        cb(clients);
    });
}

