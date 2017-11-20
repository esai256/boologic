const expect = require("chai").expect;
const assert = require("chai").assert;
const requirejs = require("requirejs");

let checkIfValueMatchesData = null;
let possibillityEnum = null;

describe("the \"checkIfValueMatchesData\" function should tell, if a given value does still possibly match the current data ", function() {
    before(function(done) {
        requirejs.config({
            baseUrl: ".",
            nodeRequire: require
        });
        requirejs(["../dist/index.js"], function(index) {
            checkIfValueMatchesData = index.checkIfValueMatchesData;
            possibillityEnum = index.POSSIBILLITY_ENUM;
            done();
        });
    });

    it("should be a function", function() {
        assert.typeOf(checkIfValueMatchesData, "function");
    });

    it("Should return definitive when invoked with an empty set", function() {
        let testValue = {a: 1};
        let data = {};

        expect(checkIfValueMatchesData(testValue, data, [data])).to.equal(possibillityEnum.Definitive);
    });

    it("Should return impossible when invoked with a dataset where the property is already set", function() {
        let testValue = {a: 1};
        let data = {a: 2};

        expect(checkIfValueMatchesData(testValue, data, [data])).to.equal(possibillityEnum.Impossible);
    });

    it("should return possible if 2 empty datasets are given", function() {
        let testValue = {a: 1};
        let data = {};
        let dataCollection = [data, {}];

        expect(checkIfValueMatchesData(testValue, data, dataCollection)).to.equal(possibillityEnum.Possible);
    });

    it("should return definitive if the othe dataset is already set", function() {
        let testValue = {a: 1};
        let data = {};
        let dataCollection = [data, {a: 5}];

        expect(checkIfValueMatchesData(testValue, data, dataCollection)).to.equal(possibillityEnum.Definitive);
    });

    it("should return possible if 3 empty datasets are given", function() {
        let testValue = {a: 1};
        let data = {};
        let dataCollection = [data, {}];

        expect(checkIfValueMatchesData(testValue, data, dataCollection)).to.equal(possibillityEnum.Possible);
    });

    it("should return possible if one of the other datasets is already set", function() {
        let testValue = {a: 1};
        let data = {};
        let dataCollection = [data, {a: 5}, {}];

        expect(checkIfValueMatchesData(testValue, data, dataCollection)).to.equal(possibillityEnum.Possible);
    });

    it("should return definitive if both of the other datasets is already set", function() {
        let testValue = {a: 1};
        let data = {};
        let dataCollection = [data, {a: 5}, {a: 3}];

        expect(checkIfValueMatchesData(testValue, data, dataCollection)).to.equal(possibillityEnum.Definitive);
    });

    it("should return impossible, if the dataset to check does not allow the value", function() {
        let testValue = {a: 1};
        let data = {dependencies: [function(value) {
            let valid = true;

            if(value.a == testValue.a)
            {
                valid = false;
            }

            return valid;
        }]};

        expect(checkIfValueMatchesData(testValue, data, [data])).to.equal(possibillityEnum.Impossible);
    });

    it("should return definitive, if the dataset validity check allows it, and it is the only one in the collection", function() {
        let testValue = {a: 1};
        let data = {dependencies: [function(value) {
            let valid = true;

            if(value.a != testValue.a)
            {
                valid = false;
            }

            return valid;
        }]};

        expect(checkIfValueMatchesData(testValue, data, [data])).to.equal(possibillityEnum.Definitive);
    });
});
