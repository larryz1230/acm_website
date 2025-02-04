import * as fs from 'fs';
import { google } from "googleapis";
import * as dotenv from "dotenv";



dotenv.config();
const SERVICE_ACCOUNT = process.env["SERVICE_ACCOUNT"];
const DIRECTORY_SPREADSHEET_ID = process.env["DIRECTORY_SPREADSHEET_ID"];


// await getGoogleSheetData('Officers!A2:K');
writeToOutput(await getGoogleSheetData('Officers!A2:K'));

async function getAllOfficers() {       //tofix
    // Get all single events
    let promises = [];
    for (let i = 1; i <= 10; i++) {
      promises = promises.concat(getSingleEventsOfWeek(i));
    }
    let events = await Promise.all(promises);
    events = [].concat(...events);
  
    // Get all recurring events
    let recurring_rows = await getGoogleSheetData('RECURRING EVENTS!A:J');
    for (let i = 1; i <= 10; i++) {
      events = events.concat(getRecurringEventsOfWeek(recurring_rows, i));
    }
    return events.filter((item, index, self) => index === self.findIndex(
        (other) => item.title === other.title && item.rawStart === other.rawStart),
      );
  }




////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////

// Read data from Google sheets
// using sheet range (eg: 'Week 1!A:H)
async function getGoogleSheetData(range) {
  const sheets = google.sheets({ version: 'v4' });

  // Get JWT Token to access sheet
  const service_account = JSON.parse(SERVICE_ACCOUNT);
  const jwtClient = new google.auth.JWT(
    service_account.client_email,
    null, // or undefined, or an empty string (depends on your use case)
    service_account.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
  );

  // Authorize the client
  await jwtClient.authorize();

  const committees = ["Board, Internal", "Board, External", "AI", "Cyber", "Design", "Studio", "Hack", "ICPC", "Teach LA", "W"];

  // Get data from Google spreadsheets
  try {
    const res = await sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: DIRECTORY_SPREADSHEET_ID,
      range: range,
    });

    
    let currCommittee = "President";
    let offs = [];
    const rows = res?.data.values;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (committees.includes(row[0])){
        currCommittee = row[0];
      } else if (row[1]) {
        row[11] = currCommittee;
        offs.push(row);
      }
      
      // console.log(`Row ${i + 1}: ${row[10]}`);
    }

    // if (!rows || rows.length === 0) {
    //   console.log('Error: no data found');
    //   return [];
    // }

    // Format the rows into an array of objects
    const formattedData = offs.map((row) => ({
      role: row[0],
      name: row[1],
      pronouns: row[2],
      email: row[3],
      phone: row[4],
      year: row[5],
      major: row[6],
      birthday: row[7],
      discord: row[8],
      github: row[9],
      photo: row[10],
      committee: row[11],
    }));
    console.log(formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error retrieving data from Google Sheets:', error.message);
    return [];
  }
}

  function writeToOutput(officers) {
    // Write to offoutput.json
    const out = JSON.stringify(officers);
    fs.writeFile('offoutput.json', out, (err) => {
      if (err) throw err;
      // eslint-disable-next-line no-console
      console.log('Output successfully saved to offoutput.json');
    });
  }