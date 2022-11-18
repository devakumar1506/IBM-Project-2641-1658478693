import { NUM_OF_RECORDS } from 'config/constants';

const BASE_LINE = 1000000;

const start = new Date('01-01-2018').getTime();
const end = new Date('01-01-2019').getTime();

function randomEpoch() {
  return Math.floor(start + Math.random() * (end - start));
}

function* recordGenerator() {
  let index = 0;
  while (index < index + 1) {
    index += 1;
    const bogusId = BASE_LINE + index;
    const now = new Date().getTime();
    yield {
      id: bogusId,
      depPositionId: bogusId,
      arrPositionId: bogusId,
      createdAt: (now / 100000 - index) * 100000,
      departureTime: randomEpoch(),
    };
  }
}

const records = [];
const gen = recordGenerator();
for (let i = 0; i < NUM_OF_RECORDS; i += 1) {
  records.push(gen.next().value);
}

export default records;
