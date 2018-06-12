window.fetchUtility = function (options, errorFun) {
    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
        },
        body: options.data,
        isParseJson: true
    };

    if (userInfo && userInfo.access_token) {
        request.headers["Authorization"] = "Bearer " + userInfo.access_token;
    } else {
        if (userManager) {
            userManager.signinRedirect();
        }
    }
    Object.assign(request, options);
    if (options.targetComponent) {
        var defaultUrlPrefix = CommonUtil.getTargetUrlPrefix(options.targetComponent);
        if (options.url.indexOf("/") == 0) {
            options.url = defaultUrlPrefix + options.url;
        }
        else {
            options.url = defaultUrlPrefix + "/" + options.url;
        }
    }
    if (request.method.toLowerCase() === "get") {
        request.body = null;
    }
    return fetch(options.url, request)
        .then(function (response) {
            if (response.ok) {
                return response.text().then(function (dataString) {
                    return {
                        responseStatus: response.status,
                        responseString: dataString,
                        isParseJson: request.isParseJson,
                        isPassStatus: request.isPassStatus
                    };
                });
            } else {
                if (errorFun) {
                    errorFun(response);
                }
                else {
                    throw new Error(response.statusText);
                }
            }
        }).then(function (fetchResult) {
            var queryResult = null;
            try {
                if (fetchResult.isParseJson) {
                    if ($.isEmptyObject(fetchResult.responseString)) { queryResult = ""; }
                    else {
                        queryResult = JSON.parse(fetchResult.responseString);
                        if (fetchResult.isPassStatus) {
                            queryResult[FetchResponsePropName.status] = fetchResult.responseStatus;
                        }
                    }
                }
                else {
                    queryResult = fetchResult.responseString;
                }
            }
            catch (ex) {
                $$.error("An error happened while fetching information. Error:", ex);
            }
            return queryResult;
        });
};
