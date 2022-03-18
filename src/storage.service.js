import cloneDeep from "lodash/cloneDeep";

const isFloat = new RegExp(/^\d+\.\d+$/);
const isInt = new RegExp(/^\d+$/);
const isDate = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i)

export default class StorageService {
  constructor(driver) {
    this.driverSupported = null;
    this.storage = new Map();
    this.driver = driver;
  }

  get length() {
    if (this.isSupported()) {
      return this.driver.length;
    } else {
      return this.storage.size;
    }
  }

  hydrate(payload) {
    if (payload === "undefined") return undefined;
    if (payload === "null") return null;
    if (isFloat.test(payload)) return parseFloat(payload);
    if (isInt.test(payload)) return parseInt(payload);
    
    try {
      payload = JSON.parse(payload);

      if (isDate.test(payload)) return new Date(payload)
      
      return payload;
    } catch (e) {
      console.error(e);
      return payload;
    }
  }

  dehydrate(payload) {
    if (payload && typeof payload === "object") return JSON.stringify(payload);
    if (isFloat.test(payload) || isInt.test(payload)) return `${payload}`;
    if (payload === undefined) return "undefined";
    if (payload === null) return "null";
    return payload;
  }

  isSupported() {
    if (this.driverSupported === null) {
      try {
        const testKey = "__some_random_key_you_are_not_going_to_use__";
        this.driver.setItem(testKey, testKey);
        this.driver.removeItem(testKey);
        this.driverSupported = true;
      } catch (e) {
        this.driverSupported = false;
        this.driver = null;
      }
    }
    return this.driverSupported;
  }
  setItem(key, value) {
    value = this.dehydrate(value);
    
    if (this.isSupported()) {
      this.driver.setItem(key, value);
    } else {
      this.storage.set(key, value);
    }
  }

  getItem(key, fallback = undefined) {
    let item;
    fallback = cloneDeep(fallback);
    if (this.isSupported()) {
      item = this.driver.getItem(key);
      if (item) {
        item = this.hydrate(item);
      } else {
        item = fallback;
      }
    } else {
      item = this.storage.get(key);
      if (item) {
        item = this.hydrate(item);
      } else {
        item = fallback;
      }
    }

    return item;
  }

  removeItem(key) {
    if (this.isSupported()) {
      this.driver.removeItem(key);
    } else {
      delete this.storage.delete(key);
    }
  }

  clear() {
    if (this.isSupported()) {
      this.driver.clear();
    } else {
      this.storage.clear();
    }
  }
}
