const wait = (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const fetch = async (arg) => {
  console.log('FETCHING');
  await wait();
  return {
    name: 'Laurent',
    timestamp: Date.now(),
  };
};
