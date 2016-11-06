# MicroApps with FlyWeb API

This project utilizes the new [FlyWeb API](https://flyweb.github.io/) from Mozilla.

`FlyWeb is a project at Mozilla focused on bringing a new set of APIs to the browser for advertising and discovering local-area web servers.`

A [Live Demo](https://brakmic.com/demos/microapp/) is also available. Of course, this demo is only showcasing the app itself without the FlyWeb environment.

For a complete FlyWeb environment you'll need [Firefox Nightly](https://nightly.mozilla.org/) and [must activate](https://flyweb.github.io/#getting-started) *dom.flyweb.enabled* in *about:config*.

There's also a [Chrome Extension](https://github.com/BHSPitMonkey/flyweb-browser-chrome) for discovering FlyWeb services available.

### Project structure

**FlyWeb server** and all supporting scripts (polyfills etc.) are located under *src/init/*

<img src="http://brakmic.com/img/demos/microapps/server_files.png" width=300 height=180>

**MicroApp** and its environment are located under *src/app/*

<img src="http://brakmic.com/img/demos/microapps/microapp_files.png" width=300 height=267>

The root [Ractive](http://www.ractivejs.org/) component is located in *microapp.ts* where the whole app gets kicked off.

**FlyWeb APIs**

For nicer developer experience and more type-safety I've provided [several interfaces](https://github.com/brakmic/FlyWeb-Emoji-Tables/tree/master/src/app/interfaces/FlyWeb) that follow the [FlyWeb Spec](https://flyweb.github.io/spec/).

<img src="http://brakmic.com/img/demos/microapps/flyweb_interfaces.png" width=320 height=180>

**GitHub Emojis**

And last but not least, all of the available [GitHub Emojis](https://github.com/brakmic/FlyWeb-Emoji-Tables/tree/master/src/app/interfaces/GitHub) are strongly-typed and have their own interface and container object. Some of them have been renamed, like *100* to *_100* or *+1* to *plus1*.

**Other APIs**

Additionally, there's a simple interface to the well-known *Northwind DB* located [here](https://github.com/brakmic/FlyWeb-Emoji-Tables/tree/master/src/app/interfaces/Northwind).

### Preparing the environment

`yarn` **or** `npm install`

### Building

* FlyWeb Server

`yarn run build` **or** `npm run build`

* MicroApp

`yarn run build:microapp` **or** `npm run build:microapp`

Both of them will produce several files located in *dist/*. You can now serve the contents from it with a web-server of your choice.

### Playing with MicroApps

* Open the main page of your server in Nightly and allow FlyWeb services.

<img src="http://brakmic.com/img/demos/microapps/allow_flyweb_server.png" width=350 height=200>

* Open `Discover nearby FlyWeb services`

<img src="http://brakmic.com/img/demos/microapps/open_flyweb_apps.png" width=360 height=500>

* Select `Emojis` micro-app

<img src="http://brakmic.com/img/demos/microapps/emojis_microapp.png" width=360 height=500>

* Have fun!

<img src="http://brakmic.com/img/demos/microapps/flyweb_demo.png" width=840 height=640>

### License

[MIT](https://github.com/brakmic/FlyWeb-Emoji-Tables/blob/master/LICENSE)

