const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

// Import the AWS SDK
const AWS = require('aws-sdk');


// Configure the AWS region
AWS.config.update({ region: 'eu-north-1' }); // Change to your region

// Create a new AWS.SSM instance
const ssm = new AWS.SSM();

// Function to get a SecureString parameter
async function getSecureParameter(name) {
    const params = {
        Name: name,
        WithDecryption: true // Required for SecureString
    };

    try {
        const response = await ssm.getParameter(params).promise();
        return response.Parameter.Value;
    } catch (error) {
        console.error('Error retrieving parameter:', error);
        throw error;
    }
}





async function initializeApp() {
    try {
        
        const dbPassword = await getSecureParameter('/nodejs/database/password');
        const dpusername = await getSecureParameter('/nodejs/database-username');
        await mongoose.connect(`mongodb+srv://${dpusername}:${dbPassword}@cluster0.zbugbke.mongodb.net/?retryWrites=true&w=majority`);
        console.log('Connection successful');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

initializeApp();


const car = require('./models/car');

app.post('/cars',async (req,res)=>
{
    const newcar = new car();
    const brand = req.body.brand;
    const model = req.body.model;
    const year = req.body.year;
    const type = req.body.type;

    newcar.brand=brand;
    newcar.model=model;
    newcar.year=Number(year);
    newcar.type=type;
    await newcar.save();
    res.send('the new car have been stored successfuly');
});


app.get('/cars',async (req,res)=>
{
    const cars = await car.find();
    res.json(cars);
})

app.get('/cars/:carid',async (req,res)=>
{
    const id = req.params.carid;
    const cars = await car.findById(id);
    
    res.json(cars);
})

app.delete('/cars/:carid',async (req,res)=>
{
    const id  = req.params.carid;
    const cars = await car.findByIdAndDelete(id);
    res.json(cars);
})



app.get('/hello',(req,res)=>
{
    res.send('hello');
});
app.delete('/delete',(req,res)=>
{
    res.send('delete');
});
app.listen(3000,()=>
{
    console.log('listening to port 300');
});
