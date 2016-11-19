module.exports = function NunjucksCodeHighlight(nunjucks, hljs) {
    this.tags = ['code'];

    this.parse = function(parser, nodes, lexer) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // If arguments, return the fileTag constructed node
        if (args.children.length > 0)
          return new nodes.CallExtension(this, 'fileTag', args);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('endcode');

        // I found Nunjucks  to be incredibly convoluted on how to just get some data into the BlockTag function,
        // this finally worked by faking another template node.
        var tabStart = new nodes.NodeList(0, 0, [new nodes.Output(0, 0, [new nodes.TemplateData(0, 0, (tok.colno - 1))])]);

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'blockTag', args, [ body, tabStart]);
    };

    // code rendering for the file tag. Use the nunjucks.render function to render
    // the actual contents of the file. Pass the results through the code renderer.
    // this.fileTag = function(environment, file) {
    //      return new nunjucks.runtime.SafeString(...)
    //    }

    // code rendering for the block. Pretty simple, just get the body text and pass
    // it through the code renderer.
    this.blockTag = function(environment, body, tabStart) {

      var body = body();
      var spacesRegex = /^[\s]+/;
      var tabStart = tabStart(); // The column postion of the {% code %} tag.

      if (tabStart > 0) { // If the {% code %} tag is tabbed in, normalize the content to the same depth.
        body = body.split(/\r?\n/); // Split into lines.
        body = body.map(function(line) {
          var startSpaces = line.match(spacesRegex);
          if (startSpaces && startSpaces[0].length >= tabStart) { // If the content is not at the same or greater tab depth, do nothing..
            return line.slice(tabStart); // Subtract the column position from the start of the string.
          } else {
            return line;
          }
        });
        body = body.join("\n"); // Rejoin into one string.
      }

      // remove line break from start and end of string
      // <http://stackoverflow.com/a/14572494>
      body = body.replace(/^\s+|\s+$/, '');

      // get the first line of the body to see if we have a file type specified
      var value = hljs.highlightAuto(body).value;
      if (body.split('\n').length > 1) {
        var lang = hljs.getLanguage(body.split('\n')[0]);
        if (lang) {
          lang = body.split('\n')[0];
          body = body.split('\n').slice(1).join('\n');
          value = hljs.highlight(lang, body).value;
        }
      }

      return new nunjucks.runtime.SafeString('<pre><code class="hljs">' + value + ' </code></pre>');

    };
};
