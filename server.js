const fs = require('fs');
const path = require('path');
const express = require('express');
const res = require('express/lib/response');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());

const { animals } = require('./data/animals');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = []
    let filterResults = animalsArray;

    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }

        personalityTraitsArray.forEach(trait => {
            filterResults = filterResults.filter (
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filterResults = filterResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filterResults = filterResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filterResults = filterResults.filter(animal => animal.name === query.name);
    }
    return filterResults;
}

function findByID(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
}

function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string'){
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string'){
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res)=>{
    let results = animals;
    
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findByID(req.params.id, animals);
    if (result) {
        res.json(result);
    } 
    else {
        res.send(404);
    }   
});

app.post('/api/animals', (req, res) => {
    // set id
    req.body.id = animals.length.toString();


    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    }
    else {
        const animal = createNewAnimal(req.body, animals);
        res.json(req.body);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});



