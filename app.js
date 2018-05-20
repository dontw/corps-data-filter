const TARGET_CORPS_FILE_PATH = './targetCorps/targetCorps.csv'
const ALL_DATA_FILE_PATH = './allData/allData.csv'
const {csvToJson} = require('./csvToJson')

async function init() {
  try {
    const targetCorps = await csvToJson(TARGET_CORPS_FILE_PATH)
    const rawData = await csvToJson(ALL_DATA_FILE_PATH)
    const filterData = rawData.filter(item => item['行業別'] === '水泥工業' && item['年'] === '2010' && item['股東權益總額'] > 202 && item['股東權益總額'] < 206);
    console.log(filterData)
  } catch (err) {
    console.log(err)
  }
}

init()

// csvToJson(ALL_DATA_FILE_PATH, (data) => {   allData = data })