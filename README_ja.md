# AirplaneMonitor3D

WIP



このアプリケーションはADSBデータを3Dでプロットします.



## 必要な環境

ADSB信号を受信～デコードするツールが必要です。



Windows

- RTL1090

Linux

- dump1090

共通

- Virtual Radar Server (以下VRSと表記)



自分はR081TのSDR受信機とRTL1090とVirtualRadarServerを使っています

Run VirtualRadarServer, check receive ADSB signal.

事前にVRSでADSBデータをデコードされていることを確認してください



## 依存モジュールのインストール

```sh
npm install
```

または

```sh
npm i
```

その後

```sh
npm run run
or
npm run dev # hot reload
```

で起動します
