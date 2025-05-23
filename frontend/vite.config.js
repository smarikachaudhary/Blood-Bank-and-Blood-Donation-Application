// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

//

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensures .js and .jsx files are resolved correctly
    extensions: [".js", ".jsx"],
  },
  server: {
    // Ensures Vite serves index.html for unknown routes
    historyApiFallback: true,
  },
  build: {
    // Set appropriate outDir for production builds
    outDir: "dist",
  },
});
