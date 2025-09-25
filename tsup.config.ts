import { defineConfig, type Options } from "tsup";

const env = process.env.NODE_ENV;

export default defineConfig(async (options: Options) => {
  return {
    banner: {
      js: "'use client'",
    },
    external: ["react", "react-dom"],

    entry: ["src/index.tsx"],
    minify: env === "production",
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: !(env == "production"),
    splitting: false,
    clean: true,
    treeshake: false,

    ...options,
  };
});
