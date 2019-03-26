# 使用情境
透過Google Map搜尋裝置附近醫院資料，並將經使用者新增、修改、刪除後的資料存入資料庫

# 開發環境及工具
- 前端
  - HTML
  - CSS
  - JavaScript
- Library
  - Google Map API v3
  - jQuery
- IDE
  - Visual Studio Code
# 架構設計
- 全域變數
  - map : 地圖
  - searchResult : 搜尋後的結果
  - markers : 存放插過旗子的marker，以利後續控制
  - infoWindow : 點擊後跳出的訊息
  
一開始網頁載入後即載入google map，會先觸發一支callback(initMap)，
這時map跟infoWindow都會由google map api function帶入，瀏覽器跳視窗確認允許定位，定位後即在目前位置插旗，並搜尋附近標籤跟醫院相關的地點，統整進searchResult內，在陣列內的位置就是他們的id，以此來控制之後infoWindow內要呈現的資料。

![](https://github.com/wayne201299/google-api/blob/master/initMap.png)


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
