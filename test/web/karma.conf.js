module.exports = function(config) {
    config.set({
        basePath: "../../",
        frameworks: ["mocha", "chai"],
        files: ["dist/test/webdav.js", "test/web/specs/index.js", "test/web/specs/*.spec.js"],
        exclude: [],
        preprocessors: {},
        reporters: ["dots"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        customLaunchers: {
            CustomChrome: {
                base: "Chrome",
                flags: ["--disable-web-security"],
                debug: true
            }
        },
        browsers: ["CustomChrome"],
        singleRun: true
    });
};
