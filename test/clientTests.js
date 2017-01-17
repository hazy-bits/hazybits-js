var HazyBitsClient = require(__dirname + '/../index.js');

describe('HazyBits Client Tests', function(){
  this.timeout(20000);
  this.slow(5000);

  it('should connect successfully', function(done) {

    const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjEzMDA4MTkzODAsIm5hbWUiOiJDaHJpcyBTZXZpbGxlamEiLCJhZG1pbiI6dHJ1ZX0.' +
      '03f329983b86f7d9a9f5fef85305880101d5e302afafa20154d094b229f75773';

    const client = new HazyBitsClient();
    client.connect(dummyToken, function(err) {
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
