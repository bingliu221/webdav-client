const joinURL = require("url-join");
const { merge } = require("../merge.js");
const responseHandlers = require("../response.js");
const { encodePath, prepareRequestOptions, request } = require("../request.js");
const { fromBase64 } = require("../encode.js");
const stream = require("stream");

function getPutContentsDefaults() {
    return {
        headers: {
            "Content-Type": "application/octet-stream"
        },
        overwrite: true
    };
}

function putFileContents(filePath, data, options) {
    const headers = {};
    if (data.length) {
        headers["Content-Length"] = data.length;
    }
    const putOptions = merge(getPutContentsDefaults(), { headers }, options || {});
    if (putOptions.overwrite === false) {
        putOptions.headers["If-None-Match"] = "*";
    }
    const requestOptions = {
        url: joinURL(options.remoteURL, encodePath(filePath)),
        method: "PUT",
        headers: putOptions.headers,
        data
    };
    prepareRequestOptions(requestOptions, options);
    return request(requestOptions).then(responseHandlers.handleResponseCode);
}

function getFileUploadLink(filePath, options) {
    let url = joinURL(options.remoteURL, encodePath(filePath));
    url += "?Content-Type=application/octet-stream";
    const protocol = /^https:/i.test(url) ? "https" : "http";
    if (options.headers && options.headers.Authorization) {
        if (/^Basic /i.test(options.headers.Authorization) === false) {
            throw new Error("Failed retrieving download link: Invalid authorisation method");
        }
        const authPart = options.headers.Authorization.replace(/^Basic /i, "").trim();
        const authContents = fromBase64(authPart);
        url = url.replace(/^https?:\/\//, `${protocol}://${authContents}@`);
    }
    return url;
}

module.exports = {
    getFileUploadLink,
    putFileContents
};
