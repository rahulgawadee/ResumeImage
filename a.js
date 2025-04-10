const fs = require("fs");
const path = require("path");

const structure = {
  "pages": {
    "index.js": "",
    "about.js": "",
    "api": {
      "hello.js": "",
    },
  },
  "components": {
    "Navbar.js": "",
    "Footer.js": "",
  },
  "lib": {
    "apiClient.js": "",
  },
  "hooks": {
    "useAuth.js": "",
  },
  "styles": {
    "globals.css": "",
    "Home.module.css": "",
  },
  "public": {
    "favicon.ico": "",
  },
  ".env.local": "",
  "next.config.js": "",
  "tailwind.config.js": "",
  "package.json": "",
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

console.log("✅ Project structure created successfully.");
