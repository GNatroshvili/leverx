// here writing API polyfill using XMLHttpRequest
(function (global: any) {
  if (global.fetch) {
    return;
  }

  // headers class implementation

  class Headers {
    map: Record<string, string> = {};
    constructor(headers?: any) {
      if (headers instanceof Headers) {
        headers.forEach((value: string, name: string) => {
          this.append(name, value);
        });
      } else if (Array.isArray(headers)) {
        headers.forEach((header: [string, string]) => {
          this.append(header[0], header[1]);
        });
      } else if (headers) {
        Object.getOwnPropertyNames(headers).forEach((name) => {
          this.append(name, headers[name]);
        });
      }
    }
    append(name: string, value: string) {
      name = normalizeName(name);
      value = normalizeValue(value);
      const oldValue = this.map[name];
      this.map[name] = oldValue ? oldValue + ", " + value : value;
    }
    get(name: string) {
      name = normalizeName(name);
      return this.has(name) ? this.map[name] : null;
    }
    has(name: string) {
      return Object.prototype.hasOwnProperty.call(
        this.map,
        normalizeName(name)
      );
    }
    forEach(
      callback: (value: string, name: string, headers: Headers) => void,
      thisArg?: any
    ) {
      for (const name in this.map) {
        if (Object.prototype.hasOwnProperty.call(this.map, name)) {
          const value = this.map[name] ?? "";
          callback.call(thisArg, value, name, this);
        }
      }
    }
  }

  function normalizeName(name: string): string {
    if (typeof name !== "string") {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError("Invalid character in header field name");
    }
    return name.toLowerCase();
  }

  function normalizeValue(value: string): string {
    if (typeof value !== "string") {
      value = String(value);
    }
    return value;
  }

  // response class implementation

  class Response {
    type: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: Headers;
    url: string;
    _bodyInit: any;
    _bodyText: string = "";
    constructor(bodyInit: any, options?: any) {
      options = options || {};
      this.type = "default";
      this.status = options.status === undefined ? 200 : options.status;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = "statusText" in options ? options.statusText : "OK";
      this.headers = new Headers(options.headers);
      this.url = options.url || "";
      this._initBody(bodyInit);
    }
    _initBody(body: any) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = "";
      } else if (typeof body === "string") {
        this._bodyText = body;
      } else {
        this._bodyText = body;
      }
    }
    text(): Promise<string> {
      return Promise.resolve(this._bodyText);
    }
    json(): Promise<any> {
      return this.text().then(JSON.parse);
    }
  }

  // request class implementation

  class Request {
    url: string = "";
    credentials: string = "omit";
    headers: Headers = new Headers();
    method: string = "GET";
    mode: string | null = null;
    referrer: null = null;
    _bodyInit: any;
    constructor(input: any, options?: any) {
      options = options || {};
      let body = options.body;
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
    _initBody = Response.prototype._initBody;
  }

  function normalizeMethod(method: string): string {
    const upcased = method.toUpperCase();
    return ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"].indexOf(
      upcased
    ) > -1
      ? upcased
      : method;
  }

  // fetch function implementation

  function fetch(input: any, init?: any): Promise<Response> {
    return new Promise(function (resolve, reject) {
      const request = new Request(input, init);
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        const options: any = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
        };
        (options as any).url =
          "responseURL" in xhr
            ? (xhr as any).responseURL
            : options.headers.get("X-Request-URL");
        const body =
          "response" in xhr ? (xhr as any).response : (xhr as any).responseText;
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

      request.headers.forEach(function (value: string, name: string) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(
        typeof request._bodyInit === "undefined" ? null : request._bodyInit
      );
    });
  }

  function parseHeaders(rawHeaders: string): Headers {
    const headers = new Headers();
    const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach(function (line: string) {
      const parts = line.split(":");
      const key = parts.shift()?.trim();
      if (key) {
        const value = parts.join(":").trim();
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
