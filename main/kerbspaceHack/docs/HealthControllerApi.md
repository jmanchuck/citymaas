# swagger_client.HealthControllerApi

All URIs are relative to *https://fordkerbhack.azure-api.net*

Method | HTTP request | Description
------------- | ------------- | -------------
[**message_using_get**](HealthControllerApi.md#message_using_get) | **GET** /health | message


# **message_using_get**
> str message_using_get()

message

### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.HealthControllerApi()

try:
    # message
    api_response = api_instance.message_using_get()
    pprint(api_response)
except ApiException as e:
    print("Exception when calling HealthControllerApi->message_using_get: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

**str**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

