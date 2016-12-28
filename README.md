# hazybits-js

**hazybits-js** is JavaScript SDK that can be used in both nodejs and browser environments to access
[HazyBits](https://hazybits.com) infrastructure.

[Read more about the features](https://hazybits.com).

# API Reference

<a name="HazyBitsClient"></a>

## HazyBitsClient
**Kind**: global class  

* [HazyBitsClient](#HazyBitsClient)
    * [new HazyBitsClient(entryUrl)](#new_HazyBitsClient_new)
    * [.start(base64)](#HazyBitsClient+start)
    * [.connect(callback)](#HazyBitsClient+connect)

<a name="new_HazyBitsClient_new"></a>

### new HazyBitsClient(entryUrl)
Creates Hazy Bits client object.


| Param | Description |
| --- | --- |
| entryUrl | Hazy Bits entry point URL. |

<a name="HazyBitsClient+start"></a>

### hazyClient.start(base64)
Starts processing workflow using provided image as input.

**Kind**: instance method of <code>[HazyBitsClient](#HazyBitsClient)</code>  

| Param | Description |
| --- | --- |
| base64 | Image in base64 form. |

<a name="HazyBitsClient+connect"></a>

### hazyClient.connect(callback)
Connects to Hazy Bits infrastructure and creates new session.

**Kind**: instance method of <code>[HazyBitsClient](#HazyBitsClient)</code>  

| Param | Description |
| --- | --- |
| callback | Completion callback. |


* * *

&copy; 2016 [HazyBits](https://hazybits.com). Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).