const Possibility = require('../src/Possibility');
const checkIfValueMatchesData = require('../src/checkIfValueMatchesData');

describe('the "checkIfValueMatchesData" function should tell, if a given value does still possibly match the current data ', function () {
  it('should be a function', function () {
    expect(typeof checkIfValueMatchesData).toBe('function');
  });

  it('Should return definitive when invoked with an empty set', function () {
    const testValue = { a: 1 };
    const data = {};

    expect(checkIfValueMatchesData(testValue, data, [data])).toEqual(
      Possibility.DEFINITIVE,
    );
  });

  it('Should return impossible when invoked with a dataset where the property is already set', function () {
    const testValue = { a: 1 };
    const data = { a: 2 };

    expect(checkIfValueMatchesData(testValue, data, [data])).toEqual(
      Possibility.IMPOSSIBLE,
    );
  });

  it('should return possible if 2 empty datasets are given', function () {
    const testValue = { a: 1 };
    const data = {};
    const dataCollection = [data, {}];

    expect(checkIfValueMatchesData(testValue, data, dataCollection)).toEqual(
      Possibility.POSSIBLE,
    );
  });

  it('should return definitive if the othe dataset is already set', function () {
    const testValue = { a: 1 };
    const data = {};
    const dataCollection = [data, { a: 5 }];

    expect(checkIfValueMatchesData(testValue, data, dataCollection)).toEqual(
      Possibility.DEFINITIVE,
    );
  });

  it('should return possible if 3 empty datasets are given', function () {
    const testValue = { a: 1 };
    const data = {};
    const dataCollection = [data, {}];

    expect(checkIfValueMatchesData(testValue, data, dataCollection)).toEqual(
      Possibility.POSSIBLE,
    );
  });

  it('should return possible if one of the other datasets is already set', function () {
    const testValue = { a: 1 };
    const data = {};
    const dataCollection = [data, { a: 5 }, {}];

    expect(checkIfValueMatchesData(testValue, data, dataCollection)).toEqual(
      Possibility.POSSIBLE,
    );
  });

  it('should return definitive if both of the other datasets is already set', function () {
    const testValue = { a: 1 };
    const data = {};
    const dataCollection = [data, { a: 5 }, { a: 3 }];

    expect(checkIfValueMatchesData(testValue, data, dataCollection)).toEqual(
      Possibility.DEFINITIVE,
    );
  });

  it('should return impossible, if the dataset to check does not allow the value', function () {
    const testValue = { a: 1 };
    const data = {
      dependencies: [
        function (value) {
          let valid = true;

          if (value.a == testValue.a) {
            valid = false;
          }

          return valid;
        },
      ],
    };

    expect(checkIfValueMatchesData(testValue, data, [data])).toEqual(
      Possibility.IMPOSSIBLE,
    );
  });

  it('should return definitive, if the dataset validity check allows it, and it is the only one in the collection', function () {
    const testValue = { a: 1 };
    const data = {
      dependencies: [
        function (value) {
          let valid = true;

          if (value.a != testValue.a) {
            valid = false;
          }

          return valid;
        },
      ],
    };

    expect(checkIfValueMatchesData(testValue, data, [data])).toEqual(
      Possibility.DEFINITIVE,
    );
  });
});
