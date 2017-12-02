const expect = require("chai").expect;
const assert = require("chai").assert;
const requirejs = require("requirejs");

let checkIfDataMatchesData = null;
let possibillityEnum = null;

describe("the \"checkIfDataMatchesData\" function should tell, if a given data does possibly merge with another data", function() {
    before(function(done) {
        requirejs.config({
            baseUrl: ".",
            nodeRequire: require
        });
        requirejs(["../dist/index.js"], function(index) {
            checkIfDataMatchesData = index.checkIfDataMatchesData;
            possibillityEnum = index.POSSIBILLITY_ENUM;
            done();
        });
    });

    it("should be a function", function() {
        assert.typeOf(checkIfDataMatchesData, "function");
    });

    it("should be definitive if nothing else is there and they complete each other without conflicting", function() {
        let testData = {
            a: 1,
            b: 2
        };
        let compareData = {
            c: 3,
            d: 4
        };

        expect(checkIfDataMatchesData(testData, compareData, [testData, compareData])).to.equal(possibillityEnum.Definitive);
    });

    it("should be impossible if nothing else is there, but there are conflicting values", function() {
        let testData = {
            a: 1,
            b: 2
        };
        let compareData = {
            b: 3,
            c: 3,
            d: 4
        };

        expect(checkIfDataMatchesData(testData, compareData, [testData, compareData])).to.equal(possibillityEnum.Impossible);
    });

    it("should be possible if there are two datasets which would be completed with the current data", function() {
        let testData = {
            a: 1,
            b: 2
        };
        let compareData = {
            c: 3,
            d: 4
        };
        let dataThatAlsoWouldFit = {
            c: 5,
            d: 6
        };

        expect(checkIfDataMatchesData(testData, compareData, [testData, compareData, dataThatAlsoWouldFit])).to.equal(possibillityEnum.Possible);
    });

    it("should be definitive if there is another set which would also fit, but it has a conflicting dependency", function() {
        let testData = {
            a: 1,
            b: 2
        };
        let compareData = {
            c: 3,
            d: 4
        };
        let dataThatAlsoWouldFitButForbidsIt = {
            c: 5,
            d: 6,
            dependencies: [function(data) {
                const forbiddenAValue = 1;

                return data.a != forbiddenAValue;
            }]
        };

        expect(checkIfDataMatchesData(testData, compareData, [testData, compareData, dataThatAlsoWouldFitButForbidsIt])).to.equal(possibillityEnum.Definitive);
    });
});
