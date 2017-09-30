const gulp = require("gulp");
const sequence = require("gulp-sequence");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const server = require("gulp-live-server");
const eslint = require("gulp-eslint");
const beautify = require("gulp-beautify");
const babel = require("gulp-babel");
const babelPresetEnv = require("babel-preset-env");
const babelTransformerAmd = require("babel-plugin-transform-es2015-modules-amd");

const eslintRc = require("./.eslintrc.json");

const ALL_JS_FILES = "*.js";
const JS_DEV_SOURCE = "./dev";
const JS_SOURCE = "./src";
const JS_DESTINATION = "./dist";

gulp.task("lint", function() {
    return gulp.src(`${JS_SOURCE}/${ALL_JS_FILES}`)
        .pipe(eslint(eslintRc))
        .pipe(eslint.format())
        .pipe(notify(function(file) {
            const SINGULAR = 1;
            let result = false;

            if (file.eslint.warningCount + file.eslint.errorCount) {
                result = {
                    title: "",
                    message: file.eslint.messages.map(message => {
                        let severityMessage = "";
                        const SEVERITY = {
                            Error: 0,
                            Warning: 1
                        };

                        switch (message.severity) {
                            case SEVERITY.Error:
                                severityMessage = "Error";
                                break;

                            case SEVERITY.Warning:
                                severityMessage = "Warning";
                                break;

                            default:
                                severityMessage = "Info";
                                break;
                        }

                        return `${severityMessage}: ${message.message}`;
                    }).join("\n")
                };

                if (file.eslint.errorCount) {
                    let multipleErrors = file.eslint.errorCount > SINGULAR;

                    result.title = `ESLint found ${!multipleErrors?"an":""} error${multipleErrors?"s":""}"`;
                } else {
                    result.title = "ESLint something to warn you about in your code.";
                }
            }

            return result;
        }))
        .pipe(eslint.failAfterError());
});

gulp.task("beautify", function() {
    return gulp.src(`${JS_DEV_SOURCE}/${ALL_JS_FILES}`)
        .pipe(plumber())
        .pipe(beautify())
        .pipe(eslint({
            fix: true
        }))
        .pipe(gulp.dest(JS_SOURCE));
});

gulp.task("build", function() {
    return gulp.src(`${JS_SOURCE}/${ALL_JS_FILES}`)
        .pipe(plumber())
        .pipe(babel({
            presets: [babelPresetEnv],
            plugins: [babelTransformerAmd]
        }))
        .pipe(gulp.dest(JS_DESTINATION))
        .pipe(notify("Build done."));
});

gulp.task("develop", function(callback) {
    return sequence("beautify", ["lint", "build"], callback);
});

gulp.task("watch-develop", function() {
    return gulp.watch(`${JS_DEV_SOURCE}/${ALL_JS_FILES}`, ["develop"]);
});

gulp.task("serve-develop", function() {
    let serverInst = server.static("./"); //equals to gls.static('public', 3000);

    serverInst.start();

    return gulp.watch(`${JS_DEV_SOURCE}/${ALL_JS_FILES}`, ["develop"], function(file) {
        serverInst.notify(file);
    });
});
