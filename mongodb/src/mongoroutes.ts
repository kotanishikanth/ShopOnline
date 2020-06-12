import express from 'express';
import MongoClient from './mongoclient';

export var routes = express.Router();

// console.log = function() {}

function isEmpty(obj:any): boolean{
  return Object.keys(obj).length !== 0;
}

routes.get('/test', async (req, res) => {
  res.json('connection successful');

});

// Returns Collection Stats
routes.get('/:dbName/:collectionName/stats', async (req, res) => {

  console.log('Database Name', req.params.dbName, 'Collection Name',req.params.collectionName);

  console.log('Get Collection Stats: ', req.params.dbName, req.params.collectionName);
  var results = await MongoClient.getCollectionStats(req.params.dbName, req.params.collectionName);
  console.log(results)
  res.json(results);

});

// Returns Records in Collection (default limit = 200)
routes.get('/:dbName/:collectionName', async (req, res) => {

  console.log(req.params.dbName + '' + req.params.collectionName);

  console.log('Get records from Database Collection: ', req.params.dbName, req.params.collectionName);
  var results = await MongoClient.getAllRecords(req.params.dbName, req.params.collectionName);
  console.log(results)
  res.json(results);

});

// Update record (_id is required in body)
routes.patch('/:dbName/:collectionName', async (req, res) => {

  console.log('MongoDB-Partial Update request:');
  // console.log(req.body);
  var data = req.body;
  // console.log(user);
  let result = await MongoClient.patchRecord(req.params.dbName, req.params.collectionName, data);
  // console.log(result);
  res.json(result);

});

// Create Record (_id is ignored)
routes.post('/:dbName/:collectionName', async (req, res) => {

  console.log('MongoDB-Create request:', req.body, 'Database Name', req.params.dbName, 'Collection Name',req.params.collectionName);
  
  if (req.body && isEmpty(req.body) ) {
    let result: any = await MongoClient.createRecord(req.params.dbName, req.params.collectionName, req.body);
    res.json(result);
  } else {
    res.sendStatus(204);
  }
  

});

// Update Record (_id is ignored)
routes.put('/:dbName/:collectionName', async (req, res) => {

  console.log('MongoDB-Update request:', req.body, 'Database Name', req.params.dbName, 'Collection Name',req.params.collectionName);
  
  if (req.body && isEmpty(req.body) ) {
    let result: any = await MongoClient.updateRecord(req.params.dbName, req.params.collectionName, req.body);
    res.json(result);
  } else {
    res.sendStatus(204);
  }
  

});

// deleted record in collection
routes.delete('/:dbName/:collectionName/:id', async (req, res) => {
  let result: any;
  if (req.params.id) {
    result = await MongoClient.deleteRecord(req.params.dbName, req.params.collectionName, req.params.id);
  }
  else
    res.redirect('/' + req.params.dbName + '/' + req.params.collectionName);
  // console.log(result);
  res.json(result ? "Delete successful" : "Delete failed");
});

// deletes all records in collection
routes.delete('/:dbName/:collectionName', async (req, res) => {
  // console.log(req.body);
  let result: any;
  result = await MongoClient.deleteRecords(req.params.dbName, req.params.collectionName, req.body);
  // console.log(result);
  res.json(result ? "Delete all records successful" : "Delete all records failed");
});

routes.all('*', (req, res)=>{
  res.status(400).send('Not found');
});

