import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { join, extname, basename, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");
const SRC_DIR = join(__dirname, "src");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const SOURCE_EXTENSIONS = new Set([".astro", ".ts"]);

// 1. Recursively find all files with given extensions
async function findFiles(dir, extensions) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findFiles(fullPath, extensions)));
    } else if (extensions.has(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

// 2. Convert images to webp
async function convertImages() {
  const images = await findFiles(PUBLIC_DIR, IMAGE_EXTENSIONS);

  if (images.length === 0) {
    console.log("No images found to convert.");
    return [];
  }

  console.log(`Found ${images.length} images to convert.\n`);

  const converted = [];

  for (const imgPath of images) {
    const ext = extname(imgPath);
    const webpPath = imgPath.slice(0, -ext.length) + ".webp";

    try {
      const originalStats = await stat(imgPath);
      const originalSize = originalStats.size;

      await sharp(imgPath).webp({ quality: 80 }).toFile(webpPath);

      const newStats = await stat(webpPath);
      const newSize = newStats.size;

      const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
      const relPath = relative(__dirname, imgPath);

      console.log(
        `${relPath} -> .webp | ${formatSize(originalSize)} -> ${formatSize(newSize)} (${savings}% saved)`
      );

      converted.push({
        original: imgPath,
        webp: webpPath,
        originalName: basename(imgPath),
        webpName: basename(webpPath),
      });
    } catch (err) {
      console.error(`Error converting ${imgPath}: ${err.message}`);
    }
  }

  return converted;
}

// 3. Update references in source files
async function updateReferences(converted) {
  if (converted.length === 0) return;

  const sourceFiles = await findFiles(SRC_DIR, SOURCE_EXTENSIONS);
  console.log(`\nUpdating references in ${sourceFiles.length} source files...\n`);

  let totalReplacements = 0;

  for (const srcFile of sourceFiles) {
    let content = await readFile(srcFile, "utf-8");
    let modified = false;

    for (const { originalName, webpName } of converted) {
      if (content.includes(originalName)) {
        content = content.replaceAll(originalName, webpName);
        modified = true;
        totalReplacements++;
      }
    }

    if (modified) {
      await writeFile(srcFile, content, "utf-8");
      console.log(`Updated: ${relative(__dirname, srcFile)}`);
    }
  }

  console.log(`\nTotal files updated: ${totalReplacements}`);
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

// Run
console.log("=== Image Optimization Script ===\n");

const converted = await convertImages();
await updateReferences(converted);

console.log("\nDone!");
