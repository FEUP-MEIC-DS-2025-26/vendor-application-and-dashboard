export default {
  id: "mips_vendor",
  name: "mips_vendor",
  metaData: {
    name: "mips_vendor",
    type: "app",
    buildInfo: {
      buildVersion: "1.0.0",
      buildName: "mips_vendor"
    },
    remoteEntry: {
      name: "remoteEntry.js",
      path: "",
      type: "global"
    },
    types: {
      path: "",
      name: "",
      zip: "@mf-types.zip",
      api: "@mf-types.d.ts"
    },
    globalName: "mips_vendor",
    pluginVersion: "0.21.6",
    prefetchInterface: false,
    publicPath: "auto"
  },
  shared: [
    // You can fill this with your shared dependencies and their versions if needed
  ],
  remotes: [],
  exposes: [
    {
      id: "mips_vendor:VendorRegister",
      name: "VendorRegister",
      assets: {
        js: { sync: ["static/js/async/__federation_expose_VendorRegister.js"], async: [] },
        css: { sync: [], async: [] }
      },
      path: "./VendorRegister"
    },
    {
      id: "mips_vendor:Dashboard",
      name: "Dashboard",
      assets: {
        js: { sync: ["static/js/async/__federation_expose_Dashboard.js"], async: [] },
        css: { sync: [], async: [] }
      },
      path: "./Dashboard"
    }
  ]
};
