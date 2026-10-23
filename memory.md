# memory.md — Proje Hafızası (AI oturumları için kısa özet)

> Yeni oturumda önce bunu oku. Her adımdan sonra "Adım Günlüğü"ne 1–3 satır ekle.

## Proje
- Amaç: Akademik sempozyum için tek sayfalık site, GitHub Pages'te yayınlanacak.
- Dosyalar: `index.html` (tüm site), `memory.md` (bu dosya). Build adımı yok.
- Stack: Tailwind CDN 3.4.16 (config `<head>`'de), Alpine.js 3.14.8 + Collapse eklentisi, Lucide 0.460.0 (UMD), Google Fonts (Plus Jakarta Sans / Inter / JetBrains Mono).

## Mimari (index.html)
- Tüm içerik `symposiumData` nesnesinde (sayfa sonundaki `<script>`). Metinler `{tr, en}`.
  - Anahtarlar: `meta, about, tracks, importantDates, speakers, committees{honorary,organizing,scientific}, program[gün].sessions, guidelines, downloads, faq, organizers, venue, contact`.
- Arayüz etiketleri: `uiText.tr / uiText.en`, `L('anahtar')` ile okunur. Veri metni: `t(obj)`.
- Alpine bileşeni: `symposiumApp()` (body'de `x-data`). Durum: `lang, committeeTab, search, dayTab, hallFilter, openFaq, now`.
- İkonlar: `icon('kebab-isim','sınıflar')` → `x-html` ile satır içi SVG (lucide.createIcons KULLANILMIYOR; Alpine reaktivitesini bozar).
- Tarih durumları (`done/active/upcoming`) `now`'a göre otomatik hesaplanır; tarihler `+03:00` gün sonu.
- Renkler: `brand` = zümrüt (#059669), `accent` = kehribar (#D97706), `ink` #0B0F19, `paper` #F8FAFC. Kurumsal renk değişirse yalnızca tailwind.config paletini değiştir.
- Ortak sınıflar `<style type="text/tailwindcss">` içinde: `.card .card-dark .eyebrow .section-title .btn-primary .btn-ghost .tab`.
- Dil tercihi localStorage `issdt-lang`.

## Bölümler (sırasıyla id)
navbar · hero (geri sayım) · `#about` (bento) · `#dates` (timeline, koyu) · `#speakers` · `#committees` (sekme + bilim kurulu araması) · `#program` (gün sekmesi + salon filtresi) · `#guidelines` (kurallar + indirmeler, koyu) · `#faq` · footer `#contact`.

## Açık işler / Notlar
- TÜM veriler örnektir (kurgusal üniversite "Kuzey Ufuk Üniversitesi", kurgusal kişiler). Gerçek verilerle değiştirilmeli.
- `assets/` klasörü yok: `ISSDT2027_Sablon.docx`, `ISSDT2027_LaTeX.zip`, `ISSDT2027_Afis.pdf` eklenmeli.
- `meta.submissionUrl` = easychair.org (genel) → gerçek gönderim linki girilmeli. E-posta `example.org`.
- Konuşmacı `photo` ve kurum `logo` alanları boş → monogram gösteriliyor.
- Harita OSM embed, koordinatlar Ankara civarı örnek.

## Adım Günlüğü
- 2026-10-23 · Adım 1: `index.html` tam sürüm oluşturuldu (9 bölüm + SSS, TR/EN). Node ile mantık testi yapıldı (timeline, geri sayım, arama OK); 51 Lucide ikonunun varlığı doğrulandı. Tarayıcı testi yapılmadı (kullanıcı reddetti).
- 2026-10-23 · Adım 2: git init + GitHub'a push.
