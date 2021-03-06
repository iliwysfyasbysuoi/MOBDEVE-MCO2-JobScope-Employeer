const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://admin:jobscope@cluster0.eeog6.mongodb.net/Cluster0?retryWrites=true&w=majority";

app.use(express.json())

mongoClient.connect(url,  { useUnifiedTopology: true }, (err, db) => {

    if(err){
        console.log("Error connecting to mongo client")
    }else {
        const myDB = db.db('jobscope');
        const userCollection = myDB.collection("user");
        const jobListingCollection = myDB.collection("joblisting");

        // REGISTER FOR EMPLOYER
        app.post('/EmployeeRegister', (req, res) =>{
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                type: "employer"
            }

            console.log("req.body.username: " + req.body.username);
            console.log("newUser.username: " + newUser.username);

            console.log("newUser.username: " + newUser.username);
             //used in findONe, ensures that the username is unique

            query = {username:newUser.username, type: "employer"};
            userCollection.findOne(query, (err, result) =>{
                //if no record yet
                if(result == null){
                    console.log("creates the new user");
                    //creates the new user
                    userCollection.insertOne(newUser, (err, result) => {
                        res.status(200).send();
                    })
                }else{
                    // username already exists
                    console.log("username already exists");
                    console.log("result: " + result);
                    res.status(400).send()

                }
            })
        })

        // REGISTER FOR APPLICANT
        app.post('/ApplicantRegister', (req, res) =>{
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                type: "applicant"
            }

            console.log("req.body.username: " + req.body.username);
            console.log("newUser.username: " + newUser.username);

            console.log("newUser.username: " + newUser.username);
             //used in findONe, ensures that the username is unique

            query = {username:newUser.username, type: "applicant"};
            userCollection.findOne(query, (err, result) =>{
                //if no record yet
                if(result == null){
                    console.log("creates the new user");
                    //creates the new user
                    userCollection.insertOne(newUser, (err, result) => {
                        res.status(200).send();
                    })
                }else{
                    // username already exists
                    console.log("username already exists");
                    console.log("result: " + result);
                    res.status(400).send()

                }
            })
        })

        //LOGIN for employer
        app.post('/login', (req, res) =>{
            query = {
                username: req.body.username,
                password: req.body.password,
                type: 'employer'
            }
            userCollection.findOne(query, (err, result) =>{
                if(result!=null){
                    const objToSend = {
                        username: result.username,
                        name: result.name,
                        email: result.email,
                        type: result.type
                    }
                    res.status(200).send(JSON.stringify(objToSend));
                }else{
                    //wrong credentials
                    res.status(404).send();
                }
            })
        })

        //LOGIN for applicant
                app.post('/loginApplicant', (req, res) =>{
                    query = {
                        username: req.body.username,
                        password: req.body.password,
                        type: 'applicant'
                    }
                    userCollection.findOne(query, (err, result) =>{
                        if(result!=null){
                            const objToSend = {
                                username: result.username,
                                name: result.name,
                                email: result.email,
                                type: result.type
                            }
                            res.status(200).send(JSON.stringify(objToSend));
                        }else{
                            //wrong credentials
                            res.status(404).send();
                        }
                    })
                })

        //New Job Listing
        app.post('/NewJobListing', (req, res) =>{

            jobListingCollection.find({}).toArray( function(err,  jobListingResult){

                newJobListing = {
                     jobListingID: jobListingResult.length + 1,
                     employer: req.body.employer,

                     title : req.body.title,
                     description : req.body.description,
                     location : req.body.location,
                     responsibilities : req.body.responsibilities,
                     specialization : req.body.specialization,
                     education : req.body.education,
                 }

                 //creates the new Job Listing
                 jobListingCollection.insertOne(newJobListing, (err, result) => {
                     res.status(200).send();
                 })
            })

         })

     }
})


app.listen(3000, () => {
    console.log("listening on port 3000");
})
