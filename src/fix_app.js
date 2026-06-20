const fs = require('fs');
const path = 'C:\\Users\\USER\\Desktop\\Fort-space\\fortefrontend\\src\\App.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import ClientPublicProfile from './client/pages/ClientPublicProfile';",
  "import ClientPublicProfile from './client/pages/ClientPublicProfileV2';"
);

content = content.replace(
  "import ClientCompanyProfilePage from './client/pages/ClientCompanyProfilePage';\r\n",
  ""
);
content = content.replace(
  "import ClientCompanyProfilePage from './client/pages/ClientCompanyProfilePage';\n",
  ""
);

content = content.replace(
  "import ClientSetupWizard from './client/pages/ClientSetupWizard';\r\n",
  ""
);
content = content.replace(
  "import ClientSetupWizard from './client/pages/ClientSetupWizard';\n",
  ""
);

content = content.replace(
  "<Route path=\"/client/company-profile\" element={<ClientProtectedRoute><ClientLayout><ClientCompanyProfilePage /></ClientLayout></ClientProtectedRoute>} />\r\n",
  ""
);
content = content.replace(
  "<Route path=\"/client/company-profile\" element={<ClientProtectedRoute><ClientLayout><ClientCompanyProfilePage /></ClientLayout></ClientProtectedRoute>} />\n",
  ""
);

content = content.replace(
  "        <Route path=\"/client/setup-wizard\" element={<ClientProtectedRoute><ClientSetupWizard /></ClientProtectedRoute>} />\r\n",
  ""
);
content = content.replace(
  "        <Route path=\"/client/setup-wizard\" element={<ClientProtectedRoute><ClientSetupWizard /></ClientProtectedRoute>} />\n",
  ""
);

fs.writeFileSync(path, content, 'utf8');
console.log("App.jsx fixed successfully.");
