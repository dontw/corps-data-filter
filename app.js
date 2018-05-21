// file path
const TARGET_CORPS_FILE_PATH = './targetCorps/targetCorps.csv'
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
  maxNum: 1.25,
  minNum: 0.75
}

const fields = [
  '公司',
  '簡稱',
  '行業別',
  "年",
  "股東權益總額",
  "資產總額",
  "市值",
  "與目標<股東權益總額>差距比例",
  "與目標<資產總額>差距比例",
  "與目標<市值>差距比例"
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
        name: item['公司'] + item['代碼'],
        data: filteredData
      }
      //放到擷取資料陣列
      filteredDataArr.push(filteredData)
    })

    //輸出json檔案
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

    if (targetObj['股東權益總額'] !== '') {
      equtityStatus = item['股東權益總額'] > targetObj['股東權益總額'] * setting.minNum && item['股東權益總額'] < targetObj['股東權益總額'] * setting.maxNum
      item['與目標<股東權益總額>差距比例'] = item['股東權益總額'] / targetObj['股東權益總額'] * 100 + '%'
    }

    if (targetObj['資產總額'] !== '') {
      assetStatus = item['資產總額'] > targetObj['資產總額'] * setting.minNum && item['資產總額'] < targetObj['資產總額'] * setting.maxNum
      item['與目標<資產總額>差距比例'] = item['資產總額'] / targetObj['資產總額'] * 100 + '%'
    }

    if (targetObj['市值'] !== '') {
      priceStatus = item['市值'] > targetObj['市值'] * setting.minNum && item['市值'] < targetObj['市值'] * setting.maxNum
      item['與目標<市值>差距比例'] = item['市值'] / targetObj['市值'] * 100 + '%'
    }

    if (targetObj['行業別'] !== '') {
      catagoryStatus = item['行業別'] == targetObj['行業別']
    }

    if (targetObj['年'] !== '') {
      yearStatus = item['年'] == targetObj['年']
    }

    let statusArr = [equtityStatus, assetStatus, priceStatus, catagoryStatus, yearStatus]

    if (statusArr.filter(item => item).length === 5) {
      return true
    } else {
      return false
    }
  })
}
