# AirplaneMonitor3D

WIP



このアプリケーションはADSBデータを3Dでプロットします.
![スクリーンショット (79)](https://user-images.githubusercontent.com/48244386/140714343-315cf2a0-e4ec-4f08-b7c4-e67a35943d4f.png)


## 必要な環境

ADSB信号を受信～デコードするツールが必要です。



Windows

- RTL1090

Linux

- dump1090

共通

- Virtual Radar Server (以下VRSと表記)



自分はR820TのSDR受信機とRTL1090とVirtualRadarServerを使っています

接続例
- [SDRレシーバ]-[RTL1090]-[VRS]-[Airplane3DMonitor]

**事前にVRSでADSBデータをデコードされていることを確認してください**

またVRSでデコードされたデータをもとにプロットするのでVRSに依存しています



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
