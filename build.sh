#!/usr/bin/env bash

for f in */manifest.json; do
	name=${f%/*};
	if [ -e $name.zip ]; then
			rm $name.zip
	fi
	zip -r $name.zip $(git ls-files $name)
done
