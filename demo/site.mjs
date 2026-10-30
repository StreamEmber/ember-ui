// Sunum sitesinin içerik haritası — tools/build-site.mjs okur, statik HTML'e işler.
// Yeni sunum sayfası: pages/<ad>.html yaz + aşağıdaki PAGES listesine bir satır ekle.

export const REPO = 'https://github.com/StreamEmber/ember-ui';

// Sunum sayfaları: bileşenlerin bir arada, gerçek sahnede kullanımı. icon = EUI ikon adı.
export const PAGES = [
  { group: 'Başlangıç', items: [
    { href: 'pages/components.html', label: 'Temel bileşenler', icon: 'layers' }
  ]},
  { group: 'Oyun ekranları', items: [
    { href: 'pages/lobby.html', label: 'Lobi (yatay + dikey)', icon: 'home' },
    { href: 'pages/boot.html', label: 'Açılış ve durum ekranları', icon: 'wifi' }
  ]},
  { group: 'Ölçerler', items: [
    { href: 'pages/vitals.html', label: 'Yaşam göstergeleri', icon: 'stats' },
    { href: 'pages/bars.html', label: 'Barlar', icon: 'gauge' }
  ]},
  { group: 'Oyun içi HUD', items: [
    { href: 'pages/hud.html', label: 'Oyuncu HUD', icon: 'heart' },
    { href: 'pages/vehicle.html', label: 'Araç & binek', icon: 'steering' },
    { href: 'pages/combat.html', label: 'Çatışma', icon: 'crosshair' },
    { href: 'pages/mode.html', label: 'Oyun modu', icon: 'flag' },
    { href: 'pages/world.html', label: 'Dünya katmanı', icon: 'pin' },
    { href: 'pages/tags.html', label: 'İsim etiketleri', icon: 'tag' },
    { href: 'pages/crew.html', label: 'Ekip & ekipman', icon: 'users' }
  ]},
  { group: 'Yayın & oyunlar', items: [
    { href: 'pages/broadcast.html', label: 'Yayın düzeni (kare/dikey)', icon: 'phone' }
  ]},
  { group: 'Akışlar', items: [
    { href: 'pages/notifications.html', label: 'Bildirimler', icon: 'bell' },
    { href: 'pages/stream.html', label: 'Yayın & hediyeler', icon: 'gift' }
  ]},
  { group: 'Arayüz', items: [
    { href: 'pages/menus.html', label: 'Menüler', icon: 'list' },
    { href: 'pages/shop.html', label: 'Mağaza & satın alma', icon: 'store' },
    { href: 'pages/social.html', label: 'Ekip & kanallar', icon: 'crew' },
    { href: 'pages/interaction.html', label: 'Etkileşim', icon: 'pointer' },
    { href: 'pages/screens.html', label: 'Tam ekranlar', icon: 'focus' },
    { href: 'pages/parts.html', label: 'Diğer parçalar', icon: 'box' }
  ]}
];

// Bileşen aileleri catalog/<aile>.html'den gelir; burada yalnız menü ikonları.
export const FAMILY_ICON = {
  base: 'layers', bars: 'gauge', combat: 'crosshair', economy: 'cash', extras: 'chart', feed: 'bell', gear: 'backpack',
  location: 'compass', menu: 'list', stream: 'broadcast', survival: 'campfire', tags: 'tag', vehicle: 'car', vitals: 'heart',
  crew: 'users', shop: 'store', app: 'home'
};

export const ACCENTS = [
  { id: '', c: null }, { id: 'crimson', c: '#ff4858' }, { id: 'mint', c: '#46de96' },
  { id: 'ice', c: '#50aaff' }, { id: 'violet', c: '#a878ff' }, { id: 'rose', c: '#ff5caa' }, { id: 'cyan', c: '#3ee8ff' },
  { id: 'lime', c: '#c4f052' }, { id: 'gold', c: '#cdaa69' }, { id: 'tiktok', c: '#fe2c55' }
];
export const SCENES = { city: 'Şehir', night: 'Gece', desert: 'Çöl', town: 'Kasaba', forest: 'Orman', bright: 'Gündüz', none: 'Düz' };
