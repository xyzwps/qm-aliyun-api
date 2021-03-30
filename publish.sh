#!/bin/bash

echo 1. Try to login
npm login

echo 2. Use default registry
npm config set registry=http://registry.npmjs.org

echo 3. Publish
npm publish