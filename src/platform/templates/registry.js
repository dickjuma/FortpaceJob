// src/templates/registry.js
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const sharedHelper = require('./helpers/sharedVariables');

// Load all .hbs templates recursively under src/templates
const templatesDir = path.resolve(__dirname);

function loadTemplates(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const map = {};
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(map, loadTemplates(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
      const relative = path.relative(templatesDir, fullPath);
      const key = relative.replace(/\\/g, '/').replace(/\.hbs$/, '');
      const source = fs.readFileSync(fullPath, 'utf8');
      const template = Handlebars.compile(source);
      map[key] = template;
    }
  }
  return map;
}

const templateMap = loadTemplates(templatesDir);

module.exports = {
  /**
   * Retrieve a compiled Handlebars template by key.
   * @param {string} key e.g., 'layouts/BaseEmailLayout' or 'auth/welcome'
   */
  getTemplate(key) {
    return templateMap[key];
  },
  /**
   * Resolve shared variables for a payload.
   */
  async getSharedVariables(payload) {
    // Example shared vars – can be extended later.
    return sharedHelper(payload);
  },
};
