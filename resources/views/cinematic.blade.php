<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#151410">
  <meta name="description" content="Golden Goals — bukan sekadar sebuah skor. Sebuah pengalaman sinematik 3D untuk langkah persiapan PTE berikutnya.">
  <title>Golden Goals — More Than a Score</title>
  <link rel="stylesheet" href="{{ asset('css/cinematic.css') }}">
  <script src="{{ asset('js/logo-geometry.js') }}" defer></script>
  <script src="{{ asset('js/study-room.js') }}" defer></script>
  <script src="{{ asset('js/cinematic.js') }}" defer></script>
</head>
<body data-chapter="0">
  <div class="scroll-progress" aria-hidden="true"></div>
  <header class="site-header"><a class="wordmark" href="#chapter-0">GOLDEN<span>GOALS<sup>®</sup></span></a><nav aria-label="Navigasi"><a href="#chapter-1">Visi</a><a href="#chapter-2">Ruang belajar</a><a href="#chapter-4" class="nav-contact">Mulai ↗</a></nav></header>
  <main>
    <div class="film-track">
      <div class="film-stage lab" id="explore">
        <div class="ambient" aria-hidden="true"></div><div class="scene-vignette" aria-hidden="true"></div>
        <canvas id="experience-canvas" tabindex="0" aria-label="Simbol Golden Goals 3D. Scroll untuk mengubah adegan, geser untuk memutar, klik untuk memilih komponen. Saat fokus, panah memutar, X memisahkan, R mereset dan spasi menjeda." aria-describedby="canvas-help"></canvas>
        <div class="canvas-fallback"><svg viewBox="50 10 410 400" role="img" aria-label="Simbol Golden Goals: figur biru, merah, dan tiga bintang emas"><defs><path id="figure" d="M211 139C208 171 197 190 169 207C143 224 104 250 101 288C99 304 103 303 111 294C139 259 165 264 184 285C209 314 172 365 166 391C162 404 177 391 187 380C218 348 242 317 248 280C254 236 242 184 219 143C215 136 213 135 211 139Z"/><path id="star" d="M0-50 15-17 48-15 25 9 29 40 0 25-29 40-25 9-48-15-15-17Z"/></defs><use href="#figure" fill="#3a73bc"/><use href="#figure" transform="translate(506 0) scale(-1 1)" fill="#ef4c35"/><ellipse cx="156" cy="154" rx="28" ry="32" fill="#3a73bc"/><ellipse cx="349" cy="154" rx="28" ry="32" fill="#ef4c35"/><g fill="#e9b339"><use href="#star" transform="translate(253 72)"/><use href="#star" transform="translate(95 329) scale(.56)"/><use href="#star" transform="translate(410 329) scale(.56)"/></g></svg><p id="fallback-message">Menyiapkan ruang 3D…</p></div>
        <span class="stage-label">GOLDEN GOALS / A NEW PERSPECTIVE</span><button class="fullscreen icon-button" id="fullscreen" aria-label="Layar penuh" title="Layar penuh">⛶</button>
        <div class="object-caption"><span id="part-number">01—07</span><div><strong id="part-title">A symbol of possibility.</strong><small id="part-description">Dua figur. Tiga bintang. Satu langkah ke depan.</small></div></div>
        <details class="tools"><summary>✦ Object studio <span>+</span></summary><div class="control-dock"><div class="dock-row"><div class="material-tabs" role="group" aria-label="Material logo"><button data-material="studio" class="active" aria-pressed="true">Original</button><button data-material="chrome" aria-pressed="false">Chrome</button><button data-material="wire" aria-pressed="false">Wire</button></div><div class="dock-actions"><button class="icon-button" id="pause" aria-label="Jeda animasi" aria-pressed="false">Ⅱ</button><button class="icon-button" id="reset" aria-label="Reset ke pose adegan">↺</button><button class="icon-button" id="snapshot" aria-label="Simpan PNG">↓</button></div></div><div class="sliders"><label for="explode">Explode <input id="explode" type="range" min="0" max="100" value="0"><output id="explode-value" for="explode">0%</output></label><label for="zoom">Zoom <input id="zoom" type="range" min="75" max="135" value="100"><output id="zoom-value" for="zoom">100%</output></label></div><p id="canvas-help">Geser logo · klik komponen · panah untuk rotasi</p></div></details>
        <div id="scene-status" class="sr-only" role="status" aria-live="polite"></div><span id="renderer-label" class="sr-only">CINEMATIC WEBGL</span>
      </div>
      <div class="story">
        <section class="film-panel opening" id="chapter-0" data-step="0"><div class="opening-title"><p class="eyebrow">PTE PREPARATION / PARE, KEDIRI</p><h1>BUKAN<br>SEKADAR<br>SEBUAH <em>SKOR.</em></h1></div><p class="opening-aside">Ini tentang tujuanmu.<br>Keberanian untuk memulai.<br>Dan dunia yang menunggu.</p><a class="scroll-prompt" href="#chapter-1"><span>↓</span> SCROLL TO DISCOVER</a></section>
        <section class="film-panel statement" id="chapter-1" data-step="1"><div><p class="eyebrow">IT STARTS WITH A LITTLE COURAGE.</p><h2>ini <em>langkahmu.</em></h2><p class="supporting">Mimpi yang besar. Dimulai dari satu langkah kecil.</p></div></section>
        <section class="film-panel room-chapter" id="chapter-2" data-step="2"><div class="room-heading"><p class="eyebrow">A SPACE TO BEGIN / GOLDEN GOALS</p><h2>Ruang untuk<br><em>bertumbuh.</em></h2></div><div class="room-bottom"><p>Persiapan PTE, online atau offline.<br>Mulai dari tempatmu berada.<br>Atau bertemu di Kampung Inggris Pare.</p><a class="text-link" href="https://www.instagram.com/kursuspte_whv/" target="_blank" rel="noopener noreferrer">Tanyakan pilihan belajar ↗</a></div><span class="scene-note">RUANG BELAJAR KONSEPTUAL / 3D STUDY</span></section>
        <section class="film-panel possibilities" id="chapter-3" data-step="3"><div><p class="eyebrow">A NEW WAY TO SEE WHAT'S POSSIBLE.</p><h2>perspektif<br><em>baru.</em></h2><p class="supporting">Ubah sudut pandang. Temukan kemungkinanmu.</p></div></section>
        <section class="film-panel finale" id="chapter-4" data-step="4"><div><p class="eyebrow">YOUR NEXT CHAPTER STARTS HERE.</p><h2>GO <em>GOLDEN.</em></h2><div class="finale-bottom"><p>Wujudkan mimpi emasmu.<br>Tanyakan program, jadwal, dan biaya kepada tim.</p><a class="contact-button" href="https://www.instagram.com/kursuspte_whv/" target="_blank" rel="noopener noreferrer">Mulai percakapan <span>↗</span></a></div></div></section>
      </div>
    </div>
  </main>
  <nav class="timeline" aria-label="Adegan"><a class="chapter-marker active" data-chapter="0" href="#chapter-0" aria-label="Adegan 1: Bukan sekadar skor" aria-current="step"><span>01</span></a><a class="chapter-marker" data-chapter="1" href="#chapter-1" aria-label="Adegan 2: Langkahmu"><span>02</span></a><a class="chapter-marker" data-chapter="2" href="#chapter-2" aria-label="Adegan 3: Ruang belajar"><span>03</span></a><a class="chapter-marker" data-chapter="3" href="#chapter-3" aria-label="Adegan 4: Perspektif"><span>04</span></a><a class="chapter-marker" data-chapter="4" href="#chapter-4" aria-label="Adegan 5: Go Golden"><span>05</span></a></nav>
  <footer><a href="#chapter-0">GOLDEN GOALS®</a><span>Pare, Kediri · Wujudkan mimpi emasmu.</span><div><a href="https://www.instagram.com/kursuspte_whv/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://www.tiktok.com/@kursuspte_whv" target="_blank" rel="noopener noreferrer">TikTok ↗</a></div></footer>
  <noscript><p class="noscript-note">Aktifkan JavaScript untuk animasi 3D. Informasi dan tautan tetap dapat diakses.</p></noscript>
</body>
</html>
