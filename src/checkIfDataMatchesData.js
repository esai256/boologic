const Possibility = require('./Possibility');
const checkIfValueMatchesData = require('./checkIfValueMatchesData');

module.exports = function checkIfDataMatchesData(dataToCheck, data, dataCollection) {
  let result = Possibility.NA;
  const otherDataCollection = dataCollection.filter(entry =>
    entry !== data
  );

  Object.keys(dataToCheck).forEach(propertyName => {
    const valueToCheck = {
      [propertyName]: dataToCheck[propertyName],
    };
    const partialResult = checkIfValueMatchesData(
      valueToCheck,
      data,
      otherDataCollection,
    );

    // console.log('');
    // console.log('');
    // console.log('');
    // console.log('===ESAI_DEBUG===');
    // console.log(valueToCheck);
    // console.log(partialResult);
    // console.log(data, otherDataCollection);
    // console.log('===/ESAI_DEBUG===');
    // console.log('');
    // console.log('');
    // console.log('');

    result = result === Possibility.NA || result > partialResult
      ? partialResult
      : result;

    //stop iteration if Impossible is already reached
    return result !== Possibility.IMPOSSIBLE;
  });

  return result;
}
