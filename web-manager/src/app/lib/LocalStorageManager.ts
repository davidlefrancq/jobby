export class LocalStorageManager {
  // isAutoModeFT
  static setIsAutoModeFT(value: boolean) {
    localStorage.setItem("isAutoModeFT", JSON.stringify(value));
  }

  static getIsAutoModeFT(): boolean {
    const value = localStorage.getItem("isAutoModeFT");
    const isTrue = value ? JSON.parse(value) : false;
    return isTrue === true;
  }

  static removeIsAutoModeFT() {
    localStorage.removeItem("isAutoModeFT");
  }
}
