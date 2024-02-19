# BabylonAngularWebGPUBug
Installation Requirements:
If you have not used Angular CLI or Node.js on zour sztem before, install them first:

[Node Download](https://nodejs.org/en/download)
Angular CLI Setup:
```
npm install -g @angular/cli
```

Running:
```
cd BabylonAngularWebGPUBug
npm install
ng serve
```
after this the application should be running on http://localhost:4200 or similar.
Since the application is WebGPU based, Chrome Canary, Edge Canary or Firefox Nightly is needed.

The error messages that occur on Firefox Nightly as of 19/02/2024 are:

* wasm streaming compile failed: TypeError: import object field 'env' is not an Object twgsl.js:3:9901
* falling back to ArrayBuffer instantiation twgsl.js:3:9947
* failed to asynchronously prepare wasm: TypeError: import object field 'env' is not an Object twgsl.js:3:9427
* Aborted(TypeError: import object field 'env' is not an Object) twgsl.js:3:7490
* ERROR RuntimeError: Aborted(TypeError: import object field 'env' is not an Object). Build with -sASSERTIONS for more info.
