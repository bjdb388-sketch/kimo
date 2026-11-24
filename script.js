/* =====================================================
   CONFIG — كل ما يمكن تعديله موجود هنا فقط
   ===================================================== */
const CONFIG = {
  password: "love",                       // كلمة السر
  music: "song2.mp3",              // مسار الموسيقى
  volume: 0.5,
  gate:    { title: "مخصوص ليكي", sub: "اكتبي كلمة السر" },
  welcome: { title:"Hi Rooody", text: "[ نورتي مكانك ينور عيني ]" },
  first:   {
    date: "2026-10-31T11:00:00",          // تاريخ أول حديث
    message: "[ Forever Together ❤️ ]"
  },
  reasons: [                              // أسباب البتلات (6)
    "[ عينيكي 👀 ]","[ صوتك 🎤 ]","[ ضحكتك 😁 ]",
    "[ شكلك 🙈 ]","[ احترامك☺️ ]","[ كلك كدا تتحبي 😘]"
  ],
  startDate: "2026-10-31T11:00:00",       // بداية العدّاد (YYYY-MM-DDTHH:MM:SS)
  letter:  {
    message: `حبيبتي وروحي وعمري ❤️🥹
مش عارف أبدأ كلامي منين، بس كل اللي عايز أقوله إنك بقيتي جزء كبير من قلبي وحياتي، وبقيت أشوف الدنيا أحلى بوجودك. إنتِ الشخص اللي وجوده بيطمني، وصوته بيفرحني، وضحكته بتنسيني أي حاجة وحشة. أنا مش بس بحبك، أنا متعلق بكل تفاصيلك، بكلامك ودلعك وضحكتك وحتى زعلك.
نفسي أكون جنبك في كل لحظة، أشاركك أيامك الحلوة قبل الصعبة، وأكون أول شخص تفكري فيه لما تكوني فرحانة أو زعلانة. عايزك دايمًا تحسي إن ليكي حد بيحبك بجد، وخايف على زعلك، وبيفرح لفرحتك، ووجودك عنده بالدنيا كلها.
صدقيني مهما كتبت ومهما قلت مش هقدر أوصفلك مكانتك عندي، لأن الكلام مهما كان حلو مش هيقدر يوصف اللي جوايا ناحيتك. أنا كل اللي بتمناه إننا نفضل مع بعض، ونكبر سوا، ونعيش ذكريات كتير حلوة، ونفضل سند لبعض مهما الدنيا حصل فيها إيه.
بحبك يا أجمل صدفة وأحلى نصيب، وبحب إنك إنتِ بالذات اللي قلبي اختارها. ربنا يخليكي ليا وما يحرمنيش منك، وأفضل أشوف ضحكتك منورة حياتي العمر كله. إنتِ حبيبتي النهارده وبكرة وكل يوم.بحبك وبحب كل تفصيله في حياتك وانا بقولك من كل قلبي اني بحبك ❤`
  },
  ending:  { title: "[ In the end ]", hidden: "[ I'II Love You Forever 🫂 ]" },
  signature: "[Developed by A 👑]"
};

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const get = (o, path) => path.split(".").reduce((a, k) => a[k], o);

/* Fill every [data-bind] element from CONFIG */
function bindText() {
  document.querySelectorAll("[data-bind]").forEach(el => el.textContent = get(CONFIG, el.dataset.bind));
}

/* Procedural rose SVG: layered petals that bloom in sequence */
function roseSVG() {
  const layers = [
    { n: 9, y: -52, rx: 36, ry: 58, c: "#4a0914" }, { n: 8, y: -44, rx: 31, ry: 50, c: "#6e1022" },
    { n: 7, y: -34, rx: 26, ry: 41, c: "#8f1529" }, { n: 6, y: -24, rx: 20, ry: 32, c: "#b01f37" },
    { n: 5, y: -14, rx: 14, ry: 22, c: "#c93049" }, { n: 3, y: -6, rx: 8, ry: 12, c: "#e0546a" }
  ];
  let d = 0, s = '<svg class="rose" viewBox="-100 -100 200 200" role="img" aria-label="وردة حمراء"><g transform="translate(0 20)">';
  layers.forEach((L, li) => {
    for (let i = 0; i < L.n; i++) {
      const r = (360 / L.n) * i + li * 17;
      s += `<ellipse cx="0" cy="${L.y}" rx="${L.rx}" ry="${L.ry}" fill="${L.c}" stroke="rgba(0,0,0,.25)" style="--r:${r}deg;--d:${(d += .06).toFixed(2)}s" transform="rotate(${r})"/>`;
    }
  });
  return s + "</g></svg>";
}
function mountRoses(root = document) {
  root.querySelectorAll("[data-rose]").forEach(el => { if (!el.firstChild) el.innerHTML = roseSVG(); });
}

/* Falling petals (lightweight: 16 DOM nodes, pure CSS animation) */
function spawnPetals(count = 16) {
  const box = $("#petals");
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i"), sz = 10 + Math.random() * 14;
    p.className = "petal";
    Object.assign(p.style, {
      left: Math.random() * 100 + "%", width: sz + "px", height: sz * 1.2 + "px",
      animationDuration: 10 + Math.random() * 10 + "s", animationDelay: -Math.random() * 15 + "s"
    });
    p.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
    box.appendChild(p);
  }
}

/* ---------- Music (handles autoplay restrictions) ---------- */
const audio = new Audio(CONFIG.music);
audio.loop = true; audio.volume = CONFIG.volume;
function startMusic() {
  audio.play().catch(() => {
    // Browser blocked it: retry on the very next user interaction
    const retry = () => { audio.play().catch(() => {}); };
    ["click", "touchstart", "keydown"].forEach(e => document.addEventListener(e, retry, { once: true }));
  });
}

/* ---------- Gate ---------- */
function initGate() {
  const form = $("#gateForm"), input = $("#pw");
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (input.value === CONFIG.password) {
      startMusic();                       // inside a user gesture, so allowed
      $("#gate").classList.add("out");
      document.body.classList.remove("locked");
      $("#app").hidden = false;
      mountRoses(); spawnPetals(); initApp();
    } else {
      $("#gateErr").textContent = "اي يحب نسيتي الباسورد بسرعة كدا ؟";
      form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
      input.value = ""; input.focus();
    }
  });
}

/* ---------- Scroll reveal ---------- */
function observe(el, cb, once = true) {
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { cb(el); if (once) io.disconnect(); }
  }, { threshold: .4 });
  io.observe(el);
}

/* ---------- 5. Animated date reveal ---------- */
function dateReveal() {
  const el = $("#firstDate");
  const txt = new Date(CONFIG.first.date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  observe($("#first .tl"), tl => {
    tl.classList.add("in");
    [...txt].forEach((ch, i) => {
      const s = document.createElement("span");
      s.textContent = ch; s.style.animationDelay = i * 0.12 + "s"; el.appendChild(s);
    });
  });
}

/* ---------- 6. Flower of reasons ---------- */
function flower() {
  const f = $("#flower"), out = $("#reasonText"), seen = new Set(), n = CONFIG.reasons.length;
  CONFIG.reasons.forEach((txt, i) => {
    const b = document.createElement("button");
    b.className = "fp"; b.type = "button"; b.setAttribute("aria-label", "بتلة " + (i + 1));
    b.style.setProperty("--a", (360 / n) * i + "deg");
    b.style.setProperty("--d", .2 + i * .18 + "s");
    b.addEventListener("click", () => {
      out.style.opacity = 0;
      setTimeout(() => { out.textContent = txt; out.style.opacity = 1; }, 250);
      b.classList.add("seen"); seen.add(i);
    });
    f.appendChild(b);
  });
}

/* ---------- 7. Live counter (real elapsed time) ---------- */
function counter() {
  const start = new Date(CONFIG.startDate).getTime(), els = { D: $("#cD"), H: $("#cH"), M: $("#cM"), S: $("#cS") };
  const set = (k, v) => {
    if (els[k].textContent !== String(v)) {
      els[k].textContent = v; els[k].classList.remove("tick"); void els[k].offsetWidth; els[k].classList.add("tick");
    }
  };
  const update = () => {
    let t = Math.max(0, Math.floor((Date.now() - start) / 1000));
    set("D", Math.floor(t / 86400)); set("H", Math.floor(t % 86400 / 3600));
    set("M", Math.floor(t % 3600 / 60)); set("S", t % 60);
  };
  update(); setInterval(update, 1000);
  observe($("#counter .cards"), c => c.classList.add("in"));
}

/* ---------- 9. Envelope + typed letter ---------- */
function letter() {
  const env = $("#env"), paper = $("#paper"), out = $("#letterText");
  env.addEventListener("click", () => {
    env.classList.add("open");
    setTimeout(() => {
      paper.classList.add("show"); out.classList.add("typing");
      const text = CONFIG.letter.message; let i = 0;
      (function type() {
        out.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(type, 55); else out.classList.remove("typing");
      })();
    }, 1100);
  }, { once: true });
}

/* ---------- 10. Ending ---------- */
function ending() {
  const rose = $("#endRose");
  observe($("#ending"), () => { rose.innerHTML = roseSVG(); });
  $("#endBtn").addEventListener("click", e => {
    e.target.hidden = true; $("#endMsg").classList.add("show");
  });
}

function initApp() {
  mountRoses(); dateReveal(); flower(); counter(); letter(); ending();
}

bindText(); mountRoses(); initGate();
