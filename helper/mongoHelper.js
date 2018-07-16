const MongoClient = require('mongodb').MongoClient;

module.exports.getAllData = (cb) => {
    const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    const dbUser = process.env.DB_USER;
    const dbMainCollection = process.env.DB_MAIN_COLLECTION;

    MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
        if (err) console.log(err);

        const db = client.db(dbUser);
        const collection = db.collection(dbMainCollection);

        collection.find({}).toArray((err, docs) => {
            docs = docs.map(doc => {
                doc.value = doc.value.toString();
                return doc;
            });
            cb(docs);
            client.close();
        });

    });
}