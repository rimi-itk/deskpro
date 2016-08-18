#!/usr/bin/env bash

for f in */manifest.json; do
	name=${f%/*};
	zip -r $name.zip $name/
done
