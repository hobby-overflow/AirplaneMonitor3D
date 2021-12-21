import { Aircraft } from "./Aircraft";

export class AircraftList {
  public acList: Array<Aircraft> = [];

  constructor(acList?: Array<any>) {
    if (acList != null) {
      acList.forEach((item) => {
        this.acList.push(new Aircraft(item));
      });
    }
  }
}
