const wait = (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const fetch = async (path) => {
  console.log('FETCHING ', path);
  await wait();
  return {
    name: 'Laurent',
    timestamp: Date.now(),
  };
};
