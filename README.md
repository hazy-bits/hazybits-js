# hazybits-js

[![Build Status](https://travis-ci.org/hazy-bits/hazybits-js.svg?branch=master)](https://travis-ci.org/hazy-bits/hazybits-js)

**hazybits-js** is JavaScript SDK that can be used in both nodejs and browser environments to access
[HazyBits](https://hazybits.com) infrastructure.

[Read more about the features](https://hazybits.com).

# API Reference

## Classes

<dl>
<dt><a href="#HazyBitsClient">HazyBitsClient</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#HazyConnectCallback">HazyConnectCallback</a> : <code>function</code></dt>
<dd><p>Callback signature for <a href="HazyBitsClient.connect">HazyBitsClient.connect</a> method.</p>
</dd>
</dl>

<a name="HazyBitsClient"></a>

## HazyBitsClient
**Kind**: global class  

* [HazyBitsClient](#HazyBitsClient)
    * [new HazyBitsClient([entryUrl])](#new_HazyBitsClient_new)
    * [.connect(authToken, [callback])](#HazyBitsClient+connect) ⇒ <code>undefined</code>
    * [.start(base64)](#HazyBitsClient+start) ⇒ <code>undefined</code>

<a name="new_HazyBitsClient_new"></a>

### new HazyBitsClient([entryUrl])
Creates Hazy Bits client object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [entryUrl] | <code>string</code> | <code>&quot;\&quot;https://api.hazybits.com\&quot;&quot;</code> | Hazy Bits API entry point URL. |

<a name="HazyBitsClient+connect"></a>

### hazyClient.connect(authToken, [callback]) ⇒ <code>undefined</code>
Connects to Hazy Bits infrastructure and creates new session.

**Kind**: instance method of <code>[HazyBitsClient](#HazyBitsClient)</code>  

| Param | Type | Description |
| --- | --- | --- |
| authToken | <code>string</code> | Authentication token. |
| [callback] | <code>[HazyConnectCallback](#HazyConnectCallback)</code> | Completion callback. |

<a name="HazyBitsClient+start"></a>

### hazyClient.start(base64) ⇒ <code>undefined</code>
Starts processing workflow using provided image as input.

**Kind**: instance method of <code>[HazyBitsClient](#HazyBitsClient)</code>  

| Param | Description |
| --- | --- |
| base64 | Image in base64 form. |

<a name="HazyConnectCallback"></a>

## HazyConnectCallback : <code>function</code>
Callback signature for [HazyBitsClient.connect](HazyBitsClient.connect) method.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>object</code> | Connection error, if any |
| client | <code>[HazyBitsClient](#HazyBitsClient)</code> | Initialized HazyBits client instance. |


* * *

&copy; 2016 [HazyBits](https://hazybits.com). Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
