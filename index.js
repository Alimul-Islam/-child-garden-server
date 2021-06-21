const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId

require('dotenv').config()

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.static('teachers'));
app.use(fileUpload());

const port = 4000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2vw11.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const teacherCollection = client.db("childGarden").collection("teacher");
    app.get('/teachers', (req, res) => {
        teacherCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addTeachers', (req, res) => {
        const teachers = req.body;
        teacherCollection.insertMany(teachers, (err, results) => {
            console.log(err, results)
            res.send({ count: results })


        })
    })
    app.post('/addTeacher', (req, res) => {
        const teacher = req.body;
        teacherCollection.insertOne(teacher, (err, results) => {
            console.log(err, results)
            res.send({ count: results })


        })
    })

    app.delete('/delete/:id', (req, res) => {
        const teacher = req.params.id;
        teacherCollection.deleteOne({ _id: ObjectId(teacher) }, (err, results) => {
            if (!err) {
                res.send({ count: 1 })
            }
        })


    })


});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)