// here writing API polyfill using XMLHttpRequest
(function (global) {
  if (global.fetch) {
    return;
  }

  // headers class implementation
  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ", " + value : value;
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  function normalizeName(name) {
    if (typeof name !== "string") {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError("Invalid character in header field name");
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== "string") {
      value = String(value);
    }
    return value;
  }

  // response class implementation
  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = "default";
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = "statusText" in options ? options.statusText : "OK";
    this.headers = new Headers(options.headers);
    this.url = options.url || "";
    this._initBody(bodyInit);
  }

  Response.prototype._initBody = function (body) {
    this._bodyInit = body;
    if (!body) {
      this._bodyText = "";
    } else if (typeof body === "string") {
      this._bodyText = body;
    } else {
      this._bodyText = body;
    }
  };

  Response.prototype.text = function () {
    return Promise.resolve(this._bodyText);
  };

  Response.prototype.json = function () {
    return this.text().then(JSON.parse);
  };

  // request class implementation
  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || "omit";
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || "GET");
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === "GET" || this.method === "HEAD") && body) {
      throw new TypeError("Body not allowed for GET or HEAD requests");
    }
    this._initBody(body);
  }

  Request.prototype._initBody = Response.prototype._initBody;

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"].indexOf(
      upcased
    ) > -1
      ? upcased
      : method;
  }

  // fetch function implementation
  function fetch(input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
        };
        options.url =
          "responseURL" in xhr
            ? xhr.responseURL
            : options.headers.get("X-Request-URL");
        var body = "response" in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };

      xhr.ontimeout = function () {
        reject(new TypeError("Network request failed"));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === "include") {
        xhr.withCredentials = true;
      } else if (request.credentials === "omit") {
        xhr.withCredentials = false;
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(
        typeof request._bodyInit === "undefined" ? null : request._bodyInit
      );
    });
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(":");
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  // export to global scope
  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
})(typeof self !== "undefined" ? self : this);
