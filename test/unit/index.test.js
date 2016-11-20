var assert = require('chai').assert,
    fs = require('fs'),
    sinon = require('sinon'),
    hljs = require('highlight.js'),
    NunjucksCodeHighlight = require('../../lib/index.js'),
    nunjucks = require('nunjucks');

describe('NunjucksCodeHighlight', function () {

    // hooks

    beforeEach(function() {
        this.sinon = sinon.sandbox.create();
    });

    afterEach(function(){
        this.sinon.restore();
    });

    // tests

    it('should export a function', function () {
        assert.isFunction(NunjucksCodeHighlight);
    });

    it('should compile highlight.js sample code as expected', function(done) {
        var input = fs.readFileSync('test/fixture/input.html').toString();
        var output = fs.readFileSync('test/fixture/output.html').toString();
        var env = new nunjucks.Environment();
        var highlight = new NunjucksCodeHighlight(nunjucks, hljs);
        env.addExtension('NunjucksCodeHighlight', highlight);
        env.renderString(input, function(err, htmlString) {
            assert.isString(htmlString);
            assert.strictEqual(htmlString, output);
            done(err);
        });
    });

    it('should display expected error messages', function(done) {
        var dataBuffer = fs.readFileSync('test/fixture/input.html');
        var templateHtml = dataBuffer.toString();
        var env = new nunjucks.Environment();
        sinon.stub(hljs, 'highlightAuto').throwsException();
        var highlight = new NunjucksCodeHighlight(nunjucks, hljs);
        env.addExtension('NunjucksCodeHighlight', highlight);
        env.renderString(templateHtml, function(err, htmlString) {
            assert.isUndefined(htmlString);
            assert.isString(err.message);
            done();
        });
    });
});
