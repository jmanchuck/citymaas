# swagger_client.FeaturesControllerApi

All URIs are relative to *https://fordkerbhack.azure-api.net*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_features_by_viewport_using_get**](FeaturesControllerApi.md#get_features_by_viewport_using_get) | **GET** /features | getFeaturesByViewport


# **get_features_by_viewport_using_get**
> CurbLR get_features_by_viewport_using_get(ocp_apim_subscription_key, viewport=viewport)

getFeaturesByViewport

### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.FeaturesControllerApi()
ocp_apim_subscription_key = 'ocp_apim_subscription_key_example' # str | 
viewport = 'viewport_example' # str | viewport - a bounding box specified by two coordinates. First coordinate is bottom left second is top right. For example 51.31159579347505,-0.43013610839850003,51.73880216751415,0.25513610839837497 (optional)

try:
    # getFeaturesByViewport
    api_response = api_instance.get_features_by_viewport_using_get(ocp_apim_subscription_key, viewport=viewport)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling FeaturesControllerApi->get_features_by_viewport_using_get: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ocp_apim_subscription_key** | **str**|  | 
 **viewport** | **str**| viewport - a bounding box specified by two coordinates. First coordinate is bottom left second is top right. For example 51.31159579347505,-0.43013610839850003,51.73880216751415,0.25513610839837497 | [optional] 

### Return type

[**CurbLR**](CurbLR.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

