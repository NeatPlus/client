#!/bin/bash
FILES="src/po/*"
for f in $FILES
do
    filename=${f##*/}
    mkdir -p src/services/locale
    yarn po2json -pF -f raw $f "src/services/locale/${filename%%.*}.json"
done
