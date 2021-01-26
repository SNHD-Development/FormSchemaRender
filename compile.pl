#!/usr/bin/perl

use Config;

# print "$Config{osname}\n";
# print "$Config{archname}\n";

# Please install r.js
# npm install -g requirejs

# Build Script that run two commands at once
#
# 1. Compile template to js with `perl js/libs/parsetmpl.pl`

system("perl js/libs/parsetmpl.pl");

#
# 2. Minified with r.js with `r.js -o js/libs/build.js`

if( "$Config{osname}" eq 'msys' ) {
    print "process with windows command";
    system("./node_modules/.bin/r.js.cmd -o js/libs/build.js");
} else {
    print "process with linux command";
    system("r.js -o js/libs/build.js");
}

exit;
