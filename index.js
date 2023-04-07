const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const methodOverride = require('method-override');

const mongo = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');

const fileUpload = require('express-fileupload');

app.use(fileUpload());


const connectionString =
  "mongodb+srv://adesh:adesh2336@cluster0.ie3qh.mongodb.net/practice2?retryWrites=true&w=majority";


const client = new MongoClient(connectionString);

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());

app.use(cors());


var db, farmers,buyers, type, crops, registeredProducts, requests;


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;

MongoClient.connect(connectionString,{useUnifiedTopology:true}).then(client =>{
    console.log("Connected to Database");
    db = client.db("semesterProject");
    farmers = db.collection('Farmer');
    buyers = db.collection('Buyer');
    type = db.collection('productType');
    crops = db.collection('Products');
    registeredProducts = db.collection('RegisteredProducts');
    requests = db.collection('Requests');
})

app.post('/checkFarmer',(req,res)=>{
    farmers.findOne({
        Email:req.body.Email
    }).then(function(succ){
        if(succ == null){
            res.send('true');
        }else{
            res.send('false');
        }
    })
})


app.post('/registerFarmer',(req,res)=>{
    farmers.insertOne({
        Name:req.body.Name,
        Email:req.body.Email,
        Contact:req.body.Contact,
        Password:req.body.Password,
        CityName:req.body.CityName,
        StateName:req.body.StateName,
        PinCode:req.body.PinCode
    }).then(function(succ){
        res.send('true')
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.post('/farmerLogin',(req,res)=>{
    farmers.findOne({
        Email:req.body.Email,
        Password:req.body.Password
    }).then(function(succ){
        res.send(succ);
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.post('/farmerAutoLogin',(req,res)=>{
    farmers.findOne({
        Email:req.body.Email
    }).then(function(succ){
        res.send(succ);
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.post('/getFarmer',(req,res)=>{
    farmers.findOne({
        Email:req.body.Email
    }).then(function(succ){
        res.send(succ);
    })
})

app.post('/getFarmerByID',(req,res)=>{
    farmers.findOne({
        _id:mongo.ObjectId(req.body.ID)
    }).then(function(succ){
        res.send(succ);
    })
})

app.post('/updateFarmer',(req,res)=>{
    farmers.updateOne({
        _id:mongo.ObjectId(req.body.ID)
    },{
        $set:{
            Name:req.body.Name,
            Contact:req.body.Contact,
            CityName:req.body.CityName,
            StateName:req.body.StateName,
            PinCode:req.body.PinCode
        }
    }).then(function(succ){
        res.send('true');
    }).catch(function(err){
        res.send('false');
        console.log(err);
    })
})


app.post('/addProduct',(req,res)=>{
    if(req.files === null){
        res.send('error 404');
    }
        var file = req.files.file;
        var CropName = req.body.CropName;
        var Type = req.body.Type;
        var Variety = req.body.Variety;
        var Quantity = req.body.Quantity;
        var Price = req.body.Price;
        var FarmerName = req.body.FarmerName;
        var Contact = req.body.Contact;
        var FarmerID = req.body.FarmerID;
        var imgURL = "/uploads/" + file.name;
        var Location = req.body.Location
        var Date = today;



        file.mv(`${__dirname}/../public/uploads/${file.name}`).then(function(succ){
            registeredProducts.insertOne({
                CropName:CropName,
                Type:Type,
                Variety:Variety,
                Quantity:Quantity,
                imageName:file.name,
                imgURL:imgURL,
                Price:Price,
                FarmerName:FarmerName,
                Contact:Contact,
                FarmerID:FarmerID,
                Date:Date,
                Location:Location
            }).then(function(succ){       
                res.send('true');
            })
        })
})


app.post('/getMyProducts',(req,res)=>{
    registeredProducts.find({
        "FarmerID":req.body.FarmerID
    }).toArray().then(function(succ){
        res.send(succ);
    })
})

app.post('/removeMyProduct',(req,res)=>{
    registeredProducts.deleteOne({
        "_id":mongo.ObjectId(req.body.ID)
    }).then(function(succ){
        res.send('true');
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.get('/getRequests',(req,res)=>{
    requests.find().toArray().then(function(succ){
        res.send(succ);
    })
})


app.post('/checkBuyer',(req,res)=>{
    buyers.findOne({
        Email:req.body.Email
    }).then(function(succ){
        if(succ == null){
            res.send('true');
        }else{
            res.send('false');
        }
    })
})

app.post('/registerBuyer',(req,res)=>{
    buyers.insertOne({
        Name:req.body.Name,
        Email:req.body.Email,
        Contact:req.body.Contact,
        Password:req.body.Password,
        CityName:req.body.CityName,
        StateName:req.body.StateName,
        PinCode:req.body.PinCode
    }).then(function(succ){
        res.send('true')
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})


app.post('/buyerLogin',(req,res)=>{
    buyers.findOne({
        Email:req.body.Email,
        Password:req.body.Password
    }).then(function(succ){
        res.send(succ);
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.post('/buyerAutoLogin',(req,res)=>{
    buyers.findOne({
        Email:req.body.Email,
        _id:mongo.ObjectId(req.body.ID)
    }).then(function(succ){
        res.send(succ);
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.post('/getBuyer',(req,res)=>{
    buyers.findOne({
        Email:req.body.Email
    }).then(function(succ){
        res.send(succ);
    }).catch(function(err){
        res.send('false');
        console.log(err);
    })
})


app.post('/addRequest',(req,res)=>{
    requests.insertOne({
        Type:req.body.Type,
        CropName:req.body.CropName,
        Variety:req.body.Variety,
        Price:req.body.Price,
        Quantity:req.body.Quantity,
        BuyerName:req.body.BuyerName,
        Location:req.body.Location,
        Contact:req.body.Contact,
        Email:req.body.Email,
        ID:req.body.ID,
        Date:today
    }).then(function(succ){
        res.send('true');
    })
})


app.post('/getMyRequests',(req,res)=>{
    requests.find({
        "ID":req.body.BuyerID
    }).toArray().then(function(succ){
        res.send(succ);
    })
})


app.post('/removeRequest',(req,res)=>{
    requests.deleteOne({
        _id:mongo.ObjectId(req.body.ID)
    }).then(function(succ){
        res.send('true');
    }).catch(function(err){
        res.send('false');
    })
})


app.get('/getProducts',(req,res)=>{
    registeredProducts.find().toArray().then(function(succ){
        res.send(succ);
    })
})


app.get('/getTypes',(req,res)=>{
    type.find().toArray().then(function(succ){
        res.send(succ);
    })
})


app.post('/getcropname',(req,res)=>{
    var currtype = req.body.Type;
    crops.find({
        "Type":currtype
    }).toArray().then(function(succ){
        res.send(succ);
    })
})


//ADMIN
app.post('/checktype',(req,res)=>{
    type.findOne({
        Type:req.body.Type
    }).then(function(succ){
        if(succ == null){
            res.send('true');
        }else{
            res.send('false');
        }
    })
})

app.post('/inserttype',(req,res)=>{
    type.insertOne({
        Type:req.body.Type
    }).then(function(succ){
        res.send('true');
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})


app.post('/checkcropname',(req,res)=>{
    crops.findOne({
        CropName:req.body.CropName
    }).then(function(succ){
        if(succ == null){
            res.send('true');
        }else{
            res.send('false');
        }
    })
})

app.post('/insertcropname',(req,res)=>{
    crops.insertOne({
        Type:req.body.Type,
        CropName:req.body.CropName
    }).then(function(succ){
        res.send('true');
    }).catch(function(err){
        console.log(err);
        res.send('false');
    })
})

app.listen(80, ()=>{
    console.log("Server Started");
})