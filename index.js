'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const awsIot = require('aws-iot-device-sdk');
const util = require('util');
//const jwtDecoder = require('jwt-decode');

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
  const httpClient = parsedUrl.protocol === 'http:' ? http : https;

  const me = this;

  let bearerToken = '';
  let sessionId = '';
  let iotClient = null;

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
    //const decodedToken = jwtDecoder(authToken);
    bearerToken = authToken;

    const authUrl = entryUrl + '/login';
    const parsedUrl = url.parse(authUrl);

    // An object of options to indicate where to post to
    const post_options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + bearerToken
      }
    };

    // Set up the request
    const post_req = httpClient.request(post_options, function (response) {
      // Continuously update stream with data
      let body = '';
      response.on('data', function (data) {
        body += data;
      });

      response.on('end', function () {
        // Data reception is done, do whatever with it!
        const session = JSON.parse(body);

        // Save session id for subsequent calls
        sessionId = session.sessionId;

        // Connect to IoT infrastructure
        iotClient = awsIot.device({
          region: session.ws.region,
          protocol: 'wss',
          accessKeyId: session.ws.accessKey,
          secretKey: session.ws.secretKey,
          sessionToken: session.ws.sessionToken,
          host: session.ws.endpoint,
          port: 443
        });

        iotClient.on('connect', function () {
          // subscribe to IoT events
          iotClient.subscribe(session.ws.topic);
          me.emit('connect');
        });

        iotClient.on('message', function (topic, message) {
          me.emit('message', message);
        });

        iotClient.on('error', function (error) {
          me.emit('error', error);
        });

        //iotClient.on('reconnect', onReconnect);
        //iotClient.on('offline', onOffline);
        //iotClient.on('close', onClose);

        callback(null, me);
      });
    }).on('error', function (err) {
      callback(err, null);
    });

    // post the request
    post_req.end();
  };

  const postImage = function(endpoint, base64, callback) {

    // TODO: in real life we need to get URLs from server after we started new session. Hardcoded for now.
    const startUrl = entryUrl + '/' + endpoint;
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
        'Authorization': 'Bearer ' + bearerToken,
        'X-Hazy-Session': sessionId
      }
    };

    // Set up the request
    const post_req = httpClient.request(post_options, function (res) {
      //Initialise the variable that will store the response
      let body='';

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        callback(body);
      });
    });

    // post the data
    const postData = JSON.stringify({ image: base64 });
    post_req.write(postData);
    post_req.end();

  };

  /**
   * Starts processing workflow using provided image as input.
   * @param base64 Image in base64 form.
   * @returns {undefined}
   */
  this.start = function start(base64, callback) {
    postImage('start', base64, callback);
  };

  /**
   * Performs threshold operation over provided image.
   * @param base64 Image in base64 form.
   * @param {function=} callback Completion callback.
   * @returns {undefined}
   */
  this.threshold = function threshold(base64, callback) {
    postImage('threshold', base64, callback);
  };

  /**
   * Performs rotate operation over provided image.
   * @param base64 Image in base64 form.
   * @param {function=} callback Completion callback.
   * @returns {undefined}
   */
  this.rotate = function rotate(base64, callback) {
    postImage('rotate', base64, callback);
  };

  /**
   * Starts OCR processing over provided image.
   * @param base64 Image in base64 form.
   * @param {function=} callback Completion callback.
   * @returns {undefined}
   */
  this.ocr = function ocr(base64, callback) {
    postImage('ocr', base64, callback);
  };

}

util.inherits(HazyBitsClient, EventEmitter);
module.exports = HazyBitsClient;
