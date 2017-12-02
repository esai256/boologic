import _ from "../node_modules/lodash/lodash.js";
const FIRST_INDEX = 0;

export const POSSIBILLITY_ENUM = {
    NA: 0,
    Impossible: 1,
    Possible: 2,
    Definitive: 3
};
//{haus: "gelb"}{nationalität: "japaner", zigaretten: "parliament"}, [{nationalität: "japaner", zigaretten: "parliament"}]
export function checkIfValueMatchesData(value, data, dataCollection) {
    const key = _.keys(value)[FIRST_INDEX];
    let result = POSSIBILLITY_ENUM.NA;
    let otherDataCollection = _.without(dataCollection, data);

    let isPropertyNotYetSet = () => data[key] == null;

    let isNotYetSetAnywhereElse = () => _.find(otherDataCollection, otherData => {
        return otherData[key] == value[key];
    }) == null;

    let worksWithDependencies = (dataToCheck) => _.every(dataToCheck.dependencies, dependency => dependency(value));

    let allOtherFieldsAreSet = () => _.every(otherDataCollection, otherData => Boolean(otherData[key]));

    let isStrikedInEveryOtherData = () => _.every(otherDataCollection, otherData => !worksWithDependencies(otherData));

    if(!isPropertyNotYetSet() || !isNotYetSetAnywhereElse() || !worksWithDependencies(data))
    {
        result = POSSIBILLITY_ENUM.Impossible;
    }
    else if(allOtherFieldsAreSet() || isStrikedInEveryOtherData())
    {
        result = POSSIBILLITY_ENUM.Definitive;
    }
    else
    {
        result = POSSIBILLITY_ENUM.Possible;
    }

    return result;
}

export function checkIfDataMatchesData(dataToCheck, data, dataCollection) {
    let result = POSSIBILLITY_ENUM.NA;
    let otherDataCollection = _.without(dataCollection, dataToCheck);

    _.forEach(Object.keys(dataToCheck), propertyName => {
        let valueToCheck = {[propertyName]: dataToCheck[propertyName]};
        let partialResult = checkIfValueMatchesData(valueToCheck, data, otherDataCollection);

        result = result == POSSIBILLITY_ENUM.NA || result > partialResult ? partialResult : result;

        //stop iteration if Impossible is already reached
        return result != POSSIBILLITY_ENUM.Impossible;
    });

    return result;
}
