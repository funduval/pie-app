import { builtinModules } from 'module';
//import outputData from './lambda-1-data-transform';
import { promises as fs } from 'fs';
import jsonfile from 'jsonfile';
import dataTransformer from './lambda-1-data-transform.js';


export default async function updateHtml() {
  console.log("updateHTML has been called");
  try {

    let transform = await dataTransformer();

    const read = jsonfile.readFileSync('./data-store/transformedData.json');
    const rawData = read.someData;

    const mapRawData = (rawData) => {
      console.log("file's been read & is being mapped");

      const totalCount = rawData.length;
      const secondColumnCounts = {};

      // Count the number of times the second field value appears in the objects
      for (let i = 0; i < rawData.length; i++) {
        const value = rawData[i][Object.keys(rawData[i])[1]];
        secondColumnCounts[value] = secondColumnCounts[value] ? secondColumnCounts[value] + 1 : 1;
      }

      const newArray = [];
      for (let i = 0; i < rawData.length; i++) {
        const firstColumnValue = rawData[i][Object.keys(rawData[i])[0]];
        const secondColumnValue = (secondColumnCounts[rawData[i][Object.keys(rawData[i])[1]]] / totalCount) * 100;
        newArray.push({
          "name": firstColumnValue,
          "share": secondColumnValue
        });
      }

      return newArray;
    }

    const mappedData = mapRawData(rawData);
    jsonfile.writeFileSync('./data-store/pie-data.json', { "someData": mappedData });


  } catch (error) {
    console.error('An error occurred:', error);

  }

}



