#!/bin/bash

cp .env.default .env

curl https://raw.githubusercontent.com/jwilder/nginx-proxy/master/nginx.tmpl > nginx.tmpl
