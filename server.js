const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
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

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});



