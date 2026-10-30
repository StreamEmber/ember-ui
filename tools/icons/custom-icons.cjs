// Ember UI'a özel dolgu ikonlar (24x24, MDI tarzı)
const W = require('./weapons.cjs');
function weaponIcon(name, rot = -38, s = 0.155, cx = 80, cy = 24) {
  const paths = W[name].split(/(?=M)/).map(p => `<path d="${p.trim()}"/>`).join('');
  return `<g transform="translate(12 12) rotate(${rot}) scale(${s}) translate(-${cx} -${cy})" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">${paths}</g>`;
}
module.exports = {
  fist: '<path d="M5.2 6.4a1.6 1.6 0 0 1 3.2 0v4.2H5.2z"/><path d="M8.9 5.4a1.6 1.6 0 0 1 3.2 0v5.2H8.9z"/><path d="M12.6 5.6a1.6 1.6 0 0 1 3.2 0v5h-3.2z"/><path d="M16.3 7a1.6 1.6 0 0 1 3.2 0v4.8a6.5 6.5 0 0 1-2.2 4.9V21H8.2v-3.2C6.3 16.6 5.2 14.8 5.2 12.6v-.9h7.3a1.7 1.7 0 0 1 0 3.4H9.6v.9h2.9a2.6 2.6 0 0 0 2.6-2.6v-1.7h1.2z"/>',
  machete: '<g transform="rotate(-40 12 12)"><path d="M.4 10.6 2.6 8.6H16v4.8H5.4C2.8 13.4 1.2 12.4.4 10.6z"/><path d="M16.5 7.8h1.2v6.4h-1.2z"/><path fill-rule="evenodd" d="M18.2 9.4h4.4a1 1 0 0 1 1 1v1.2a1 1 0 0 1-1 1h-4.4zm1.5 1.1a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1zm2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z"/></g>',
  crowbar: '<path d="M5.2 20.2 16.9 6.1c1-1.2 2.6-1.5 3.8-.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M5.2 20.2 2.2 19" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  grenade: '<path d="M9.6 3h4.8v3.2H9.6z"/><path d="M14.4 3.4h2.4c1 0 1.8.8 1.8 1.8v3.6h-1.6V5.2a.4.4 0 0 0-.4-.4h-2.2z"/><path d="M12 21.6c-3.6 0-6.4-2.8-6.4-6.3v-1.6c0-3.5 2.8-6.3 6.4-6.3s6.4 2.8 6.4 6.3v1.6c0 3.5-2.8 6.3-6.4 6.3zM7.4 13.1h3.9V9.2a4.6 4.6 0 0 0-3.9 3.9zm5.3 0h3.9a4.6 4.6 0 0 0-3.9-3.9zm-5.3 1.4v.8a4.6 4.6 0 0 0 3.9 4.5v-5.3zm5.3 5.3a4.6 4.6 0 0 0 3.9-4.5v-.8h-3.9z" fill-rule="evenodd"/><circle cx="7.6" cy="5" r="2.1" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  dynamite: '<rect x="3.5" y="9" width="5" height="12.5" rx="1.2"/><rect x="9.5" y="9" width="5" height="12.5" rx="1.2"/><rect x="15.5" y="9" width="5" height="12.5" rx="1.2"/><path d="M12 9c0-2.6 1.5-4.4 4.2-5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M18 1.2l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2z"/>',
  soldier: '<path d="M5.4 9.2a6.6 6.6 0 0 1 13.2 0v.6H20v1.8H4v-1.8h1.4z"/><path d="M7.4 12.6h9.2a4.6 4.6 0 0 1-9.2 0z"/><path d="M3.5 22v-1c0-3 3.8-4.7 8.5-4.7s8.5 1.7 8.5 4.7v1z"/><path d="M10.4 17.5 12 20l1.6-2.5z" fill="var(--eui-icon-cut, #000)" opacity=".0"/>',
  cop: '<path d="M5.6 7.2 12 3.4l6.4 3.8v2.2H5.6z"/><path d="M4.6 9.9h14.8l-1.2 1.6H5.8z"/><path d="M7.6 12.3h8.8a4.4 4.4 0 0 1-8.8 0z"/><path fill-rule="evenodd" d="M3.5 22v-1c0-3 3.8-4.8 8.5-4.8s8.5 1.8 8.5 4.8v1zm11.6-3.8.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z"/>',
  sheriff: '<path fill-rule="evenodd" d="M12 1.6a1.7 1.7 0 0 1 1.5 2.5l1.6 2.8h3.2a1.7 1.7 0 1 1 1.5 2.6L18.2 12l1.6 2.6a1.7 1.7 0 1 1-1.5 2.6h-3.2l-1.6 2.7a1.7 1.7 0 1 1-3 0l-1.6-2.7H5.7a1.7 1.7 0 1 1-1.5-2.6L5.8 12 4.2 9.4a1.7 1.7 0 1 1 1.5-2.5h3.2l1.6-2.8A1.7 1.7 0 0 1 12 1.6zm0 6.6a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z"/>',
  zombie: '<path d="M2 20.2h20V22H2z"/><path d="M9.4 19.6V13l-1.7-2.2a1 1 0 0 1 .2-1.4l.2-.1-.8-3.8a.9.9 0 0 1 1.7-.4l1 3.2.2-4.6a.9.9 0 0 1 1.8 0l.3 4.4.8-4a.9.9 0 0 1 1.7.4l-.5 4.4 1.3-2.5a.9.9 0 0 1 1.6.8l-1.6 4.4-.5 2.2v6.2z"/>',
  molotov: '<path d="M10 9h4v2.2c1.6.8 2.6 2.4 2.6 4.3V20a1.8 1.8 0 0 1-1.8 1.8H9.2A1.8 1.8 0 0 1 7.4 20v-4.5c0-1.9 1-3.5 2.6-4.3z"/><path d="M10.4 5.6h3.2V8.4h-3.2z"/><path d="M12 .8c1.6 1.4 2.2 2.6 1.6 3.6-.4.6-1 .8-1.6.8s-1.3-.3-1.6-.9c-.4-.8 0-1.8 1.6-3.5z"/>',
  carbine: weaponIcon('carbine'), rifle: weaponIcon('carbine'), smg: weaponIcon('smg', -38, .175, 72, 26), shotgun: weaponIcon('shotgun'),
  sniper: weaponIcon('sniper'), repeater: weaponIcon('repeater'), revolver: weaponIcon('revolver', -24, .21, 100, 25),
  tiktok: '<path d="M21 7.9v4a9.6 9.6 0 0 1-5.6-1.8v7.6A6.3 6.3 0 1 1 10 11.4v4.1a2.3 2.3 0 1 0 1.5 2.2V2h3.9a5.6 5.6 0 0 0 5.6 5.9z"/>'
};
