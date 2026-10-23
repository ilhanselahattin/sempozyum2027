# memory.md — Proje Hafızası (AI oturumları için kısa özet)

> Yeni oturumda önce bunu oku. Her adımdan sonra "Adım Günlüğü"ne 1–3 satır ekle, yapılacaklarda tamamlananları [x] yap.
> İşaretler: [x] bitti · [~] kod hazır, gerçek veri bekliyor · [ ] yapılmadı

## Etkinlik (KESİN BİLGİLER)
- **Workshop on Environment, Clean Energy, and Economic Policy** (kullanıcı "Envinment" yazmıştı → düzeltildi). TR çeviri önerimiz: "Çevre, Temiz Enerji ve Ekonomi Politikası Çalıştayı". Kısaltma **ECEP 2027** bizim önerimiz (onaylanmadı).
- Tür: **ÇALIŞTAY** (sempozyum değil, hakemli değil). Tarih: **18–19 Ocak 2027** (Pzt–Salı). Yer: **YTÜ Davutpaşa Kampüsü**, Esenler/İstanbul (OSM: 41.025615, 28.89368; M1A Davutpaşa–YTÜ istasyonu).
- Düzenleyen: **YTÜ İİBF İktisat Bölümü**. Danışman: Ahmet Hoca.
- **Sitenin amacı:** TÜBİTAK **2223-B** Yurt İçi Bilimsel Etkinlik Düzenleme Desteği başvurusunda "Etkinlik İnternet Adresi" olarak verilecek. Hoca: "çok aman aman olmasına gerek yok", Facebook/LinkedIn değil kendi sayfası olmalı, başvuru alınmayabilir → buton "Başvurular henüz başlamadı" modalı açar. Katılımcılar çoğunlukla kurum içi + öğrenciler. Broşür sonra gelecek → tema/renkler ona göre güncellenecek.
- **Başvuru son günü: 27 Ekim 2026 Salı 17:30** (2026/3 dönemi). Site bu saatte TAMAM ve yayında olmalı; sonraki değişiklikler değerlendirilmez.

## TÜBİTAK 2223-B site şartları (çağrı metni 2026)
- 4.1.7: Sitede **düzenleme kurulu + bilim kurulu üyeleri, konu, amaç, kapsam, yer, tarih** açıkça olmalı. Başka sitedeki duyuru/afiş sayılmaz.
- 4.1.10: Düzenleme kurulu **en az 3 farklı üniversite/kurum** mensubundan oluşmalı; yoksa "kurum içi etkinlik" sayılıp İADE. (Hocaya iletilmeli — "biz bize" ifadesi riskli.)
- Çalıştay için 100 katılımcı, hakemlilik, 4 yıl aralık, 3. kez düzenlenme şartları ARANMAZ.
- Değerlendirmede artı: program (taslak olabilir), ana temalar, davetli konuşmacılar, hedef kitle, yaygın etki/kalıcılık, TÜBİTAK desteğinin katkısı → hepsi sitede var.
- 4.1.12: Hiçbir marka/firma öne çıkarılmamalı. 8.5: Destek ALINIRSA tüm duyurularda TÜBİTAK desteği + logo zorunlu. Şu an logo YOK, sadece "başvurulmuştur" ibaresi (destek almadan logo kullanmak yanıltıcı olur).
- Çağrı PDF: https://tubitak.gov.tr/sites/default/files/2026-02/2223-B_18.02.2026.pdf

## Teknik
- Canlı: https://ilhanselahattin.github.io/sempozyum2027/ · Repo: github.com/ilhanselahattin/sempozyum2027 (main'e push = ~1 dk'da yayın). Repo adını `calistay2027` yapmak önerildi (karar bekliyor; değişirse canonical/og/JSON-LD/robots/sitemap URL'leri güncellenmeli).
- Build yok. Dosyalar: `index.html` (tüm site + veri), `404.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `assets/img/` (favicon.svg, apple-touch-icon.png, og-image.png), `assets/src/og-image.html`.
- Stack (v4 tasarım, 2026-10-24): **Tailwind ve Lucide YOK** → elle yazılmış CSS (`<style>` içinde, CSS değişkenleriyle). Alpine.js 3.14.8 + Collapse. Fontlar **Fontshare**: Sentient (serif başlık, italik vurgular) + General Sans (metin).
- Tasarım dili (kullanıcı isteği: "AI slop olmasın", 21st.dev gibi yumuşak sekme/kutular, Apple akıcılığı, koyu mod):
  - Palet: keten `#F3F1EA` zemin, yosun `#2F4B37` vurgu, güneş okeri `#B4843A` (yalnız küçük işaretler), gökyüzü `#4F6E78`. Koyu: `#0E110F` zemin, adaçayı `#A9C69F`.
  - Tema: `<html data-theme>`; head'deki satır içi betik ilk boyamadan önce ayarlar; `localStorage ecep-theme`; önizleme `?theme=dark`. Geçiş View Transitions ile tıklanan noktadan daire.
  - Bileşenler: `.card` `.list` (satırlar ince çizgiyle; seçici `:not(template)` — Alpine template'i saymamak için) `.seg` (kayan göstergeli sekme, `segmented()` bileşeni) `.btn` `.pill` `.chip`.
  - Animasyon: SADECE etkileşimde (sekme kayması, hover, tema geçişi, modal). Kaydırmada beliriş ve paralaks YOK (kullanıcı istemedi; mobilde kayma/takılma yapıyordu). Hover efektleri `@media (hover: hover)` içinde.
  - Doku: `assets/img/topo-light.svg` / `topo-dark.svg` (renkli hazır SVG, `node assets/src/topo.js` ile üretilir) → CSS `--topo-img` arka plan görseli. CSS mask KULLANMA (kaydırmada pahalı). Solma: `.topo.fade::after` gradyanı; bu katman içeriğin üstüne çıkmasın diye içerik kabı `position: relative` olmalı.
  - Sekme bileşeni `segmented()`: taşan şeridi yalnız `el.scrollTo` ile yatay kaydırır. `scrollIntoView` KULLANMA (sayfayı dikeyde kaydırıyordu; iOS adres çubuğu resize olaylarıyla sayfa kendi kendine kayıyordu). Resize yalnız genişlik değişince işlenir.
  - **İkon kuralı:** Hugeicons (ücretsiz stroke-rounded) yalnız ARAÇLARDA (menü, kapat, tema, ok, artı, yukarı, dış bağlantı). Metin/kart içinde ikon KULLANMA. SVG yolları `ICONS` nesnesinde gömülü; yeni ikon için `cdn.jsdelivr.net/npm/@hugeicons/core-free-icons@4.3.5/dist/cjs/<Ad>Icon.js` dosyasından yolları al.
- Veri: `symposiumData` (değişken adı tarihsel, bilerek değiştirilmedi). Metinler `{tr,en}` → `t()`; etiketler `uiText` → `L()` (bölüm başlıklarında `<em>` italik vurgu için `x-html`).
- Hakkında sekmeleri: `about.tabs[]` (items listesi veya text). Tema kartı vurgusu: `tracks[].featured: "accent"`, genişlik `span: "b-4|b-5|b-7|b-12"`.
- Faz: `meta.startDate` öncesi `cfp`, arası `live`, sonrası `archive`; önizleme `?phase=live|archive`.
- Boş veri → otomatik yer tutucu: `committees.organizing/scientific: []` → "yakında ilan edilecek"; `speakers: []` → 4 "Belirlenecek" kartı; `downloads[].href: ""` → "Yakında"; `contact.email: ""` → "yakında eklenecek".
- `importantDates[].date` boşsa `dateText` gösterilir; tarihli bir madde geçince önceki tarihsizler de "tamamlandı" sayılır.
- Bölüm id'leri: about · themes · dates · committees · speakers · program · news · venue · support · faq · contact(footer). Başvuru = iOS tarzı alt sayfa modalı (`applyOpen`).
- localStorage: `ecep-lang`, `ecep-theme`. Çerez yok.

## Görsel üretimi (Pillow yok → headless Chrome)
- OG: `chrome --headless=new --window-size=1200,630 --screenshot=assets/img/og-image.png file:///.../assets/src/og-image.html`
- Favicon: favicon.svg'yi 32/48/180 px HTML'de render → PNG; 32+48 PNG'ler Node ile favicon.ico'ya paketlenir.
- Headless Chrome Windows'ta ~500px'ten dar pencere açmıyor → mobil test için 390px iframe içinde render et.

## Yapılacaklar (27 Ekim 17:30'a kadar)
- [ ] **Düzenleme kurulu** isim/unvan/kurum (en az 3 farklı üniversite!) → `committees.organizing`
- [ ] **Bilim kurulu** isim/unvan/kurum → `committees.scientific`
- [ ] Konu/amaç/kapsam/tema metinlerini hocaya onaylat (şu an AI taslağı, iktisat odaklı)
- [ ] İletişim e-postası → `contact.email`
- [ ] TR başlık çevirisi ve "ECEP 2027" kısaltması onayı
- [ ] Repo adı kararı (sempozyum2027 → calistay2027?) — TÜBİTAK formuna link girilmeden ÖNCE
- [~] Broşür → `downloads[0].href` + broşür teması (renkler `tailwind.config` brand/accent)
- [ ] Davetli konuşmacılar (varsa) → `speakers`
- [ ] Destek kararı gelirse: `support.status` metni + TÜBİTAK logosu

## Adım Günlüğü
- 2026-10-23 · 1–4: İlk site (sempozyum şablonu), yol haritası, GitHub Pages yayını.
- 2026-10-23 · 5: Çalıştay + 18–19 Ocak 2027'ye çevrildi (örnek verilerle).
- 2026-10-23 · 6: Hocanın mesajları + TÜBİTAK 2223-B çağrı metni incelendi. Site BAŞTAN yazıldı: tüm sahte/örnek veri (kişiler, IBAN, bildiriler, oteller, teşvik kartı, KVKK, ücretler) kaldırıldı. Yeni yapı: Hero (YTÜ Davutpaşa, İİBF İktisat) · Konu/Amaç/Kapsam + Hedef kitle/Yöntem/Çıktılar · 6 tema · takvim (tarihsiz maddeler destekli) · kurullar (boş → yakında) · konuşmacılar (Belirlenecek) · taslak program · Duyurular · Mekân/ulaşım (OSM, M1A) · TÜBİTAK destek ibaresi + katkılar + belgeler (broşür yakında) · SSS · "Başvurular henüz başlamadı" modalı. Favicon/OG/404/robots/sitemap güncellendi. 49 ikon doğrulandı, faz/takvim testleri ve ekran görüntüleri OK.
- 2026-10-24 · 7: Tasarım baştan (kullanıcı: 'AI slop gibi', 21st.dev/Apple hissi, koyu mod, Fontshare, Hugeicons yalnız araçlarda). Tailwind+Lucide kaldırıldı, elle CSS; Sentient+General Sans; keten/yosun/oker paleti; topografik kontur dokusu (topo.svg, node ile üretildi); kayan göstergeli sekmeler; cam yüzer menü; görünürken beliriş; paralaks; View Transitions ile koyu mod; iOS alt sayfa modalı. Hakkında 5 sekmeye toplandı (Amaç/Kapsam/Hedef kitle/Yöntem/Çıktılar). Favicon, OG, 404 yeni kimliğe uyarlandı. Masaüstü+mobil (390px) açık/koyu ekran görüntüleriyle doğrulandı; mobil taşma ve rozet kırılması düzeltildi.
- 2026-10-24 · 8: Kullanıcı: mobilde sayfa kendi kendine kayıyor, PC akıcı değil. Sebepler: (1) segmented() içindeki scrollIntoView + iOS resize → sayfa sıçraması; (2) blur filtreli beliriş animasyonu; (3) paralaks; (4) büyük SVG CSS mask. Hepsi kaldırıldı/değiştirildi: beliriş ve paralaks silindi, sekme el.scrollTo + yalnız genişlik resize, doku renkli SVG arka plan + gradyan katman, hover yalnız fareli cihazlarda, backdrop blur 22→16px. Solma katmanının metni örtme hatası düzeltildi. Konsolda hata yok; masaüstü/mobil açık-koyu görüntüler doğrulandı.
