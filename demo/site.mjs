// Sunum sitesinin içerik haritası — tools/build-site.mjs okur, statik HTML'e işler.
// Yeni sunum sayfası: pages/<ad>.html yaz + aşağıdaki PAGES listesine bir satır ekle.

export const REPO = 'https://github.com/StreamEmber/mhud';

// Sunum sayfaları: bileşenlerin bir arada, gerçek sahnede kullanımı. icon = MH ikon adı.
export const PAGES = [
  { group: 'Başlangıç', items: [
    { href: 'pages/components.html', label: 'Temel bileşenler', icon: 'layers' }
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
    { href: 'pages/broadcast.html', label: 'Yayın düzeni (kare/dikey)', icon: 'phone' },
    { href: 'pages/western.html', label: 'Eski Batı', icon: 'hat' }
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
  location: 'compass', menu: 'list', print: 'newspaper', stream: 'broadcast', survival: 'campfire', tags: 'tag', vehicle: 'car', vitals: 'heart',
  crew: 'users', shop: 'store'
};

export const THEMES = [
  { id: 'modern',   label: 'Modern',   note: 'GTA V',     scene: 'city',   sw: 'linear-gradient(135deg,#0d1117 45%,#f5b83d 45%)', desc: 'Keskin, temiz paneller; şehir gecesi için.' },
  { id: 'tactical', label: 'Tactical', note: 'Askeri',    scene: 'forest', sw: 'linear-gradient(135deg,#0e110c 45%,#c4f052 45%)', desc: 'Köşeli çerçeve, mono rakamlar, gece görüşü yeşili.' },
  { id: 'frontier', label: 'Frontier', note: 'RDR2',      scene: 'desert', sw: 'linear-gradient(135deg,#110d09 45%,#cdaa69 45% 72%,#f1e6cf 72%)', desc: 'Serif yazı, altın saç çizgiler, kutusuz HUD.' },
  { id: 'oldwest',  label: 'Old West', note: 'Eski Batı', scene: 'town',   sw: 'linear-gradient(135deg,#e6d6b4 45%,#8e2b1e 45% 72%,#2b1d10 72%)', desc: 'Kâğıt yüzeyler, mürekkep, gazete tipografisi.' }
];
export const ACCENTS = [
  { id: '', c: null }, { id: 'amber', c: '#f5b83d' }, { id: 'crimson', c: '#ff4858' }, { id: 'mint', c: '#46de96' },
  { id: 'ice', c: '#50aaff' }, { id: 'violet', c: '#a878ff' }, { id: 'rose', c: '#ff5caa' }, { id: 'cyan', c: '#3ee8ff' },
  { id: 'lime', c: '#c4f052' }, { id: 'gold', c: '#cdaa69' }, { id: 'tiktok', c: '#fe2c55' }
];
export const SCENES = { auto: 'Oto', city: 'Şehir', night: 'Gece', desert: 'Çöl', town: 'Kasaba', forest: 'Orman', bright: 'Gündüz', none: 'Düz' };
