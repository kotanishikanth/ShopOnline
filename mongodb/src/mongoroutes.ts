import express from 'express';
import MongoClient from './mongoclient';

export var routes = express.Router();

const disableLog = true;
function Log(obj1?:any, obj2:any = undefined, obj3:any = undefined){
  if(disableLog) return;
  if(obj1 != undefined) console.log(obj1);
  if(obj2 != undefined) console.log(obj2);
  if(obj3 != undefined) console.log(obj3);
}

routes.get('/test', async (req, res) => {
  res.json('connection successful');
}).get('/:dbName/:collectionName', async (req, res) => {
  console.log(req.params.dbName +''+ req.params.collectionName);

  Log('Get records from Database Collection: ', req.params.dbName, req.params.collectionName);
  var results = await MongoClient.getAllRecords(req.params.dbName, req.params.collectionName);
  Log(results)
  res.json(results);

}).patch('/:dbName/:collectionName', async (req, res) => {
  console.log('update user request:');
  // console.log(req.body);
  var data = req.body;
  // console.log(user);
  let result = await MongoClient.patchRecord(req.params.dbName, req.params.collectionName, data);
  // console.log(result);
  res.json(result );
}).post('/:dbName/:collectionName', async (req, res) => {
  //console.log('create user request:');
  //console.log(req.body);
  var data = req.body;
  //console.log(data);
  let result:any;
  if(data){
    result = await MongoClient.createRecord(req.params.dbName, req.params.collectionName, data);
  }else{
    result = await MongoClient.createCollection(req.params.dbName, req.params.collectionName);
  }
  // console.log(result);
  res.json(result );
}).delete('/:dbName/:collectionName/:id', async (req, res) => {
  let result:any;
  if(req.params.id){
    result = await MongoClient.deleteRecord(req.params.dbName, req.params.collectionName, req.params.id);
  }
  else 
    res.redirect('/' + req.params.dbName + '/' + req.params.collectionName);
  // console.log(result);
  res.json(result ? "Delete successful" : "Delete failed");
}).delete('/:dbName/:collectionName', async (req, res) => {
  let result:any;
  result = await MongoClient.deleteAllRecords(req.params.dbName, req.params.collectionName);
  // console.log(result);
  res.json(result ? "Delete all records successful" : "Delete all records failed");
});

