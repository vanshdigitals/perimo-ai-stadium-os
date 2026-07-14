const fs = require('fs');
const path = require('path');

// Move files
fs.mkdirSync('src/components/layouts', { recursive: true });
try { fs.renameSync('src/layouts/AdminLayout.tsx', 'src/components/layouts/AdminLayout.tsx'); } catch(e){}
try { fs.renameSync('src/layouts/Header.tsx', 'src/components/layouts/Header.tsx'); } catch(e){}
try { fs.rmdirSync('src/layouts'); } catch(e){}

fs.mkdirSync('src/features/auth/services', { recursive: true });
try { fs.renameSync('src/services/authService.ts', 'src/features/auth/services/authService.ts'); } catch(e){}

fs.mkdirSync('src/features/auth/components', { recursive: true });
try { fs.renameSync('src/components/auth/ProtectedRoute.tsx', 'src/features/auth/components/ProtectedRoute.tsx'); } catch(e){}
try { fs.rmdirSync('src/components/auth'); } catch(e){}
try { fs.rmdirSync('src/services'); } catch(e){}

// Find and Replace in all .tsx and .ts files
const scan = (dir) => {
  const items = fs.readdirSync(dir);
  for (const i of items) {
    const p = dir + '/' + i;
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      let newContent = content
        .replace(/@\/layouts\/AdminLayout/g, '@/components/layouts/AdminLayout')
        .replace(/@\/layouts\/Header/g, '@/components/layouts/Header')
        .replace(/@\/services\/authService/g, '@/features/auth/services/authService')
        .replace(/@\/components\/auth\/ProtectedRoute/g, '@/features/auth/components/ProtectedRoute');
      if (content !== newContent) {
        fs.writeFileSync(p, newContent, 'utf8');
      }
    }
  }
};
scan('src');
