# AirplaneMonitor3D

[日本語 README](https://github.com/hobby-overflow/AirplaneMonitor3D/blob/main/README_ja.md)

This application is receive ADSB data to 3D plot.

![スクリーンショット (79)](https://user-images.githubusercontent.com/48244386/140714343-315cf2a0-e4ec-4f08-b7c4-e67a35943d4f.png)

## Need Environments

Receive ADSB signal and decode application, for example dump1090.

Windows

- RTL1090

Linux

- dump1090

Common

- Virtual Radar Server (referred to as VRS)

ADSB Data decode by Virtual Radar Server.
Thanks VRS!

https://www.virtualradarserver.co.uk/

For example I using SDR Receiver, RTL1090 and VRS

Run VRS, check receive ADSB decoded data.

## Installation of dependent module

```sh
npm install
```

or

```sh
npm i
```

## Run

```sh
npm run run
```

or

```sh
npm run dev # hot reload
```
