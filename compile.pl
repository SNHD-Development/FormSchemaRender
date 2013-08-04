#!/usr/bin/perl

# Build Script that run two commands at once
#
# 1. Compile template to js with `perl js/libs/parsetmpl.pl`

system("perl js/libs/parsetmpl.pl");

#
# 2. Minified with r.js with `r.js -o js/libs/build.js`

system("r.js -o js/libs/build.js");

exit;
