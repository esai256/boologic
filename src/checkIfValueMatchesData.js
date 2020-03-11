//{haus: "gelb"}{nationalität: "japaner", zigaretten: "parliament"}, [{nationalität: "japaner", zigaretten: "parliament"}]
const Possibility = require('./Possibility');

module.exports = function checkIfValueMatchesData(value, data, dataCollection) {
  let result = Possibility.NA;
  const key = Object.keys(value)[0];
  const otherDataCollection = dataCollection.filter(entry =>
    entry !== data
  );

  const isPropertyNotYetSet = () => !data[key];

  const isNotYetSetAnywhereElse = () =>
    !otherDataCollection.find(otherData => {
      return otherData[key] === value[key];
    });

  const worksWithDependencies = ({ dependencies = [] } = { dependencies: [] }) =>
    dependencies.every(dependency => dependency(value));

  const allOtherFieldsAreSet = () => otherDataCollection.every(otherData => otherData[key]);

  const isStrikedInEveryOtherData = () =>
    otherDataCollection.every(otherData => !worksWithDependencies(otherData));

  console.log('');
  console.log('');
  console.log('');
  console.log('===ESAI_DEBUG===');
  console.log({
    isPropertyNotYetSet: isPropertyNotYetSet(),
    isNotYetSetAnywhereElse: isNotYetSetAnywhereElse(),
    worksWithDependencies: worksWithDependencies(),
  });
  console.log('===/ESAI_DEBUG===');
  console.log('');
  console.log('');
  console.log('');

  if (
    !isPropertyNotYetSet() ||
    !isNotYetSetAnywhereElse() ||
    !worksWithDependencies(data)
  ) {
    result = Possibility.IMPOSSIBLE;
  } else if (allOtherFieldsAreSet() || isStrikedInEveryOtherData()) {
    result = Possibility.DEFINITIVE;
  } else {
    result = Possibility.POSSIBLE;
  }

  return result;
}
