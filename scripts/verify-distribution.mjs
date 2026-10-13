import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const allowedTop=new Set(['.gitignore','README.md','LICENSE','INSTALLATION.md','FEATURES.md','CHANGELOG.md','catalog.json']);
const allowedScripts=new Set(['scripts/prepare-store-downloads.mjs','scripts/mirror-releases.mjs','scripts/verify-distribution.mjs']);
const componentSource=new Set(['third-party-source/cpu-host/PawnIo.cs','third-party-source/cpu-host/PawnIoModules.cs']);
for(const file of files){
  const allowed=allowedTop.has(file)||allowedScripts.has(file)||file==='.github/workflows/pages.yml'||file.startsWith('assets/')||file.startsWith('docs/screenshots/')||file.startsWith('store/')||file.startsWith('third-party-source/cpu-host/');
  if(!allowed)throw new Error('Unexpected public distribution path: '+file);
  if(/\.(?:tsx?|rs|py|cs|jsx?|mjs|cjs|ps1|cpp|h)$/.test(file)&&!allowedScripts.has(file)&&!componentSource.has(file))throw new Error('Application source is not allowed: '+file);
  if(file.endsWith('.zip')||file.endsWith('.map'))throw new Error('Archives and source maps must not be tracked: '+file);
}
const catalog=JSON.parse(readFileSync('store/catalog.json','utf8'));
if(catalog.apps.length!==1||catalog.apps[0].id!=='01a07455-935a-77ad-97a8-94f23a9f8522'||catalog.apps[0].source!==null)throw new Error('Unexpected catalog identity or source exposure');
if(readFileSync('catalog.json','utf8')!==readFileSync('store/catalog.json','utf8'))throw new Error('Catalog copies differ');
console.log('Verified '+files.length+' public download/documentation files; no application source tree.');
