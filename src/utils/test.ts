const unitTest = (boolean: boolean, msg?: string): boolean | string => {
  if (boolean) {
    return msg || '';
  }
  return true;
};

const Test = (tests: [boolean, string?][], withError?: boolean): boolean => {
  const error = tests.find(test => typeof unitTest(test[0], test[1]) === 'string');
  if (error) {
    if (error[1]) {
      console.log(error[1]);
    }
    if (withError) {
      throw Error(error[1] || 'cause error!');
    }
    return false;
  } else {
    return true;
  }
};

export default Test;
