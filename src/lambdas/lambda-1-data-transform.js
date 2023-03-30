import fs, { writeFile, writeFileSync } from 'fs';
import csv from 'csv-parser';

//const filePath = `./${process.argv[2]}`;
const filePath = './lambdas/data-store/banklist-sheet-sorted-15.csv'

console.log(filePath);
const outputData = {};
const outputArray = [];

function dataTransformer() {

  return new Promise((resolve, reject) => {

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        let output = {};
        outputArray.push(row);

      })
      .on('end', () => {
        resolve(outputArray);
        console.log("success");
        outputData["someData"] = outputArray;
        writeFileSync('./lambdas/data-store/transformedData.json', JSON.stringify(outputData));



      });
  })
}

export default dataTransformer