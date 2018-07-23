const MongoClient = require('mongodb').MongoClient

function alterCollection(config, docId, docData, collectionName, cb) {
  const { dbUrl, dbName } = config

  MongoClient.connect(dbUrl, {useNewUrlParser: true}, async (err, client) => {
    try {
      const db = client.db(dbName)
      const collection = db.collection(collectionName)
      await collection.findOneAndUpdate(docId, {$set: docData})

      if(cb) {
        const createdItem = await collection.findOne(docData)
        await cb(createdItem)
      }
      client.close()
    } catch(err) {
      console.log(err)
      return err
    }
  })
}

function findInCollection(config, doc, collectionName, cb) {
  const { dbUrl, dbName } = config
  
  MongoClient.connect(dbUrl, {useNewUrlParser: true}, async (err, client) => {
    try {
      const db = client.db(dbName)
      const collection = db.collection(collectionName)
      const item = await collection.findOne(doc)
      await cb(item)
      client.close()
    } catch(err) {
      console.log(err)
      return err
    }
  })
}

function populateCollection(config, doc, collectionName, cb) {
  const { dbUrl, dbName } = config
  MongoClient.connect(dbUrl, {useNewUrlParser: true}, async (err, client) => {
    try {
      const db = client.db(dbName)
      const collection = db.collection(collectionName)
      await collection.insert(doc)

      if(cb) {
        const createdItem = await collection.findOne(doc)
        await cb(createdItem)
      }
      client.close()
    } catch(err) {
      console.log(err)
      return err
    }
  })
}

function initializeCollections(config) {
  const { dbUrl, dbName } = config

  MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
      if (err) {
          console.log(err)
          return err
      }
      const db = client.db(dbName)
      db.createCollection('drivers', (err) => {
          if (err) {
              console.log(err)
              return err
          }
      })
      db.createCollection('fences', (err) => {
          if (err) {
              console.log(err)
              return err
          }
      })
      db.createCollection('routes', (err) => {
          if (err) {
              console.log(err)
              return err
          }
      })
  })
}

module.exports.findInCollection = findInCollection
module.exports.populateCollection = populateCollection
module.exports.initializeCollections = initializeCollections
module.exports.alterCollection = alterCollection