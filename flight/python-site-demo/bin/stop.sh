#!/bin/bash

lsof -i:8080 | grep LISTEN | awk '{print $2}' | xargs kill 
