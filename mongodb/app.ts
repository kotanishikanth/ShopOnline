import express from 'express';
import { routes as mongoroutes} from './src/mongoroutes';
var cors = require('cors')

const app = express();

app.use(cors());
app.options('*', cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const port = 3000;

/*
app.use(function(req,res,next){

  // console.log(JSON.stringify(req.headers));

  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

// app.set('view engine', 'ejs');

app.use('/', mongoroutes);

app.listen(port, err => {
    if (err) {
      return console.error(err);
    }
    return console.log(`Mongo DB API server is listening on network http://localhost:50001`);
  });

  
  