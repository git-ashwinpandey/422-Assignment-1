/********************************************************************************
 * WEB422 – Assignment 1
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Ashwin Pandey  Student ID: 156027211  Date: 15th January, 2024
 *
 * Published URL: https://worried-fawn-tux.cyclic.app
 *
 ********************************************************************************/
require('dotenv').config();
const ListingsDB = require("./modules/listingsDB.js");

const express = require('express');
var cors = require('cors');
const db = new ListingsDB();

const HTTP_PORT = process.env.PORT || 80; // assign a port


const app = express();
app.use(cors());
app.use(express.json());

console.log("MongoDB Connection String:", process.env.MONGODB_CONN_STRING);
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


app.get('/', (req, res) => {
    res.status(200).json({message: "API Listening"});
  });


app.post('/api/listings', async(req, res) => {
    let newListing;
    console.log(req.body);
    try {
        newListing = await db.addNewListing(req.body);
        res.status(200).json(newListing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/listings', async(req, res) => {
    let allListing;
    try {
        allListing = await db.getAllListings(req.query.page, req.query.perPage, req.query.name);
        res.status(201).json(allListing);
    } catch (error) {
        res.status(500, {error: error});
    }
});

app.get('/api/listings/:_id', async(req, res) => {
    let getByID;
    console.log(req.params._id);
    try {
        getByID = await db.getListingById(req.params._id);
        res.status(200).json(getByID);
    } catch (error) {
        res.status(500, {error: error.message});
    }
});

app.put('/api/listings/:_id', async(req, res) => {
    let modifiedListing;
    try {
        modifiedListing = await db.updateListingById(req.body, req.params._id);
        res.status(200).json(modifiedListing);
    } catch (error) {
        res.status(500, {error: error.message});
    }
});

app.delete('/api/listings/:_id', async (req, res) => {
    try {
        const deletedListing = await db.deleteListingById(req.params._id);
        if (!deletedListing.deletedCount) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.status(200).send({deletedCount: deletedListing.deletedCount}); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});