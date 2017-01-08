var HazyBitsClient = require(__dirname + '/../index.js');

describe('HazyBits Client Tests', function(){
  this.timeout(20000);
  this.slow(5000);

  it('should connect successfully', function(done) {

    const authUrl = 'https://17w67330tb.execute-api.eu-west-1.amazonaws.com/dev/iot/keys';
    const client = new HazyBitsClient(authUrl);

    client.connect('dummytoken', function(err) {
      if (err) done(err);

      client.on('connect', function() {
        console.log('connected');
        client.send('test message');
      });
      client.on('error', function(error) {
        done(error);
      });
      client.on('message', function(message) {
        console.log(`message: ${message}`);
        done();
      });
    });
  });
});
