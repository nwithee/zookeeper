const express = require('express');
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


app.get('/api/animals', (req, res)=>{
    let results = animals;
    
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

app.listen(3001, () => {
    console.log('API server now on port 3001!');
});



