/**
 * CasperJS Test
 * Testing Address Field
 */
var _baseUrl = casper.cli.get("baseUrl");
var _timeOut = 10000;

casper.test.begin("Test - Address Field", 1, function(test) {
  casper.start(_baseUrl + '/tests/html/address.html', function() {
    /*this.echo(JSON.stringify(this.evaluate(function() {
      return document;
    }).all[0].outerHTML), 'INFO'); // Will be printed in green on the console*/
    casper.waitUntilVisible('#TestAddress', function() {
      test.assertExists('#TestAddress');
    }, null, _timeOut);
  }).run(function() {
    test.done();
  });
});