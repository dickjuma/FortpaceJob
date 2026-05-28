const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

function getFiles(dir) {
    const files = fs.readdirSync(dir);
    let jsxFiles = [];
    for (let f of files) {
        if (f.endsWith('.jsx')) {
            jsxFiles.push(f.replace('.jsx', ''));
        }
    }
    return jsxFiles;
}

const clientPages = getFiles(path.join(__dirname, 'client/pages'));
const freelancerPages = getFiles(path.join(__dirname, 'freelancer/pages'));

let newImports = [];
clientPages.forEach(p => {
    let compName = p.startsWith('Client') ? p : 'Client' + p;
    newImports.push(`import ${compName} from './client/pages/${p}';`);
});

freelancerPages.forEach(p => {
    let compName = p.startsWith('Freelancer') ? p : 'Freelancer' + p;
    newImports.push(`import ${compName} from './freelancer/pages/${p}';`);
});

content = content.replace(/<ClientLayout>\s*<([A-Za-z0-9_]+)[\s\/]*>\s*<\/ClientLayout>/g, (match, comp) => {
    let newComp = comp.startsWith('Client') ? comp : 'Client' + comp;
    return `<ClientLayout>\n              <${newComp} />\n            </ClientLayout>`;
});

content = content.replace(/<FreelancerLayout>\s*<([A-Za-z0-9_]+)[\s\/]*>\s*<\/FreelancerLayout>/g, (match, comp) => {
    let newComp = comp.startsWith('Freelancer') ? comp : 'Freelancer' + comp;
    return `<FreelancerLayout>\n              <${newComp} />\n            </FreelancerLayout>`;
});

const importTarget = 'const AdminProtectedRoute = ({ children }) => {';
if (content.includes(importTarget)) {
    content = content.replace(importTarget, newImports.join('\n') + '\n\n' + importTarget);
} else {
    console.error("Could not find insertion point for imports.");
}

fs.writeFileSync(appPath, content);
console.log('App.jsx fixed!');
