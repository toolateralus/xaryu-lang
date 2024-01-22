#!/bin/bash

current_dir=$(pwd)

echo "installing 'xaryu-lang'"

cmd="alias xaryu='$current_dir/main.js'"

if ! grep -q "$cmd" ~/.bashrc; then
    echo "$cmd" >> ~/.bashrc
fi

source ~/.bashrc

echo "done. use the 'xaryu {in-filename} {out-filename}' command to compile xaryuscripts."