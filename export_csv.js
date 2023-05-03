require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const { unparse: toCSV } = require('papaparse');
const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const writeCSVToFile = (data, filename) => {
  const csvData = toCSV(data);
  fs.writeFile(filename, csvData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('CSV file saved successfully');
    }
  });
};

const fetchAllRows = async () => {
  let fetchedRows = [];
  let pageIndex = 0;
  const pageSize = 1000;

  while (true) {
    const response = await supabase
      .from('sample_set1')
      .select('*')
      .order('id', { ascending: true })
      .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);

    if (response.error) {
      console.error('Error fetching data:', response.error);
      return null;
    }

    if (!response.data.length) break;

    fetchedRows = fetchedRows.concat(response.data);
    pageIndex += 1;
  }

  return fetchedRows;
};

(async () => {
  const data = await fetchAllRows();

  if (data) {
    writeCSVToFile(data, 'sample_set1.csv');
  }
})();
