const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'privacy.js'), 'utf8');
const KEY = 'keeperlab-privacy-v1';
function harness(saved, dnt = '0', storageFails = false) {
  const scripts = [], handlers = {}, timers = [];
  const elements = {};
  const element = () => ({hidden:true,dataset:{},isConnected:true,addEventListener(n, fn){this[n]=fn},setAttribute(){},focus(){},querySelector(selector){return elements[selector] ||= element()}});
  const panel = element(), settings = element();
  const state = {reloads:0,stored:saved};
  const document = {createElement:tag=>tag === 'section' ? panel : element(),body:{append(){}},head:{append:e=>scripts.push(e)},querySelectorAll:()=>[settings],activeElement:settings};
  const context = {document,navigator:{doNotTrack:dnt},location:{origin:'https://keeperlab.ch',reload(){state.reloads++}},URL,Date,JSON,Number,
    localStorage:{getItem(){if(storageFails)throw Error(); return state.stored},setItem(k,v){if(storageFails)throw Error();state.stored=v}},
    setTimeout(fn){timers.push(fn);return timers.length},clearTimeout(){},addEventListener(n,fn){handlers[n]=fn}};
  context.window=context;
  vm.runInNewContext(code,context);
  return {context,state,scripts,panel,settings,handlers,timers,click(accept){elements[`[data-choice="${accept?'accept':'refuse'}"]`].click()}};
}
function saved(analytics, expiresAt=Date.now()+86400000) {return JSON.stringify({version:1,analytics,expiresAt});}
test('no tracker before a choice or after refusal, including next page',()=>{
  const h=harness();assert.equal(h.scripts.length,0);assert.equal(h.panel.hidden,false);
  h.click(false);assert.equal(h.scripts.length,0);assert.equal(h.panel.hidden,true);
  assert.equal(harness(h.state.stored).scripts.length,0);
});
test('acceptance loads once; later withdrawal immediately blocks sends and reloads',()=>{
  const h=harness();h.click(true);h.click(true);assert.equal(h.scripts.length,1);
  const script=h.scripts[0];assert.equal(script.dataset.excludeSearch,'true');assert.equal(script.dataset.doNotTrack,'true');
  h.click(false);assert.equal(h.context.keeperlabBeforeSend('event',{url:'/'}),false);assert.equal(h.state.reloads,1);
  assert.equal(harness(h.state.stored).scripts.length,0);
});
test('expired, malformed, wrong-version and unavailable storage fail closed',()=>{
  for(const value of [saved(true,Date.now()-1),'invalid','{}',JSON.stringify({version:2,analytics:true,expiresAt:Date.now()+10000}),saved(true,Date.now()+200*86400000)]) assert.equal(harness(value).scripts.length,0);
  const h=harness(null,'0',true);h.click(true);assert.equal(h.scripts.length,1);h.click(false);assert.equal(h.state.reloads,1);
});
test('Do Not Track overrides previous approval',()=>{assert.equal(harness(saved(true),'1').scripts.length,0)});
test('cross-tab withdrawal and cleared storage stop active tracking',()=>{
  for(const key of [KEY,null]) { const h=harness(saved(true));h.state.stored=null;h.handlers.storage({key});assert.equal(h.state.reloads,1);assert.equal(h.context.keeperlabBeforeSend('event',{url:'/'}),false); }
});
test('only pageviews pass, with query/hash and referrer paths removed',()=>{
  const h=harness(saved(true));const send=h.context.keeperlabBeforeSend;
  const p=send('event',{url:'https://keeperlab.ch/catalogue.html?email=private#secret',referrer:'https://example.org/private?token=x'});
  assert.equal(p.url,'/catalogue.html');assert.equal(p.referrer,'https://example.org');
  assert.equal(send('identify',{url:'/',id:'person'}),false);
  assert.equal(send('event',{url:'/',name:'signup',data:{email:'private'}}),false);
});
test('all site pages use the consent gate and local fonts; Brevo is submission-only',()=>{
  for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='maillots.html')) {
    const html=fs.readFileSync(path.join(root,file),'utf8');
    assert.doesNotMatch(html,/<script[^>]+(?:umami|sibforms)\.com|<script[^>]+cloud\.umami\.is/);
    assert.doesNotMatch(html,/fonts\.(googleapis|gstatic)\.com/);
    assert.match(html,/src="\/privacy.js"/);assert.match(html,/data-privacy-settings/);
  }
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(html,/method="POST"/);assert.match(html,/type="checkbox" value="1" required/);
  assert.doesNotMatch(html,/novalidate|Votre inscription est confirmée|forms\/end-form/);
});
