require('dotenv').config(); // ✅ ADD THIS LINE

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ YOUR HUBSPOT TOKEN FROM .env
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

// ✅ YOUR CUSTOM OBJECT ID
const OBJECT_TYPE = '2-227541171';

// my code

console.log(process.env.HUBSPOT_API_KEY);


// 🟢 ROUTE 1 - HOMEPAGE (GET DATA)
app.get('/', async (req, res) => {
    
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,modal`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;

        res.render('homepage', {
    title: 'Homepage',
    records: data   // 👈 change here
});


    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Error fetching data');
    }
});


// 🟢 ROUTE 2 - SHOW FORM
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Practicum'
    });
});


// 🟢 ROUTE 3 - CREATE RECORD
app.post('/update-cobj', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };


const newObject = {
  properties: {
    name: req.body.name,
    modal: Number(req.body.modal)
  }
};

    try {
        await axios.post(url, newObject, { headers });
        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Error creating record');
    }
});


// 🟢 SERVER
app.listen(3000, () => console.log('Listening on http://localhost:3000'));