# memory.md — Proje Hafızası (AI oturumları için kısa özet)

> Yeni oturumda önce bunu oku. Her adımdan sonra "Adım Günlüğü"ne 1–3 satır ekle, yol haritasında tamamlananları [x] yap.
> İşaretler: [x] bitti · [~] kod hazır, gerçek veri/dosya/karar bekliyor · [ ] yapılmadı · (+) = AI'ın eklediği madde

## Proje
- Canlı: https://ilhanselahattin.github.io/sempozyum2027/ · Repo: github.com/ilhanselahattin/sempozyum2027 (main'e push = otomatik yayın, ~1 dk)
- Amaç: Akademik sempozyum (örnek ad: ISSDT 2027) için tek sayfalık site → GitHub Pages.
- Build yok. Dosyalar: `index.html` (tüm site + veri), `404.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `.nojekyll`,
  `assets/img/` (favicon.svg, apple-touch-icon.png, og-image.png), `assets/src/og-image.html` (OG görsel kaynağı), `memory.md`.
- Stack: Tailwind CDN 3.4.16, Alpine.js 3.14.8 + Collapse eklentisi, Lucide 0.460.0 (UMD), Google Fonts (Plus Jakarta Sans / Inter / JetBrains Mono).

## Mimari (index.html)
- Tüm içerik `symposiumData` (sayfa sonu `<script>`). Metinler `{tr, en}` → `t(obj)`. Arayüz etiketleri `uiText.tr/en` → `L('anahtar')`.
- Alpine bileşeni `symposiumApp()` (body `x-data`).
- İkon: `icon('kebab-isim','sınıflar')` + `x-html` (lucide.createIcons KULLANMA, Alpine'i bozar). Yeni ikon adı eklenince Lucide 0.460'ta var mı kontrol et.
- **Faz sistemi** (`phase` getter): `meta.startDate` öncesi `cfp`, arası `live`, sonrası `archive`. Zorlamak: `meta.phaseOverride`. Önizleme: `index.html?phase=live|archive`.
  - cfp: geri sayım + gönder/şablon butonları. CTA tarihe göre: Özet Gönder → Tam Metin Gönder → Kayıt Ol.
  - live: kırmızı CANLI rozeti, "Gün X Programını Gör" + Program PDF, "Şu an / Sıradaki" paneli, programda canlı oturum vurgusu.
  - archive: hero'da en büyük butonlar = `proceedings[]` (ISBN), sertifika paneli, `archive.stats`.
- `importantDates[].key` kodda kullanılır (abstract, fullpaper, earlyreg). Uzatma: `date`=yeni, `oldDate`=eski, `isExtended:true`.
- Koşullu bölümler: `acceptedPapers.list` boşsa #accepted gizli; `gallery` boşsa #gallery gizli; `registration.isFree:true` → "Katılım Ücretsizdir".
- `halls[].onlineUrl` doluysa programda "Çevrim içi katıl" linki çıkar (şifre YAZMA).
- `announcement` → üst turuncu şerit (yalnız cfp fazında; yeni duyuruda `id` değiştir).
- Renkler: `brand` zümrüt #059669, `accent` kehribar #D97706, `ink` #0B0F19, `paper` #F8FAFC (tailwind.config).
- localStorage: `issdt-lang`, `issdt-announcement`. Çerez yok.
- Bölüm id'leri: about(+incentive) · dates · speakers · committees · program · accepted · guidelines · registration · travel · gallery · faq · contact(footer). KVKK = modal (`kvkkOpen`).

## Görsel üretimi (Pillow yok → headless Chrome)
- OG: `chrome --headless=new --window-size=1200,630 --screenshot=assets/img/og-image.png file:///.../assets/src/og-image.html`
- Favicon: favicon.svg'yi 32/48/180 px HTML'de render → PNG; 32+48 PNG'ler Node ile `favicon.ico`'ya paketlendi.
- Not: headless Chrome Windows'ta pencereyi ~500px'ten dar açmıyor; mobil test için 390px iframe içinde render et.

## Yol Haritası

### Faz 1 — Kurulum ve İskelet (şu an)
- [ ] Subdomain başvurusu (BİDB, ör. sempozyum2027.xxx.edu.tr) → DNS'te `CNAME → <kullanıcı>.github.io`, repoya `CNAME` dosyası, Pages'te "Enforce HTTPS". **İlk iş başlatılmalı (1–2 hafta).** Alan adı gelince: canonical, og:url, og:image, JSON-LD, robots.txt, sitemap.xml içindeki `sempozyum2027.example.edu.tr` değiştirilecek.
- [~] Kurumsal kimlik: geçici favicon (svg/ico/apple-touch) ve OG görseli (1200×630) üretildi. Resmî logo gelince `meta.logo` + favicon + og-image yeniden üretilecek.
- [x] Çoklu dil (TR/EN) altyapısı — tüm veri `{tr,en}`.
- [~] KVKK aydınlatma metni modalı (footer + dekont formu yanında). Metin taslak → **üniversitenin KVKK birimi/hukuk onayı şart**.
- [x] (+) SEO: meta description, Open Graph/Twitter etiketleri, schema.org Event JSON-LD, robots.txt, sitemap.xml.
- [x] (+) GitHub Pages yardımcıları: `.nojekyll`, `404.html`.
- [x] (+) Erişilebilirlik temel: "İçeriğe geç" linki, aria etiketleri, reduced-motion, Esc ile modal kapatma.
- [x] (+) Tarihe göre otomatik faz geçişi (cfp/live/archive) + `?phase=` önizleme.
- [ ] (+) Yayın öncesi performans/KVKK: Tailwind CDN yerine derlenmiş CSS (CDN konsola "production'da kullanma" uyarısı basar) ve Google Fonts'u self-host (IP aktarımı KVKK riski).
- [ ] (+) Analitik gerekiyorsa çerezsiz bir araç (GoatCounter/Plausible) → çerez banner'ı gerekmez.
- [x] GitHub'a gönderildi + Pages açık (main / root). Repo: https://github.com/ilhanselahattin/sempozyum2027 · Canlı: https://ilhanselahattin.github.io/sempozyum2027/ (`gh` CLI yok; push HTTPS ile çalışıyor).

### Faz 2 — Çağrı ve Bildiri Toplama (2–4 ay önce)
- [~] Gönderim sistemi entegrasyonu: butonlar `meta.submissionUrl`'e bağlı (şu an genel easychair.org). Sistem seçilince gerçek link girilecek.
- [~] Şablonlar `assets/docs/` yollarına bağlandı: Özet .docx, Tam Metin .docx, LaTeX .zip, Telif Devir Formu .pdf, (+) Sunum Şablonu .pptx, Afiş .pdf. **Dosyalar henüz yok.**
- [x] "Süre Uzatıldı" modu (`oldDate` + `isExtended` → üstü çizili eski tarih + "Uzatıldı!" rozeti). (+) Üst duyuru şeridi.
- [x] Akademik Teşvik & Doçentlik kartı (Hakkında, `#incentive`) + SSS sorusu. Ülke/yabancı üye/yabancı konuşmacı sayıları veriden otomatik. **Değerlendirme:** kesin "karşılar" denmedi; mevzuat yıllara göre değiştiği için ifade "gözetilerek planlanmıştır" + uyarı notu. Resmî kriter metniyle düzenleme kurulu teyit etmeli.
- [~] Ücret & dekont: ücret kartları (erken/normal otomatik vurgulu), IBAN + kopyala, açıklama şablonu, dekont formu linki; `isFree:true` ile "Katılım Ücretsizdir". IBAN/banka/form linki örnek.

### Faz 3 — Kabul İlanı ve Program (2–4 hafta önce)
- [x] Kabul edilen bildiriler: aranabilir liste + tema filtresi + PDF linki (`acceptedPapers`). Şu an ÖRNEK veri dolu → gerçek ilan tarihine kadar `list: []` yapılmalı.
- [x] Detaylı program: gün sekmeleri, salon filtresi, oturum başkanı, bildiriler, salon başına çevrim içi link alanı.
- [x] Konaklama ve ulaşım rehberi (`#travel`): OSM harita, ulaşım kartları, otel/konukevi kartları. (Google Maps yerine OSM: anahtar/çerez gerektirmez.)
- [x] Sunum kuralları kartları (sözlü 15+5, poster 70×100 dikey, çevrim içi).
- [ ] (+) Program PDF'i (`meta.programPdf`) hazırlanıp yüklenecek.
- [ ] (+) İsteğe bağlı: takvime ekle (.ics) dosyası.

### Faz 4 — Sempozyum Günü (Canlı Mod)
- [x] Hero "Canlı Mod" (otomatik; tarih aralığında). "Şu an / Sıradaki" oturum paneli (+).
- [~] Hibrit bağlantılar: `halls[].onlineUrl` alanı hazır. **Değerlendirme:** Zoom/Teams şifrelerini herkese açık sitede yayınlamak "zoombombing" riskidir → bekleme odası açın, şifreleri yalnızca kayıtlılara e-postayla gönderin.
- [ ] QR kod (afiş/yaka kartı → `<alanadı>/#program`). **Alan adı kesinleşmeden üretilmemeli** (basılı QR sonradan değişemez).

### Faz 5 — Sempozyum Sonrası (Arşiv)
- [~] Bildiri kitapları: arşiv fazında hero'da en büyük butonlar (`proceedings[]`, ISBN). PDF ve ISBN'ler gelecek. (+) Öneri: kitapları Zenodo'ya da yükleyip DOI almak (link kalıcılığı, teşvik denetimi).
- [~] Sertifika: arşiv panelinde indirme linki (`certificates.url`). **Değerlendirme:** "isimle arama" herkese açık isim listesi demektir (KVKK) → bildiri no ile adlandırılmış dosyalar veya doğrulama kodu tercih edildi.
- [~] Fotoğraf galerisi + ışık kutusu hazır; `gallery[]` doldurulunca görünür. Fotoğraf kullanımı için KVKK metninde açık rıza maddesi var.

## Açık işler / Notlar
- TÜM veriler örnektir (kurgusal "Kuzey Ufuk Üniversitesi", kurgusal kişiler, örnek IBAN, example.org e-posta).
- `assets/docs/` klasörü yok (tüm indirme linkleri şu an 404).

## Adım Günlüğü
- 2026-10-23 · Adım 1: `index.html` ilk sürüm (9 bölüm + SSS, TR/EN). Node ile mantık testi OK; Lucide ikonları doğrulandı.
- 2026-10-23 · Adım 2: git init + ilk commit (b618515). GitHub push bekliyor (repo URL yok, gh CLI yok).
- 2026-10-23 · Adım 3: Yol haritası eklendi ve değerlendirildi. index.html v2: faz sistemi, duyuru şeridi, uzatma modu, teşvik kartı, kayıt/ücret/IBAN, kabul edilen bildiriler, sunum kuralları, 6 indirme, ulaşım+konaklama, galeri+ışık kutusu, KVKK modalı, "Daha Fazla" menüsü, SEO/OG/JSON-LD. 404/robots/sitemap/.nojekyll, favicon + OG görseli üretildi. Node ile 5 tarih senaryosu test edildi, headless Chrome ile masaüstü/mobil/canlı mod ekran görüntüleri kontrol edildi.
- 2026-10-23 · Adım 4: GitHub'a push (repo sempozyum2027), Pages açıldı. Canlı kontrol: index/favicon/og/robots/sitemap 200, 404 sayfası çalışıyor, 4 CDN 200, headless Chrome ile JS render (geri sayım, ikonlar, tüm bölümler) doğrulandı. assets/docs/ dosyaları hâlâ 404 (beklenen).
