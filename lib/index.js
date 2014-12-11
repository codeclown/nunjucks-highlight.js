module.exports = function NunjucksCodeHighlight(nunjucks, hljs) {
    this.tags = ['code'];

    this.parse = function(parser, nodes) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('endcode');

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function(context, body) {
        var htmlResult = '';
        try {
            var result = hljs.highlightAuto(body().toString());
            htmlResult += '<pre><code>';
            htmlResult += result.value;
            htmlResult += '</code></pre>';
            htmlResult = new nunjucks.runtime.SafeString(htmlResult);
        } catch (error) {
            htmlResult = undefined;
            throw new Error('Error rendering highlighted code');
        }
        return htmlResult;
    };
};
