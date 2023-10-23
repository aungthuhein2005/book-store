const express = require("express");
const {connectToDb, getDb} = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

//db connection
let db

connectToDb((err)=>{
    if(!err){
        app.listen(3333,()=>{
            console.log("Server is running on port 3333");
        });
        db = getDb();
    }
})

app.get('/',(req,res)=>{
    res.end("Hello World!");
})

app.get('/books',(req,res)=>{
    let books = [];

    const page = req.query.p || 0;
    const bookPerPage = 3;

    db.collection('books')
    .find()
    .sort({author : 1})
    .skip(page*bookPerPage)
    .limit(bookPerPage)
    .forEach(book => books.push(book))
    .then(()=>{
        res.status(200).json(books);
    })
    .catch(()=>{
        res.status(500).json({error : "Could't fetch the documnet"});
    })
})

app.get('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
    .findOne({_id: new ObjectId(req.params.id)})
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).json({error : "Could't fetch the documnet"}))
    }else{
        res.status.json({error: "Id is not valid"});
    }
})

app.post('/books',(req,res)=>{
    let book = req.body;
    console.log(book);
    db.collection('books')
    .insertOne(req.body)
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((err)=>{
        res.status(500).json({err : "Could't create new book"})
    })
})

app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json({error : "Could't delete the documnet"}))
    }else{
        res.status.json({error: "Id is not valid"});
    }
})

app.patch('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        let update = req.body;
        db.collection('books')
    .updateOne({_id: new ObjectId(req.params.id)},{$set: update})
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json({error : "Could't update the documnet"}))
    console.log(update);
    }else{
        res.status.json({error: "Id is not valid"});
    }
})