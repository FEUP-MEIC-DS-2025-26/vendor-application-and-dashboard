import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";

export default createModuleFederationConfig({
  name: "mips_vendor",
  filename: "remoteEntry.js",
  exposes: {
    "./VendorRegister": "./src/pages/VendorRegister.tsx",
    "./Dashboard": "./src/pages/Dashboard.tsx",
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: false,
    },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: false,
    },
    "@emotion/react": {
      singleton: true,
      requiredVersion: "^11.0.0",
    },
  }
});
