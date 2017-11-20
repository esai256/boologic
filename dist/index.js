define(["exports", "../node_modules/lodash/lodash.js"], function (exports, _lodash) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.POSSIBILLITY_ENUM = undefined;
    exports.checkIfValueMatchesData = checkIfValueMatchesData;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var FIRST_INDEX = 0;

    var POSSIBILLITY_ENUM = exports.POSSIBILLITY_ENUM = {
        NA: 0,
        Impossible: 1,
        Possible: 2,
        Definitive: 3
    };

    function checkIfValueMatchesData(value, data, dataCollection) {
        var key = _lodash2.default.keys(value)[FIRST_INDEX];
        var result = POSSIBILLITY_ENUM.NA;
        var otherDataCollection = _lodash2.default.without(dataCollection, data);

        var isPropertyNotYetSet = function isPropertyNotYetSet() {
            return data[key] == null;
        };

        var isNotYetSetAnywhereElse = function isNotYetSetAnywhereElse() {
            return _lodash2.default.find(otherDataCollection, function (otherData) {
                return otherData[key] == value[key];
            }) == null;
        };

        var worksWithDependencies = function worksWithDependencies(dataToCheck) {
            return _lodash2.default.every(dataToCheck.dependencies, function (dependency) {
                return dependency(value);
            });
        };

        var allOtherFieldsAreSet = function allOtherFieldsAreSet() {
            return _lodash2.default.every(otherDataCollection, function (otherData) {
                return Boolean(otherData[key]);
            });
        };

        var isStrikedInEveryOtherData = function isStrikedInEveryOtherData() {
            return _lodash2.default.every(otherDataCollection, function (otherData) {
                return !worksWithDependencies(otherData);
            });
        };

        if (!isPropertyNotYetSet() || !isNotYetSetAnywhereElse() || !worksWithDependencies(data)) {
            result = POSSIBILLITY_ENUM.Impossible;
        } else if (allOtherFieldsAreSet() || isStrikedInEveryOtherData()) {
            result = POSSIBILLITY_ENUM.Definitive;
        } else {
            result = POSSIBILLITY_ENUM.Possible;
        }

        return result;
    }
});