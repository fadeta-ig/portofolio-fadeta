const si = require('simple-icons');
const brands = ['siLinux', 'siMikrotik', 'siVuedotjs', 'siReact', 'siTailwindcss', 'siWordpress', 'siGreensock', 'siThreedotjs'];
const res = {};
brands.forEach(b => {
  if(si[b]) res[b] = true;
  else res[b] = false;
});
require('fs').writeFileSync('icon_test.json', JSON.stringify(res, null, 2));
