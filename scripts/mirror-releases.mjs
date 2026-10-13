import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const catalog=JSON.parse(await readFile(new URL('../store/catalog.json',import.meta.url),'utf8'));
const repo='Brutal-BrutalFoundry/BrutalDash-for-CarThing';
await mkdir('release-notes',{recursive:true});
for(const app of catalog.apps){for(const v of [...app.versions].reverse()){
  if(!/^\d+\.\d+\.\d+$/.test(v.version))throw new Error('Unexpected version');
  const tag='v'+v.version, filename='BrutalDash-'+v.version+'.zip';
  try{execFileSync('gh',['release','view',tag,'--repo',repo],{stdio:'ignore'});console.log('Release already exists: '+tag);continue;}catch{}
  const notes='release-notes/'+v.version+'.txt';await writeFile(notes,v.changelog+'\n');
  execFileSync('gh',['release','create',tag,'store/downloads/'+filename,'--repo',repo,'--target',process.env.GITHUB_SHA,'--title','BrutalDash for CarThing '+tag,'--notes-file',notes,'--latest='+(v.version===app.versions[0].version?'true':'false')],{stdio:'inherit'});
}}
