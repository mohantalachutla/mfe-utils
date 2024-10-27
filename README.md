## This is a mfe-utils library to configure MicroFrontend using Webpack ModuleFederationPlugin


## Installation

```bash
npm install @mohantalachutla/mfe-utils
```

## Usage
#### Import configureMFPlugin from @mohantalachutla/mfe-utils in your MF client project's webpack.config.js
```javascript
const {configureMFPlugin} = require("@mohantalachutla/mfe-utils").default;
```


#### Call configureMFPlugin in your MF client project webpack.config.js
```javascript
configureMFPlugin(ModuleFederationPlugin)(
  "mfe_product",
  "remoteEntry.js",
  {
    "mfe_product": "mfe_product@http://localhost:8082/remoteEntry.js",
  },
  {
    shared: {
      react: {
        requiredVersion: deps.react,
        singleton: true,
      },
      "react-dom": {
        requiredVersion: deps["react-dom"],
        singleton: true,
      },
    }
  }
) 
```

#### import configureMFRemotePlugin from @mohantalachutla/mfe-utils in your MF host project's webpack.config.js
```javascript
const {configureMFRemotePlugin} = require("@mohantalachutla/mfe-utils").default;
```

#### Call configureMFRemotePlugin in your MF host project webpack.config.js
```javascript
configureMFRemotePlugin(ModuleFederationPlugin)(
  "mfe_product",
  "mfe_product@http://localhost:8082/remoteEntry.js",
  {
    shared: {
      react: {
        requiredVersion: deps.react,
        singleton: true,
      },
      "react-dom": {
        requiredVersion: deps["react-dom"],
        singleton: true,
      },
    }
  }
);
```
#### loadMfe to import a module federation component
```javascript
const {loadMfe} = require("@mohantalachutla/mfe-utils").default;
loadMfe("http://localhost:8082/remoteEntry.js", "mfe_product", "./App").then((Component) => {
  mount(Component, document.getElementById("root"));
})
```

#### sendEvent to send events from MF client to MF host and vice versa
```javascript 
const {sendEvent} = require("@mohantalachutla/mfe-utils");
sendEvent("mfe_product_event", "Hello from host to client");
sendEvent("mfe_host_event", "Hello from client to host");
```

#### subscribeEvent to subscribe events from MF client to MF host and vice versa
```javascript 
const {sendEvent} = require("@mohantalachutla/mfe-utils");
subscribeEvent("mfe_product_event", (data) => {
  console.log(data);
});
```
