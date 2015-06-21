# imadoko
イマドコ？ ココダヨ！ をちょっと楽にするツール。

## 出来るコト
今ドコにいるかをチームメンバーに[Trello](https://trello.com)上でそこそこ楽にアピールできる。

## 必要なコト
- BLE(Bluetooh Low Energy)対応のiPhoneを持っている
    - Androidでも動くと思うけど（未確認）
- BLE(Bluetooh Low Energy)対応で、node.jsが動くPCを持っている

### 動作確認済み環境
#### デバイス
- iPhone6
    - iOS8.3

#### PC
- MacBook Air (11-inch, Mid 2012)
    - Yosemite 10.10.3

## 準備
### チーム
- Trelloに状態を管理するボードを作る
- 作ったボードに3つのリスト（名前は任意）を作る
    - online用リスト
    - offline用リスト
    - away用リスト
- 一人一枚ずつカードを作り、作ったカードにメンバーとして追加する
    - 一枚のカードに複数のメンバーを登録しないこと

### 個人
- Trelloのアカウントを作る
- 自分のデベロッパーキーを[Trello Developerのページ](https://trello.com/app-key)から取得する
- keyを取得したら、次のURLから認証してtokenを取得する
    - `https://trello.com/1/connect?key=<API_KEY>&name=imadoko&response_type=token&expiration=never&scope=read,write`
    - `<API_KEY>`は先に取得したkeyを置き換えるコト
- デバイスに他人と被らない名前を付ける

## imadokoを動かす
imadokoをDL
```
$ git clone https://github.com/nalabjp/imadoko.git
```

おもむろにcd
```
$ cd imadoko
```

`config/default.yaml`を編集する。もちろんvimでなくても良い。
```
$ vim config/default.yaml
```

`YOUR_DEVICE_NAME`,  `YOUR_API_KEY`,  `YOUR_TOKEN`,  `YOUR_BOARD_NAME`は必ず置き換えること。その他は適当に好みで。
```
device:
  name: YOUR_DEVICE_NAME # => ココに自分が付けたデバイスの名前

trello:
  key: YOUR_API_KEY # => ココに取得したapi key
  token: YOUR_TOKEN # => ココに取得したtoken
  board:
    name: YOUR_BOARD_NAME # => ココにチームで作ったボードの名前
    list:
      online: 自席
      offline: 帰宅
      away: 離席

condition:
  # away になるまでの時間（分）
  time_until_away: 5
  # business time 以外の away 状態からさらに time_until_away を過ぎると offline にする
  business:
    start: '9:00'
    end: '22:00'
```

npm install!!
```
$ npm install
```

起動っ！！！！
```
$ npm start
```

## 更新履歴
[CHANGELOG](https://github.com/nalabjp/imadoko/blob/master/CHANGELOG.md)

## ライセンス
[MIT](https://github.com/nalabjp/imadoko/blob/master/LICENSE.md)
