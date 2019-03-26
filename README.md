# 使用情境
透過Google Map搜尋裝置附近醫院並存入資料庫
# 開發環境
- 前端
  - HTML
  - CSS
  - JavaScript
- Library
  - Google Map API v3
  - jQuery
# 時程紀錄
2019-03-26

- update功能完成，重構部分程式
- 調整搜尋結果Araray為object，更利於資料讀取

2019-03-24

- update功能(update後，infowindow值未改變，原因:function寫在marker.addlistener內)

2019-03-20

- delete功能(修正地點刪除錯誤)
- search-result由字串改為陣列
- 畫面調整(v2)

2019-03-19

- info window重新調整為全域變數
- info window新增delete鈕

2019-03-13

- 新增圖標點擊後觸發事件，顯示name及附近位置(addEventlistener)

2019-03-10

- API呼叫及定位插旗(金鑰)

2019-03-09

- Google Map API文件閱讀

2019-03-08

- 畫面設計構思(v1)
