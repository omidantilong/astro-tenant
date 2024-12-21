#!/bin/bash
mkdir -p dist/node_modules/
mkdir -p dist/engine/
cp -r node_modules/{react,react-dom,scheduler} dist/node_modules/
cp -r engine/{paths,refs}.json dist/engine