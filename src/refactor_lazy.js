const fs = require('fs');
const file = 'C:/Users/USER/Desktop/Fort-space/fortefrontend/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const ignoredImports = ['React', 'BrowserRouter', 'Routes', 'Route', 'Navigate', 'useAuthStore', 'ErrorBoundary', 'getDashboardPathForRole', 'ClientLayout', 'FreelancerLayout', 'MarketplaceLayout', 'Layout', 'AppShell'];

let updatedContent = content.replace(/^import\s+([\w{}]+)\s+from\s+['"](.*?)['"];$/gm, (match, p1, p2) => {
  if (p1.includes('{') || ignoredImports.includes(p1) || p1 === 'Layout' || p2.includes('css')) {
    return match;
  }
  return `const ${p1} = React.lazy(() => import('${p2}'));`;
});

updatedContent = updatedContent.replace(
  /<Routes>/,
  `<ErrorBoundary>
        <React.Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14a800]"></div></div>}>
          <Routes>`
);

updatedContent = updatedContent.replace(
  /<\/Routes>/,
  `        </Routes>
        </React.Suspense>
      </ErrorBoundary>`
);

fs.writeFileSync(file, updatedContent);
console.log('App.jsx successfully refactored to Lazy Loading!');
