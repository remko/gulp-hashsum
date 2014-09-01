/* globals module: true, process: false, Buffer: false */

"use strict";

var buffertools = require("buffertools");
var crypto = require("crypto");
var gutil = require("gulp-util");
var _ = require("lodash");
var mkdirp = require("mkdirp");
var slash = require("slash");
var through = require("through");

var fs = require("fs");
var path = require("path");

function hashsum(options) {
	options = _.defaults(options || {}, {
		dest: process.cwd(),
		hash: "sha1",
		force: false
	});
	options = _.defaults(options, { filename: options.hash.toUpperCase() + "SUMS" });

	var hashesFilePath = path.resolve(options.dest, options.filename);
	var hashes = {};

	function processFile(file) {
		if (file.isNull()) {
			return;
		}
		if (file.isStream()) {
			this.emit("error", new gutil.PluginError("gulp-hashsum", "Streams not supported"));
			return;
		}
		var filePath = path.resolve(options.dest, file.path);
		hashes[slash(path.relative(path.dirname(hashesFilePath), filePath))] = crypto
			.createHash(options.hash)
			.update(file.contents, "binary")
			.digest("hex");

		this.push(file);
	}

	function writeSums() {
		var lines = _.keys(hashes).sort().map(function (key) { 
			return hashes[key] + "  " + key + "\n";
		});
		var data = new Buffer(lines.join(""));

		if (options.force || !fs.existsSync(hashesFilePath) || buffertools.compare(fs.readFileSync(hashesFilePath), data) !== 0) {
			mkdirp(path.dirname(hashesFilePath));
			fs.writeFileSync(hashesFilePath, data);
		}
		this.emit("end");
	}

	return through(processFile, writeSums);
}

module.exports = hashsum;
