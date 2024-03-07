const csv_parser = require('csv-parser')
const file_system = require('fs')
const results = []



file_system.createReadStream('similar.csv')
    .pipe(csv_parser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // results.forEach((r) => {
        //     JSON.parse(r.similar_plants.replace(/'/g, '"'))
        //     c += 1
        //     console.log(c)
        // });
        console.log(JSON.parse(results[1].similar_plants.replace(/'/g, '"')))
    });

