import _ from "../node_modules/lodash/lodash.js";
const FIRST_INDEX = 0;

export const POSSIBILLITY_ENUM = {
    NA: 0,
    Impossible: 1,
    Possible: 2,
    Definitive: 3
};

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

    if (!isPropertyNotYetSet() || !isNotYetSetAnywhereElse() || !worksWithDependencies(data)) {
        result = POSSIBILLITY_ENUM.Impossible;
    } else if (allOtherFieldsAreSet() || isStrikedInEveryOtherData()) {
        result = POSSIBILLITY_ENUM.Definitive;
    } else {
        result = POSSIBILLITY_ENUM.Possible;
    }

    return result;
}