const Possibility = require('../src/Possibility');
const checkIfDataMatchesData = require('../src/checkIfDataMatchesData');

describe('the "checkIfDataMatchesData" function should tell, if a given data does possibly merge with another data', () => {
  it('should be a function', () => {
    expect(typeof checkIfDataMatchesData).toBe('function');
  });

  it.only('should be definitive if nothing else is there and they complete each other without conflicting', () => {
    const testData = {
      a: 1,
      b: 2,
    };
    const compareData = {
      c: 3,
      d: 4,
    };

    expect(
      checkIfDataMatchesData(testData, compareData, [testData, compareData]),
    ).toEqual(Possibility.DEFINITIVE);
  });

  it('should be impossible if nothing else is there, but there are conflicting values', () => {
    const testData = {
      a: 1,
      b: 2,
    };
    const compareData = {
      b: 3,
      c: 3,
      d: 4,
    };

    expect(
      checkIfDataMatchesData(testData, compareData, [testData, compareData]),
    ).toEqual(Possibility.IMPOSSIBLE);
  });

  it('should be possible if there are two datasets which would be completed with the current data', () => {
    const testData = {
      a: 1,
      b: 2,
    };
    const compareData = {
      c: 3,
      d: 4,
    };
    const dataThatAlsoWouldFit = {
      c: 5,
      d: 6,
    };

    expect(
      checkIfDataMatchesData(testData, compareData, [
        testData,
        compareData,
        dataThatAlsoWouldFit,
      ]),
    ).toEqual(Possibility.POSSIBLE);
  });

  it('should be definitive if there is another set which would also fit, but it has a conflicting dependency', () => {
    const testData = {
      a: 1,
      b: 2,
    };
    const compareData = {
      c: 3,
      d: 4,
    };
    const dataThatAlsoWouldFitButForbidsIt = {
      c: 5,
      d: 6,
      dependencies: [
        data => data.a != 1,
      ],
    };

    expect(
      checkIfDataMatchesData(testData, compareData, [
        testData,
        compareData,
        dataThatAlsoWouldFitButForbidsIt,
      ]),
    ).toEqual(Possibility.DEFINITIVE);
  });
});
