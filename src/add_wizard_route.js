const fs = require('fs');
const path = 'C:\\Users\\USER\\Desktop\\Fort-space\\fortefrontend\\src\\App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes("import ClientSetupWizard from './client/pages/ClientSetupWizard';")) {
  content = content.replace(
    "import ClientProfileRouter from './client/pages/ClientProfileRouter';",
    "import ClientProfileRouter from './client/pages/ClientProfileRouter';\nimport ClientSetupWizard from './client/pages/ClientSetupWizard';"
  );
}

// 2. Add Route
if (!content.includes('<Route path="/client/setup"')) {
  content = content.replace(
    "<Route path=\"/client/profile\" element={<ClientProtectedRoute><ClientLayout><ClientProfileRouter /></ClientLayout></ClientProtectedRoute>} />",
    "<Route path=\"/client/profile\" element={<ClientProtectedRoute><ClientLayout><ClientProfileRouter /></ClientLayout></ClientProtectedRoute>} />\n<Route path=\"/client/setup\" element={<ClientProtectedRoute><ClientLayout><ClientSetupWizard /></ClientLayout></ClientProtectedRoute>} />"
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log("App.jsx updated with ClientSetupWizard route.");
