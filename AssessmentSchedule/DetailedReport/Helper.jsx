function Helper() {
    var
        self = this;
};

Helper.prototype.getInstance = function () {
    var
        unique;
    return function () {
        if (!unique) return new Helper();
        else return unique;
    }
};

Helper.prototype.fetchUtil = function (options, errorFun) {
    var
        request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            //credentials: "same-origin",
            body: options.data
        };
    if (options.method)
        request.method = options.method;
    if (options.cache)
        request.cache = options.cache;
    if (options.targetComponent) {
        var defaultUrlPrefix = CommonUtil.getTargetUrlPrefix(options.targetComponent);
        if (options.url.indexOf("/") == 0) {
            options.url = defaultUrlPrefix + options.url;
        }
        else {
            options.url = defaultUrlPrefix + "/" + options.url;
        }
    }
    return fetch(options.url, request)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                if (response.status == 401)
                    console.log('error 401')
                else if (response.status == 400)
                    console.log('error 400')
                if (errorFun)
                    errorFun(response);
                else
                    throw new Error(response.statusText);
            }
        }).then(function (dataStr) {
            if (dataStr == null || dataStr == '')
                return null;
            else
                return JSON.parse(dataStr);
        });
}

Helper.prototype.PromiseUtil = function (options) {
    if (typeof options != 'object') return;
    return Promise.all(options.map(option => {
        var
            request = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: option.data
            };
        if (options.method)
            request.method = option.method;
        if (options.cache)
            request.cache = option.cache;
        fetch(request.url, request).then(res => res.text());
    }));
}

var
    helper = new Helper();
window.fetchUtil = helper.fetchUtil;
window.PromiseUtil = helper.PromiseUtil;
helper.getInstance()();


Array.prototype.uniqueBaseValue = function () {
    var
        arr = [],
        hash = {};
    for (var i = 0; this[i] != void 0; i++) {
        if (!hash[this[i].value]) {
            hash[this[i].value] = true;
            arr.push(this[i]);
        };
    };
    return arr;
};
