#!/bin/bash

PWD=$(pwd)
ROOT=$(realpath $PWD)

if [ "$1" != "css" ]; then
    echo "BUILDING JS"

    TARGET="$ROOT/assets/app.min.js"
    SOURCE_PATH=/sources/js/
    SOURCE="${ROOT}${SOURCE_PATH}App.inc.js"
    TMP="app.tmp.js"

    echo "rebuilding $TARGET"

    if [ -e "$TARGET" ]; then
        echo "deleting $TARGET"
        rm "$TARGET"
    fi
    if [ -e "$TMP" ]; then
        echo "deleting $TMP"
        rm "$TMP"
    fi

    cat "$SOURCE" | while read LINE
    do
        DOES_IMPORT=$(echo "$LINE" | grep -P "include(\s*)\((\s*)([\"\']{1})(.*)([\"\']{1})(\s*)\)(\s*)")
        if [ -z "$DOES_IMPORT" ]; then
            echo "$LINE" >> "$TMP"
        else
            FILE=$(echo "$LINE" | sed -r "s/include(\s*)\((\s*)([\"\']{1})(.*)([\"\']{1})(\s*)\)(\s*)([\;]?)([\,]?)/\4/g")
            COMMA=$(echo "$LINE" | sed -r "s/include(\s*)\((\s*)([\"\']{1})(.*)([\"\']{1})(\s*)\)(\s*)([\;]?)([\,]?)/\9/g")
            if [[ $FILE != /* ]] ;
            then
                FILE=$SOURCE_PATH$FILE
            fi
            echo "including: $FILE"
            cat "$ROOT$FILE" >> "$TMP"
            echo "$COMMA" >> "$TMP"
        fi
    done

    echo "using uglifyjs..."
    uglifyjs "$TMP" -c -m -b max_line_len=512,beautify=false -o "$TARGET"
    rm "$TMP"
fi

if [ "$1" != "js" ]; then
    echo "BUILDING CSS"

    echo "using sass..."
    sass "$ROOT/sources/scss/master.scss" "$ROOT/assets/style.min.css" --sourcemap=none --style=compressed
fi

echo "build finished"
