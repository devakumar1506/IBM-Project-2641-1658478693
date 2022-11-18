const normalizeRecord = record => ({
  ...record,
});

const normalizeRecordsList = recordsList => recordsList.map(normalizeRecord);

export default normalizeRecordsList;
