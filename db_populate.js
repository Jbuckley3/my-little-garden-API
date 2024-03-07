const csv_parser = require('csv-parser')
const file_system = require('fs')
const results = []



file_system.createReadStream('similar.csv')
    .pipe(csv_parser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(JSON.parse(results[0].similar_plants.replace(/'/g, '"')))
    });

