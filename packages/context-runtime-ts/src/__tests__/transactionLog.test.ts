import TransactionLog, { GenericTransactionLog } from '../transactionLog';
declare const global: {
  gc: () => void;
};

test('weakly observable', async () => {
  const log = new GenericTransactionLog<number>(50);

  log.observe(makeObserver());
  expect(log.numObservers).toBe(1);

  log.push(1);

  expect(log.numObservers).toBe(1);

  await new Promise(resolve => setTimeout(resolve, 0));
  global.gc();

  log.push(2);

  expect(log.numObservers).toBe(0);
});

test('stays under capacity', () => {
  const log = new GenericTransactionLog<number>(5);
  for (let i = 0; i < 100; ++i) {
    log.push(1);
    expect(log.length).toBe(Math.min(i + 1, 5));
  }
});

test('notifies observers', async () => {
  const log = new GenericTransactionLog<number>(5);
  let notified = false;
  const observer = () => {
    notified = true;
  };
  log.observe(observer);
  log.push(1);
  expect(notified).toBe(true);

  await new Promise(resolve => setTimeout(resolve, 0));
  global.gc();

  notified = false;
  log.push(2);
  expect(notified).toBe(true);
});

function makeObserver() {
  return () => {};
}
