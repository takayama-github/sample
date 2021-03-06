# 学習記録アプリ

学習記録をつけ、あとから見返して、今後の学習計画の見直しをするためのアプリ

一週間は月曜始まりとする

## 機能

### 学習予定を登録する

未来の日付に対して、どれくらいの時間で何を学習するか記録する。

各週で試験ごとに勉強予定時間を計算したい

### 学習実績を登録する

過去、現在の日付に対して、どれくらいの時間で何を学習するか記録する。

各週で試験ごとに勉強実績時間を計算する。
学習時間確保の関係で、あらかじめ入力しておきたい場合もあると思うので、その日のうちであれば、未来の時間に実績登録できる仕様

### 予実差を算出する

現在の週まで、週ごとに予定学習時間の合計と実績学習時間の合計を算出する

### 試験情報登録

受験予定の試験情報を登録する。

### 模試結果登録

模試の結果を登録する。

### 試験結果登録

試験の結果を登録する。

### ウィークリーカレンダー

指定した日付の週の予定と実績を確認できる
指定なしだと実行当日を指定する

## 動かし方

### 前提

- Docker
- Docker Compose

### 手順

1. .env設定
   1. cp .env.sample .env
   2. .envを修正
2. docker-compose up -d
3. localhost:${HOSTPORT}にブラウザでアクセス

## 開発

### フォルダ構成

```sh
% tree
.
├── .env.sample
├── .gitignore
├── README.md
├── db/
│   └── initdb/
│       ├── init-database.sh
│       └── sql/
├── docker-compose.yml
└── server/
    ├── Dockerfile
    └── app/
        ├── app.js
        ├── bin/
        │   └── www
        ├── controllers/
        ├── jest.config.js
        ├── models/
        ├── package-lock.json
        ├── package.json
        ├── public/
        ├── router.js
        ├── utils/
        └── views/

15 directories, 40 files
```

### コード修正

サーバープロセスの実行中はvolumesのマウント＆`nodemon`により、ホストのコード修正を検知して、自動で再起動がかかります。

### フォーマッター

`server/app/`で`npm run lint-staged`をすると、ステージング済みのファイルに対して、`Prettier`と`ESLint`による自動修正が入ります。

### テスト

`jest`による自動テストも導入したいですが、まだできていません。

## cmd

```sh
docker-compose up -d
docker-compose down
docker-compose start
docker-compose stop
docker-compose config
docker-compose exec db bash
. ./.env
docker-compose exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
docker logs server
docker-compose ps
docker ps
rm -rf db/data/*
```
