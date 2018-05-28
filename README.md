# 公司資料過濾器

以 `targetCorps/targetCorps.csv` 為基準，從 `allData/allData.csv` 找出相近的資料

## 環境安裝

```sh
npm i
# or
yarn
```

## 執行使用

開發環境 `node v8.9.3`

```sh
npm run dev
# or
yarn dev
```

## 使用方式

1.  在 `./targetCorps` 資料夾放入當成篩選基準的資料並取名為 `targetCorps.csv`

2.  在 `./allData` 資料夾放入要篩選的資料並取名為 `allData.csv`

3.  產出篩選資料
    ```sh
    npm run start
    # or
    yarn start
    ```
4.  清除篩選資料
    ```
    npm run clrout
    # or
    yarn clrout
    ```

## 使用模組

1. csvtojson: 將csv轉成json格式
2. json2csv: 將json轉成csv格式
3. mkdirp: 產生資料夾
