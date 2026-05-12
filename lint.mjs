import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const ignoredDirectories = new Set([".git", "dist", "node_modules"]);
const checkedExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".yml"]);
const problems = [];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await collectFiles(fullPath)));
      }
      continue;
    }

    if (entry.isFile() && checkedExtensions.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function relativePath(filePath) {
  return filePath.replace(`${root}/`, "");
}

for (const filePath of await collectFiles(root)) {
  const content = await readFile(filePath, "utf8");
  const lines = content.split("\n");

  if (!content.endsWith("\n")) {
    problems.push(`${relativePath(filePath)} must end with a newline.`);
  }

  lines.forEach((line, index) => {
    if (/\s+$/.test(line)) {
      problems.push(`${relativePath(filePath)}:${index + 1} has trailing whitespace.`);
    }
  });
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log("Lint checks passed.");
