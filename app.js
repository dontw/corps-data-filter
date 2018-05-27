// file path
const TARGET_CORPS_FILE_PATH = './targetCorps/targetCorps.all.csv'
const ALL_DATA_FILE_PATH = './allData/allData.csv'

// import modules
const fs = require('fs')
const mkdirp = require('mkdirp')
const Json2csvParser = require('json2csv').Parser

//import functions
const {csvToJson} = require('./csvToJson')
const {getDateTime} = require('./getDateTime')

// settings
const setting = {
  gap: 0.55,
  maxNum: 1.25,
  minNum: 0.75
}

const fields = [
  '代碼',
  '公司',
  '產業',
  "年",
  "市值",
  "股價淨值比",
  "資產",
  "與目標<市值>差距比例",
  "與目標<資產>差距比例",
  "與目標<股價淨值比>差距比例"
];

const json2csvParser = new Json2csvParser({fields});

init()

async function init() {
  try {
    //取得目標公司資料
    const targetCorps = await csvToJson(TARGET_CORPS_FILE_PATH)

    //取得全部資料
    const allData = await csvToJson(ALL_DATA_FILE_PATH)

    //宣告預估擷取資料陣列
    let filteredDataArr = []

    targetCorps.map((item, index) => {
      //依照目標公司資料擷取全部資料中的相關資料
      filteredData = filterData(allData, item)
      //放入目標公司名稱
      filteredData = {
        name: item['公司'] + item['代碼'] + "-" + item['年'],
        data: filteredData
      }
      //放到擷取資料陣列
      filteredDataArr.push(filteredData)
    })

    //輸出檔案
    filteredDataArr.forEach(item => {
      mkdirp(`./out/${getDateTime()}`, err => {
        if (err) 
          console.log(err)
        else 
          console.log('new file folder ready!')
      });
      // fs.writeFileSync(`./out/${getDateTime()}/${item.name}.json`,
      // JSON.stringify(item, null, 2));
      const csvFile = json2csvParser.parse(item.data)
      fs.writeFileSync(`./out/${getDateTime()}/${item.name}.csv`, csvFile, 'utf8')
    })

  } catch (err) {
    console.log(err)
  }
}

/**
 * 依照目標資料的條件過濾資料
 * @param {Array} allData //所有資料
 * @param {Object} targetObj //目標資料
 * @returns {Array}
 */
function filterData(allData, targetObj) {
  return allData.filter((item) => {
    let equtityStatus
    let assetStatus
    let priceStatus
    let catagoryStatus
    let yearStatus

    if (item['股價淨值比'] !== '') {
      equtityStatus = targetObj['股價淨值比'] - item['股價淨值比'] <= Math.abs(targetObj['股價淨值比'] * setting.gap)
    }

    if (item['資產'] !== '') {
      assetStatus = targetObj['資產'] - item['資產'] <= Math.abs(targetObj['資產'] * setting.gap)
    }

    if (item['市值'] !== '') {
      priceStatus = targetObj['市值'] - item['市值'] <= Math.abs(targetObj['市值'] * setting.gap)
    }

    if (item['產業'] !== '') {
      catagoryStatus = item['產業'] == targetObj['產業']
    }

    if (item['年'] !== '') {
      yearStatus = item['年'] == targetObj['年']
    }

    if (item['代碼'] !== '') {
      catagoryStatus = item['代碼'] == targetObj['代碼']
    }

    let statusArr = [equtityStatus, assetStatus, priceStatus, yearStatus, catagoryStatus]

    if (statusArr.filter(item => item).length === 5) {
      item['與目標<股價淨值比>差距比例'] = item['股價淨值比'] / targetObj['股價淨值比'] * 100 + '%'
      item['與目標<資產>差距比例'] = item['資產'] / targetObj['資產'] * 100 + '%'
      item['與目標<市值>差距比例'] = item['市值'] / targetObj['市值'] * 100 + '%'
      return true
    } else {
      return false
    }
  })
}
