# プロジェクト名（課題名）
React + TypeScript + MapLibre GL JSを用いて、背景地図の切り替えを行える、WEBアプリ

## 概要
地図の背景スタイルを切り替え可能なWebアプリです。  
MapLibre GL JS を使用し、GSI（地理院地図）、OpenStreetMap、MapTilerなどに対応しています。

## ディレクトリ構成
maplibre-app/
├── public/
│   └── basemaps.json         #背景地図の定義ファイル（GSI,OSM,MapTilerなど）
│
├── src/
│   ├── App.tsx               #地図のメインコンポーネント
│   ├── main.tsx              #アプリのエントリーポイント
│   └── vite-env.d.ts         #Vite用の型定義（必要に応じて）
│
├── index.html                #アプリのHTMLテンプレート
├── package.json              #npmパッケージ定義
├── tsconfig.json             #TypeScript設定
├── vite.config.ts            #Vite設定ファイル
└── README.md                 #このアプリの説明書（ビルド＆起動手順など）

## ビルド、起動までの手順、実行方法

1. プロジェクト作成
npm create vite@latest maplibre-app -- --template react-ts
cd maplibre-app

2. 依存パッケージのインストール
npm install
npm install maplibre-gl

3. 開発サーバー起動
npm run dev

実行後、以下のURLにアクセス：
http://localhost:5173


## 動作環境
- Node.js 22.18.0
- npm 10.9.0

## 機能概要
初期表示：仙台市周辺（緯度:38.2682, 経度:140.8694、ズーム:12）
地図の移動・ズーム可能（ナビゲーションコントロール付き）
右上セレクトボックスで背景地図の切り替え
basemaps.jsonの内容を自動で読み込み反映
GeoJSONを利用して、区市町村のポリゴンを地図上に表示する (追加課題)

## 参考
- Mapbox GL JSで地理院地図Vector風の地図を表示するサンプル: https://github.com/gsi-cyberjapan/gsivectortile-mapbox-gl-js
- Free basemap tiles for MapLibre: https://medium.com/@go2garret/free-basemap-tiles-for-maplibre-18374fab60cb
- React + MapLibre サンプル: https://visgl.github.io/react-maplibre/examples/
- 区市町村の地理データサンプル: https://github.com/smartnews-smri/japan-topography/blob/main/data/municipality/geojson/s0001/N03-21_210101.json　(追加課題)

## 備考
課題
作業にかかった時間：約6時間（要件理解、学習時間含む）
要所でAI(ChatGPT,Perplexity等)を活用しました。

追加課題
作業にかかった時間：約4時間（要件理解、学習時間含む）
要所でAI(ChatGPT,Perplexity等)を活用しました。