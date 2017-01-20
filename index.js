'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const awsIot = require('aws-iot-device-sdk');
const util = require('util');
const uuid = require('uuid');
const jwtDecoder = require('jwt-decode');

const EventEmitter = require('events').EventEmitter;

/**
 * Creates Hazy Bits client object.
 * @param {string=} entryUrl=https://api.hazybits.com Hazy Bits API entry point URL.
 * @constructor
 * @typicalname hazyClient
 */
function HazyBitsClient(entryUrl) {

  entryUrl = entryUrl ? entryUrl : 'https://api.hazybits.com';

  // TODO: should be a better way to support both HTTP and HTTPS
  const parsedUrl = url.parse(entryUrl);
  const httpClient = (parsedUrl.protocol === 'http:') ? http : https;

  const me = this;
  let bearerToken = '';

  // unique topic ID for current session
  const iotTopic = `/hazybits/session/${uuid.v4()}`;
  let iotClient = null;

  this.send = function send(message) {
    iotClient.publish(iotTopic, message);
  };

  /**
   * Callback signature for {@link HazyBitsClient.connect} method.
   * @callback HazyConnectCallback
   * @param {object} err Connection error, if any.
   * @param {HazyBitsClient} client Initialized HazyBits client instance.
   */

  /**
   * Connects to Hazy Bits infrastructure and creates new session.
   * @param {string} authToken Authentication token.
   * @param {HazyConnectCallback=} callback Completion callback.
   * @returns {undefined}
   */
  this.connect = function connect(authToken, callback) {
    //TODO: manage token expiration.
    let decodedToken  = jwtDecoder(authToken);

    bearerToken = authToken;

    const authUrl = url.resolve(entryUrl, '/login');
    // request IoT access keys
    httpClient.get(authUrl, function(response) {
      // Continuously update stream with data
      let body = '';
      response.on('data', function(data) {
        body += data;
      });

      response.on('end', function() {
        // Data reception is done, do whatever with it!
        const session = JSON.parse(body);

        // Connect to IoT infrastructure
        iotClient = awsIot.device({
          region: session.region,
          protocol: 'wss',
          accessKeyId: session.accessKey,
          secretKey: session.secretKey,
          sessionToken: session.sessionToken,
          host: session.iotEndpoint,
          port: 443
        });

        iotClient.on('connect', function() {
          console.log('subscribing to topic: ' + iotTopic);
          // subscribe to IoT events
          iotClient.subscribe(iotTopic);
          me.emit('connect');
        });

        iotClient.on('message', function(topic, message) {
          me.emit('message', message);
        });

        iotClient.on('error', function(error) {
          me.emit('error', error);
        });

        //iotClient.on('reconnect', onReconnect);
        //iotClient.on('offline', onOffline);
        //iotClient.on('close', onClose);

        callback(null, me);
      });
    }).on('error', function(err) {
      callback(err);
    });
  };

  /**
   * Starts processing workflow using provided image as input.
   * @param base64 Image in base64 form.
   * @returns {undefined}
   */
  this.start = function start(base64) {

    // TODO: in real life we need to get URLs from server after we started new session. Hardcoded for now.
    const startUrl = url.resolve(entryUrl, '/start');
    const parsedUrl = url.parse(startUrl);

    // An object of options to indicate where to post to
    const post_options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(base64),
        'Authorization': 'Bearer ' + bearerToken
      }
    };

    // Set up the request
    const post_req = httpClient.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });
    });

    // post the data
    const postData = JSON.stringify({base64: base64, topic: iotTopic});
    post_req.write(postData);
    post_req.end();
  };
}

util.inherits(HazyBitsClient, EventEmitter);
module.exports = HazyBitsClient;
