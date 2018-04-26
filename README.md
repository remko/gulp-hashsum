# [gulp-hashsum: Generate checksum files with Gulp](https://el-tramo.be/gulp-hashsum)

A [Gulp](http://gulpjs.com/) plugin for generating a checksum file with the hash checksums of the
passed files. The file follows the same format as `shasum`, `sha1sum`, `md5sum`, and similar tools.

Since it only writes the file when the checksums have changed, can also be used as a timestamp.

## Installation

    npm install gulp-hashsum --save-dev

## Usage

### Generate a hash file

The following generates a file `app/SHA1SUMS` with all the SHA-1 checksums of all the
`.js` files in the `app` directory.

    var hashsum = require("gulp-hashsum");

    gulp.src(["app/**/*.js"]).
        pipe(hashsum({dest: "app"}));

The contents of the `SHA1SUMS` file will look like this:

    	3ff1f9baca7bf41fe4a12222436025c036ba88bf  main.js
    	14de86e007f14bc0c6bc9a84d21cb9da908495ae  submodule/sub.js

### Use a different hash than SHA-1

The following generates a file `app/MD5SUMS` with all the MD5 checksums of all the
`.js` files in the `app` directory.

    var hashsum = require("gulp-hashsum");

    gulp.src(["app/**/*.js"]).
        pipe(hashsum({dest: "app", hash: "md5"}));

### Use it as a timestamp

Since `gulp-hashsum` only writes the hash file whenever its content changes, you can
use it as a checksum file, e.g. to restart Passenger Phusion whenever a file changes,
by specifying `restart.txt` as the filename:

    var hashsum = require("gulp-hashsum");

    gulp.src(["app/**/*.js"]).
        pipe(hashsum({filename: "tmp/restart.txt"}));

### Stream

Instead of writing the checksum file to disk, you can stream it and pass it
to pipes:

    var hashsum = require("gulp-hashsum");

    gulp.src(["app/**/*.js"]).
        pipe(hashsum({stream: true})).
    pipe(gulp.dest("app"));

## API

### `hashsum(options)`

* **`options.dest`** - _string_  
   The destination directory of the hash file.  
   Default: `process.cwd()` (the current working directory)

* **`options.filename`** - _string_  
   The filename of the hash file.  
   Default: `<HASH-NAME>SUMS` (i.e. `SHA1SUMS` when `sha1` is used as hash function)

* **`options.hash`** - _string_  
   The hash function to use. Must be one supported by
  [crypto](https://www.npmjs.org/package/crypto).  
   Default: `sha1`

* **`options.force`** - _boolean_  
   Always overwrite the hashsum file, regardless of whether the contents changed.  
   Default: `false`

* **`options.delimiter`** - _string_  
   Separator between hashsum and filename.
  Default: `` (two spaces)

* **`options.json`** - _boolean_  
   Format hash file as a JSON object (instead of a `options.delimiter`-delimited file).
  E.g.:

        {
          "dir1/file1": "3ff1f9baca7bf41fe4a12222436025c036ba88bf",
          "dir1/file2": "14de86e007f14bc0c6bc9a84d21cb9da908495ae"
        }

Default: `false`

* **`options.stream`** - _boolean_  
   Instead of writing the file to disk, stream it (so it can be passed to later
  pipes)

  Default: `false`

## Changelog

### 1.2.0 (2018-04-16)

* Add `stream` option.

### 1.1.0 (2016-06-16)

* Add `json` option.

### 1.0.1 (2016-01-29)

* Remove `buffertools` dependency

### 1.0.0 (2014-09-29)

* Initial release
