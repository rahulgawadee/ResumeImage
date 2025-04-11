const fs = require("fs");
const path = require("path");

const structure = {
  "api": {
    "upload": {
      "route.js": "",
    },
    "merge": {
      "route.js": "",
    },
    "download": {
      "route.js": "",
    },
  },
};

function createStructure(basePath, obj) {
  for (const name in obj) {
    const fullPath = path.join(basePath, name);
    if (typeof obj[name] === "string") {
      fs.writeFileSync(fullPath, obj[name]);
    } else {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      createStructure(fullPath, obj[name]);
    }
  }
}

createStructure(process.cwd(), structure);

console.log("✅ API route structure created under api/");
