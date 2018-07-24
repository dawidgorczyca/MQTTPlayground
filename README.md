## Project prequisities:
Clone the repository, master branch is stable and updated to latest version, do `npm i`.

Install MongoDB, then in mongo shell:
```javascript
use mqtt;
db.createUser({
  user: "inqu",
  pwd: "test",
  roles: [
    { role: "readWrite", db: "mqtt" },
  ]
})
```

After that, make sure you have an `env` file created in your mail repository folder. Sample localhost configuration for it:
```
# mongo credentials
DB_HOST=127.0.0.1
DB_PORT=27017
DB_USER=inqu
DB_PASSWORD=test
DB_NAME=mqtt
DB_MAIN_COLLECTION=pubsub
```
Make yourself comfortable with the tool provided with MongoDB installation on window, with it you can modify the existing routes, drivers and fences directly in the database


Then make sure that the config in **backend.events.js** also contains the same:
```
process.env.DB_USER            = 'inqu'
process.env.DB_PASSWORD        =  'test'
process.env.DB_HOST            =  '127.0.0.1'
process.env.DB_PORT            =  '27017'
process.env.DB_NAME            =  'mqtt'
process.env.DB_MAIN_COLLECTION =  'events'
```
And at last, open three terminal windows of your choice and run separately from main folder:
* `npm run start` Which would start the frontend
* `npm run broker-start` Which will start the broker which we treat as the main backend
* `node broker/router.js` Starts our http API server

Thats it!

--------
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).