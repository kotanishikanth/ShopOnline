
var ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db:27017/";

const defaultcollection = null;

export async function createCollection(dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)
        .catch(function (err: any) { console.error(err); });
    if (client) {

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

export async function dropCollection(dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)
        .catch(function (err: any) { console.error(err); });
    if (client) {

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

async function getCollection(dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true })
        .catch(function (err: any) { console.error(err); });
    if (client) {

        const dbo = client.db(dbName);
        let collection = dbo.collection(collectionName);
        return collection;
    }
    else
        throw 'Cannot connect to client';
}

async function getCollectionStats(dbName: string, collectionName: string) {
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    if (collection) return collection.stats();
    else throw 'Collection not found';
}

export async function getAllCollections(dbName: string) {
    const client = await MongoClient.connect(url)
        .catch(function (err: any) { console.error(err); });
    if (client) {

        const dbo = client.db(dbName);
        let collectionsObj = dbo.listCollections();
        let collections = await collectionsObj.toArray();
        return collections;
    }
    else
        throw 'Cannot connect to client';
}

export async function getAllRecords(dbName: string, collectionName: string, limit: number = 200) {
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);

    let res = await collection.find().limit(limit);
    let results = await res.toArray();

    return results;
}


export async function getRecordById(dbName: string, collectionName: string, id: string) {
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);

    let result = await collection.findOne(ObjectID(id));

    return result;
}

export async function getRecords(dbName: string, collectionName: string, query: any, limit: number = 200) {
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    if (!collection) throw 'Collection not found';

    let res = await collection.find(query).limit(limit);
    let results = await res.toArray();
    return results;
}

export async function hasRecords(dbName: string, collectionName: string, query: any) {

    if (query && query != {}) {
        let results = await getRecords(dbName, collectionName, query, 1);
        return (results && results.length > 0)
    }
    let stats = await getCollectionStats(dbName, collectionName);
    return stats.count > 0
}

export async function patchRecord(dbName: string, collectionName: string, data: any) {

    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    // console.log('Update document request:');
    let filter;
    if (data._id) {
        filter = { _id: ObjectID(data._id) };
        delete data['_id'];
    }
    //else filter = { uniqueName: data.uniqueName }
    else throw 'Id not Found in data';
    let res = await collection.updateOne(filter, { $set: data });
    res = await collection.findOne(res._id);
    return res;
}

export async function updateRecord(dbName: string, collectionName: string, data: any) {

    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    // console.log('Update document request:');
    let filter;
    if (data._id) {
        filter = { _id: ObjectID(data._id) };
        delete data['_id'];
    }
    //else filter = { uniqueName: data.uniqueName }
    else throw 'Id not Found in data';
    let res = await collection.findOneAndReplace(filter, data );
    // [0]['id'] = res.ops[0]['_id']
    console.log('Updated document')
    console.log(res)
    res = await collection.findOne(res._id);
    console.log(res)
    // delete res.documents[0]['_id']
    return res;
}

export async function createRecord(dbName: string, collectionName: string, data: any) {
    console.log(data)
    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);
    delete data['_id'];
    let res = await collection.insertOne(data);
    //res.ops[0]['id'] = res.ops[0]['_id']
    //delete res.ops[0]['_id']
    return res.ops[0];
}

export async function deleteRecord(dbName: string, collectionName: string, id: string) {

    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);

    let res = await collection.deleteOne({ "_id": ObjectID(id) });
    // console.log("Deleting all documents");
    // console.log(res);
    return true;
}

export async function deleteRecords(dbName: string, collectionName: string, query?:any) {

    let collection = defaultcollection ? defaultcollection : await getCollection(dbName, collectionName);

    let res = await collection.deleteMany(query);
    // console.log('MongoDB-Delete', res.deletedCount);
    return res.deletedCount;
}

export default {
    createCollection, dropCollection, getCollectionStats,
    getAllCollections,
    getAllRecords, getRecordById, getRecords,
    createRecord,
    patchRecord,
    updateRecord,
    deleteRecord, deleteRecords
}