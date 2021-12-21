# AirplaneMonitor3D

WIP

このアプリケーションは ADSB データを 3D でプロットします.
![スクリーンショット (79)](https://user-images.githubusercontent.com/48244386/140714343-315cf2a0-e4ec-4f08-b7c4-e67a35943d4f.png)

## 必要な環境

ADSB 信号を受信～デコードするツールが必要です。

Windows

- RTL1090

Linux

- dump1090

共通

- Virtual Radar Server (以下 VRS と表記)

自分は R820T の SDR 受信機と RTL1090 と VirtualRadarServer を使っています

接続例

- [SDR レシーバ]-[RTL1090]-[VRS]-[Airplane3DMonitor]

**事前に VRS で ADSB データをデコードされていることを確認してください**

また VRS でデコードされたデータをもとにプロットするので VRS に依存しています

## 依存モジュールのインストール

```sh
npm install
```

または

```sh
npm i
```

## 実行

```sh
npm run run
```

or

```sh
npm run dev # hot reload
```

で起動します
