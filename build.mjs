import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const sourceDir = join(root, "src");
const outputDir = join(root, "dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });

const buildInfo = {
  builtAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? "local",
  source: "github-ci-cd-starter"
};

await writeFile(join(outputDir, "build-info.json"), `${JSON.stringify(buildInfo, null, 2)}\n`);

console.log(`Built ${outputDir}`);
