.PHONY: install start build clean

install:
	npm install

start:
	npm start

build:
	npx electron-builder --mac

clean:
	rm -rf dist
