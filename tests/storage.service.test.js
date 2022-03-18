import StorageService from "../src/storage.service";
import { jest } from "@jest/globals";

describe("Empty store with no driver", () => {
  it("Should be an instance of StorageService", () => {
    let storage = new StorageService();
    expect(storage).toBeInstanceOf(StorageService);
  });

  it("Should be empty", () => {
    let storage = new StorageService();
    expect(storage).toHaveLength(0);
  });

  it("Reading an empty key returned undefined", () => {
    let storage = new StorageService();
    let value = storage.getItem("somekey");
    expect(value).toBeUndefined();
  });

  describe("Reading an empty key with a fallback returns the fallback", () => {
    it("Fallback is matches went int", () => {
      let storage = new StorageService();
      let fallback = 123;
      let value = storage.getItem("somekey", fallback);
      expect(value).toBe(fallback);
    });

    it("Fallback is matches went string", () => {
      let storage = new StorageService();
      let fallback = "some string";
      let value = storage.getItem("somekey", fallback);
      expect(value).toBe(fallback);
    });

    it("Fallback is matches went date", () => {
      let storage = new StorageService();
      let fallback = new Date(2020, 1, 2);
      let value = storage.getItem("somekey", fallback);
      expect(value).toEqual(fallback);
      expect(value).not.toBe(fallback);
    });

    it("Fallback is a copy of an object not a reference", () => {
      let storage = new StorageService();
      let fallback = { la: "wooo", beep: 123 };
      let value = storage.getItem("somekey", fallback);
      expect(value).toEqual(fallback);
      expect(value).not.toBe(fallback);
    });

    it("Fallback is a copy of an array not a reference", () => {
      let storage = new StorageService();
      let fallback = [1, "234"];
      let value = storage.getItem("somekey", fallback);
      expect(value).toEqual(fallback);
      expect(value).not.toBe(fallback);
    });
  });

  describe("Setting a key", () => {
    let key = "blob";
    it(`Setting ${key} to undefined`, () => {
      let storage = new StorageService();
      let expected = undefined;
      expect(storage.getItem(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(`${expected}`);
    });

    it(`Setting ${key} to null`, () => {
      let storage = new StorageService();
      let expected = null;
      expect(storage.getItem(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(`${expected}`);
    });

    it(`Setting ${key} to 123`, () => {
      let storage = new StorageService();
      let expected = 123;
      expect(storage.storage.get(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(`${expected}`);
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to 123.56`, () => {
      let storage = new StorageService();
      let expected = 123.56;
      expect(storage.storage.get(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(`${expected}`);
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to Date(2020,1,3)`, () => {
      let storage = new StorageService();
      let expected = new Date(2020, 1, 3);
      expect(storage.storage.get(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(JSON.stringify(expected));
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to array`, () => {
      let storage = new StorageService();
      let expected = [1, 2, 3, "abb"];
      expect(storage.storage.get(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(JSON.stringify(expected));
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to object`, () => {
      let storage = new StorageService();
      let expected = { first_name: "joe", last_name: "bloggs" };
      expect(storage.storage.get(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(storage.storage.get(key)).toBe(JSON.stringify(expected));
      expect(storage).toHaveLength(1);
    });
  });

  describe("Deleting a key", () => {
    let key = "blob";
    it(`When ${key} is undefined`, () => {
      let storage = new StorageService();
      let value = undefined;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });

    it(`When ${key} is null`, () => {
      let storage = new StorageService();
      let value = null;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });

    it(`When ${key} is 123`, () => {
      let storage = new StorageService();
      let value = 123;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });

    it(`When ${key} is 123.56`, () => {
      let storage = new StorageService();
      let value = 123.56;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });

    it(`When ${key} is Date(2020,1,3)`, () => {
      let storage = new StorageService();
      let value = new Date(2020, 1, 3);

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });

    it(`When ${key} is array`, () => {
      let storage = new StorageService();
      let value = [1, 2, 3, "abb"];

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });

    it(`When ${key} is object`, () => {
      let storage = new StorageService();
      let value = { first_name: "joe", last_name: "bloggs" };

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(storage.storage.get(key)).toBeUndefined();
    });
  });
});

describe("Empty store with localStorage", () => {
  beforeAll(() => {
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();
  });

  it("Should be an instance of StorageService", () => {
    let storage = new StorageService(localStorage);
    expect(storage).toBeInstanceOf(StorageService);
    storage.isSupported();
    expect(storage.driver).toBe(localStorage);
    expect(storage.driverSupported).toBe(true);
  });

  it("Should be empty", () => {
    let storage = new StorageService(localStorage);
    expect(storage).toHaveLength(0);
  });

  it("Reading an empty key returned undefined", () => {
    let storage = new StorageService(localStorage);
    let value = storage.getItem("somekey");
    expect(value).toBeUndefined();
  });

  describe("Reading an empty key with a fallback returns the fallback", () => {
    it("Fallback is matches went int", () => {
      let storage = new StorageService(localStorage);
      let fallback = 123;
      let value = storage.getItem("somekey", fallback);
      expect(value).toBe(fallback);
    });

    it("Fallback is matches went string", () => {
      let storage = new StorageService(localStorage);
      let fallback = "some string";
      let value = storage.getItem("somekey", fallback);
      expect(value).toBe(fallback);
    });

    it("Fallback is matches went date", () => {
      let storage = new StorageService(localStorage);
      let fallback = new Date(2020, 1, 2);
      let value = storage.getItem("somekey", fallback);
      expect(value).toEqual(fallback);
      expect(value).not.toBe(fallback);
    });

    it("Fallback is a copy of an object not a reference", () => {
      let storage = new StorageService(localStorage);
      let fallback = { la: "wooo", beep: 123 };
      let value = storage.getItem("somekey", fallback);
      expect(value).toEqual(fallback);
      expect(value).not.toBe(fallback);
    });

    it("Fallback is a copy of an array not a reference", () => {
      let storage = new StorageService(localStorage);
      let fallback = [1, "234"];
      let value = storage.getItem("somekey", fallback);
      expect(value).toEqual(fallback);
      expect(value).not.toBe(fallback);
    });
  });

  describe("Setting a key", () => {
    let key = "blob";
    it(`Setting ${key} to undefined`, () => {
      let storage = new StorageService(localStorage);
      let expected = undefined;

      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(`${expected}`);
    });

    it(`Setting ${key} to null`, () => {
      let storage = new StorageService(localStorage);
      let expected = null;
      expect(storage.getItem(key)).toBeUndefined();

      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(`${expected}`);
    });

    it(`Setting ${key} to 123`, () => {
      let storage = new StorageService(localStorage);
      let expected = 123;
      
      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(`${expected}`);
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to 123.56`, () => {
      let storage = new StorageService(localStorage);
      let expected = 123.56;
      
      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(`${expected}`);
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to Date(2020,1,3)`, () => {
      let storage = new StorageService(localStorage);
      let expected = new Date(2020, 1, 3);

      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(JSON.stringify(expected));
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to array`, () => {
      let storage = new StorageService(localStorage);
      let expected = [1, 2, 3, "abb"];

      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(JSON.stringify(expected));
      expect(storage).toHaveLength(1);
    });

    it(`Setting ${key} to object`, () => {
      let storage = new StorageService(localStorage);
      let expected = { first_name: "joe", last_name: "bloggs" };

      storage.setItem(key, expected);

      expect(localStorage.__STORE__[key]).toBe(JSON.stringify(expected));
      expect(storage).toHaveLength(1);
    });
  });

  describe("Getting a set key", () => {
    let key = "blob";
    it(`Getting ${key} set to undefined`, () => {
      let storage = new StorageService(localStorage);
      let value = undefined;

      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toBe(value);
    });

    it(`Getting ${key} set to null`, () => {
      let storage = new StorageService(localStorage);
      let value = null;
      expect(storage.getItem(key)).toBeUndefined();

      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toBe(value);
    });

    it(`Getting ${key} set to 123`, () => {
      let storage = new StorageService(localStorage);
      let value = 123;
      
      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toBe(value);
      expect(storage).toHaveLength(1);
    });

    it(`Getting ${key} set to 123.56`, () => {
      let storage = new StorageService(localStorage);
      let value = 123.56;
      
      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toBe(value);
      expect(storage).toHaveLength(1);
    });

    it(`Getting ${key} set to Date(2020,1,3)`, () => {
      let storage = new StorageService(localStorage);
      let value = new Date(2020, 1, 3);

      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toEqual(value);
      expect(storage).toHaveLength(1);
    });

    it(`Getting ${key} set to array`, () => {
      let storage = new StorageService(localStorage);
      let value = [1, 2, 3, "abb"];

      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toEqual(value);
      expect(storage).toHaveLength(1);
    });

    it(`Getting ${key} set to object`, () => {
      let storage = new StorageService(localStorage);
      let value = { first_name: "joe", last_name: "bloggs" };

      storage.setItem(key, value);
      let expected = storage.getItem(key);

      expect(expected).toEqual(value);
    });
  });

  describe("Deleting a key", () => {
    let key = "blob";
    it(`When ${key} is undefined`, () => {
      let storage = new StorageService(localStorage);
      let value = undefined;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBe(value);
    });

    it(`When ${key} is null`, () => {
      let storage = new StorageService(localStorage);
      let value = null;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBeUndefined();
    });

    it(`When ${key} is 123`, () => {
      let storage = new StorageService(localStorage);
      let value = 123;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBeUndefined();
    });

    it(`When ${key} is 123.54`, () => {
      let storage = new StorageService(localStorage);
      let value = 123.54;

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBeUndefined();
    });

    it(`When ${key} is Date(2020,1,3)`, () => {
      let storage = new StorageService(localStorage);
      let value = new Date(2020, 1, 3);

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBeUndefined();
    });

    it(`When ${key} is array`, () => {
      let storage = new StorageService(localStorage);
      let value = [1, 2, 3, "abb"];

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBeUndefined();
    });

    it(`When ${key} is object`, () => {
      let storage = new StorageService(localStorage);
      let value = { first_name: "joe", last_name: "bloggs" };

      storage.setItem(key, value);
      storage.removeItem(key);

      expect(localStorage.__STORE__[key]).toBeUndefined();
    });
  });
});

describe("Existing values populate correctly", () => {
  describe("localstorage driver prodivded", () => {
    let key = "blob";
    it(`When ${key} is undefined`, () => {
      let value = undefined;
      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });

    it(`When ${key} is null`, () => {
      let value = null;

      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });

    it(`When ${key} is 123`, () => {
      let value = 123;

      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });

    it(`When ${key} is 123.54`, () => {
      let value = 123.54;

      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });

    it(`When ${key} is Date(2020,1,3)`, () => {
      let value = new Date(2020, 1, 3);

      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });

    it(`When ${key} is array`, () => {
      let value = [1, 2, 3, "abb"];

      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });

    it(`When ${key} is object`, () => {
      let value = { first_name: "joe", last_name: "bloggs" };

      localStorage.__STORE__[key] = value;
      let storage = new StorageService(localStorage);

      expect(storage.getItem(key, value)).toBe(value);
    });
  })
})  