
var ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db:27017/";

const defaultcollection = null;

export async function createCollection(dbName:string, collectionName:string){
    const client = await MongoClient.connect(url)
        .catch(function(err:any){ console.error(err);});
    if(client) {
    
        const dbo = client.db(dbName);
        let result = await dbo.createCollection(collectionName);
        console.log("Collection created!");
        // console.log(result);
        // dbo.close();
        return 'success';
    }
    else
        throw 'Cannot connect to client';
}

export async function dropCollection(dbName:string, collectionName:string){
    const client = await MongoClient.connect(url)
        .catch(function(err:any){ console.error(err);});
    if(client) {
    
        const dbo = client.db(dbName);
        let result = await dbo.dropCollection(collectionName);
        console.log("Collection dropped!");
        // console.log(result);
        // dbo.close();
        return true;
    }
    else
        throw 'Cannot connect to client';
}

async function getCollection(dbName:string, collectionName:string){
    const client = await MongoClient.connect(url)
        .catch(function(err:any){ console.error(err);});
    if(client) {
    
        const dbo = client.db(dbName);
        let collection = dbo.collection(collectionName);        
        return collection;
    }
    else
        throw 'Cannot connect to client';
}

export async function getAllCollections(dbName:string){
    const client = await MongoClient.connect(url)
        .catch(function(err:any){ console.error(err);});
    if(client) {
    
        const dbo = client.db(dbName);
        let collectionsObj = dbo.listCollections();
        let collections = await collectionsObj.toArray();
        return collections;
    }
    else
        throw 'Cannot connect to client';
}

export async function getAllRecords(dbName:string, collectionName:string){
  let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    
    let res = await collection.find();
    let results = await res.toArray();
    // console.log('From to array: ' );
    // console.log(results);

    //res.forEach((item:any) => {
        //item['id'] = item['_id']            
        // console.log('received ' + item['_id']);
        //delete item['_id']
        //results.push(item);
    //});
    
    return results;
}


export async function getRecordById(dbName:string, collectionName:string, id:string){
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
      
      let result = await collection.findOne(ObjectID(id));     
      
      return result;
  }
  
  export async function getRecords(dbName:string, collectionName:string, query:any){
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
      
      let res = await collection.find(query);
      let results = await res.toArray();
      // console.log('From to array: ' );
      // console.log(results);
  
      //res.forEach((item:any) => {
          //item['id'] = item['_id']            
          // console.log('received ' + item['_id']);
          //delete item['_id']
          //results.push(item);
      //});
      
      return results;
  }

  export async function hasRecords(dbName:string, collectionName:string, query:any){
    
      let results = await getRecords(dbName, collectionName, query);
      if(results && results.length > 0)
        return true;
      else
        return false;
  }


export async function patchRecord(dbName:string, collectionName:string, data:any) {
    
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    console.log('Update document request:');
    let filter ;
    if(data._id){
        filter = { _id: ObjectID(data._id) };
        delete data['_id'];
    }
    else
        filter = { uniqueName: data.uniqueName }

    let res = await collection.updateOne(filter, { $set: data });        
    // [0]['id'] = res.ops[0]['_id']
    console.log('Updated document')
    res = await collection.findOne(res._id);
    console.log(res)
    // delete res.documents[0]['_id']
    return res;
}

export async function createRecord(dbName:string, collectionName:string, data:any) {
    
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    delete data['_id'];
    let res = await collection.insertOne(data);        
    //res.ops[0]['id'] = res.ops[0]['_id']
    //delete res.ops[0]['_id']
    return res.ops[0];
}

export async function deleteRecord(dbName:string, collectionName:string, id:string) {
    
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
            
    let res = await collection.deleteOne({ "_id": ObjectID(id)});
    // console.log("Deleting all documents");
    // console.log(res);
    return true;
}


export async function deleteAllRecords(dbName:string, collectionName:string) {
    
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
            
    let res = await collection.remove();  
    // console.log("Deleting all documents");
    // console.log(res);
    return true;
}

export default { createCollection, dropCollection,
    getAllCollections,
    getAllRecords, getRecordById, getRecords,
    createRecord,
    patchRecord,
    deleteRecord, deleteAllRecords }