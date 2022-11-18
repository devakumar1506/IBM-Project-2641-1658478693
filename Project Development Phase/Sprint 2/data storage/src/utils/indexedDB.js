import idb from 'idb';

const DB_NAME = 'ids';
const VERSION = 1;

const OBJECT_STORE_NAME = 'records';
const PRIMARY_KEY = 'id';
const INDEX_KEY = 'departureTime';

const getDatabase = async () => {
  const db = await idb.open(DB_NAME, VERSION, (upgradeDB) => {
    // Note: we don't use 'break' in this switch statement,
    // the fall-through behaviour is what we want.
    switch (upgradeDB.oldVersion) {
      case 0: {
        const objectStore = upgradeDB
          .createObjectStore(OBJECT_STORE_NAME, { keyPath: PRIMARY_KEY });
        objectStore.createIndex(INDEX_KEY, INDEX_KEY, { unique: false });
      }
      default: // eslint-disable-line no-fallthrough
        break;
    }
  });
  const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
  return { db, tx };
};

// Some old numbers on bulk insertion
// https://stackoverflow.com/questions/22247614/optimized-bulk-chunk-upload-of-objects-into-indexeddb
export const putBulkData = async (records) => {
  const { db, tx } = await getDatabase();
  const store = tx.objectStore(OBJECT_STORE_NAME);
  records.forEach(async record => store.put(record));

  await tx.complete;
  db.close();
};

export const getData = async (key, lowerBound, useIndex = false, indexField = INDEX_KEY) => {
  const { tx } = await getDatabase();
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const source = useIndex ? store.index(indexField) : store;

  if (key !== null) {
    return source.get(key);
  }

  let keyRangeValue;
  if (lowerBound) keyRangeValue = IDBKeyRange.lowerBound(lowerBound);

  return source.getAll(keyRangeValue);
};

export const putData = async (record) => {
  const { db, tx } = await getDatabase();
  const store = tx.objectStore(OBJECT_STORE_NAME);

  await store.put(record);
  await tx.complete;

  db.close();
};

export const deleteData = async (key) => {
  const { db, tx } = await getDatabase();
  const store = tx.objectStore(OBJECT_STORE_NAME);

  await store.delete(key);
  await tx.complete;

  db.close();
};

export const getCount = async (useIndex = false, indexField = INDEX_KEY) => {
  const { tx } = await getDatabase();
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const source = useIndex ? store.index(indexField) : store;

  return source.count();
};

export const deleteDatabase = async () => {
  await idb.delete(DB_NAME);
};
