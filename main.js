(() => {
  const root = document.documentElement;
  root.classList.add("js");

  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  const marquee = document.querySelector(".marquee");
  if (marquee) {
    const track = marquee.querySelector(".marquee-track");
    const firstGroup = track.querySelector(".marquee-group");

    const fillMarquee = () => {
      const groupWidth = firstGroup.getBoundingClientRect().width;
      if (!groupWidth) return;

      const count = Math.max(2, Math.ceil(marquee.getBoundingClientRect().width / groupWidth) + 1);
      while (track.children.length < count) track.append(firstGroup.cloneNode(true));
      while (track.children.length > count) track.lastElementChild.remove();
      track.style.setProperty("--marquee-offset", `${-100 / count}%`);
      track.style.setProperty("--marquee-duration", `${groupWidth / 86}s`);
    };

    fillMarquee();
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(fillMarquee);
      observer.observe(marquee);
      observer.observe(firstGroup);
    } else {
      window.addEventListener("resize", fillMarquee);
    }
    if (document.fonts) document.fonts.ready.then(fillMarquee);
  }

  /* ---------- Count-up stats ---------- */

  const statValues = $$(".stat-value");
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const formatStat = (el, value) =>
    value.toFixed(Number(el.dataset.decimals || 0)) + (el.dataset.suffix || "");

  function countUp(el, i) {
    const target = Number(el.dataset.target);
    const duration = 1500 + i * 80;
    el.textContent = formatStat(el, 0);
    setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = formatStat(el, target * easeOutCubic(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 480 + i * 90);
  }

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        statsObserver.disconnect();
        statValues.forEach(countUp);
      },
      { threshold: 0.25 }
    );
    const stats = document.querySelector(".stats");
    if (stats) statsObserver.observe(stats);
  }

  /* ---------- Mobile menu ---------- */

  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.querySelector(".overlay");

  function setMenu(open, { restoreFocus = false } = {}) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", labels().burger[open ? 1 : 0]);
    menu.hidden = !open;
    overlay.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) menu.querySelector("a").focus();
    else if (restoreFocus) burger.focus();
  }

  const menuIsOpen = () => burger.getAttribute("aria-expanded") === "true";

  burger.addEventListener("click", () => setMenu(!menuIsOpen(), { restoreFocus: true }));
  overlay.addEventListener("click", () => setMenu(false));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuIsOpen()) setMenu(false, { restoreFocus: true });
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && menuIsOpen()) setMenu(false);
  });

  const navLinks = $$("[data-nav]");
  const sections = $$("[data-section]");

  function setActive(key) {
    navLinks.forEach((link) => {
      const active = link.dataset.nav === key;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.section));
        // Anchor jumps skip past items without intersecting them; never leave those hidden.
        items.forEach((el) => el.getBoundingClientRect().top < 0 && el.classList.add("is-shown"));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in-view");
          revealObserver.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    $$(".block, .contact").forEach((el) => revealObserver.observe(el));

    const items = $$(".block-body > p, .row, .job, .contact > p, .contact-actions");
    items.forEach((el) => el.classList.add("reveal-item"));
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            e.target.style.transitionDelay = i * 70 + "ms";
            e.target.classList.add("is-shown");
            itemObserver.unobserve(e.target);
          });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => itemObserver.observe(el));

    const hero = document.getElementById("inicio");
    new IntersectionObserver(([entry]) => {
      document.body.classList.toggle("past-hero", !entry.isIntersecting);
    }).observe(hero);
  } else {
    $$(".block, .contact").forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Language toggle (EN is the markup; PT lives here) ---------- */

  const pt = {
    "skip": "Pular para o conteúdo",
    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.career": "Trajetória",
    "nav.contact": "Contato",
    "hero.trust": "Software Engineer na RDI Software",
    "hero.h1a": "Gabriel",
    "hero.h1b": "Fuli",
    "hero.sub": "Sou Gabriel Fuli, engenheiro de software full-stack. Construo APIs, automações e integrações de IA que sustentam operações reais em produção.",
    "hero.cta": "Conheça minha trajetória",
    "stat.years": "Anos em tecnologia",
    "stat.markets": "Mercados globais atendidos",
    "stat.prod": "Sistemas críticos em produção",
    "stat.langs": "Idiomas",
    "about.title": "Sobre",
    "about.p1": "Sou engenheiro de computação e trabalho com software desde 2019. Hoje, na RDI Software, desenvolvo novas funcionalidades e investigo incidentes críticos nas aplicações do McDonald's, usadas em mercados como Alemanha, Austrália, Canadá e Estados Unidos.",
    "about.p2": "Gosto do trabalho que exige calma: correlacionar logs entre vários sistemas, reproduzir o problema em ambiente controlado, chegar à causa raiz e entregar uma correção que não quebre nada em outro país. Falo pouco e investigo muito.",
    "about.p3": "No back-end, Node.js é minha ferramenta preferida, ao lado de anos de C# e .NET. Construo e consumo APIs REST, webhooks e autenticação OAuth 2.0, e conecto sistemas, bancos e serviços com workflows em n8n.",
    "ai.title": "IA na prática",
    "ai.lead": "Uso IA generativa como ferramenta de engenharia, não como vitrine: para entregar mais rápido, com mais contexto e com verificação.",
    "ai.1t": "Desenvolvimento agêntico",
    "ai.1d": "Trabalho diário com Claude Code: planejo, delego a agentes, reviso e verifico. O agente escreve; a responsabilidade pelo resultado continua sendo minha.",
    "ai.2t": "Harness engineering",
    "ai.2d": "Monto o ambiente em que os agentes operam: skills, hooks, subagentes, memória persistente e servidores MCP, com portões de qualidade antes de qualquer \"pronto\".",
    "ai.3t": "Integrações de IA e RAG",
    "ai.3d": "Consumo de APIs da OpenAI e da Anthropic aplicado a negócios de clientes, com Retrieval-Augmented Generation para respostas ancoradas nos dados da própria empresa.",
    "ai.4t": "Automação com n8n",
    "ai.4d": "Workflows que ligam APIs, sistemas e bancos de dados, eliminando trabalho manual repetitivo de ponta a ponta.",
    "ai.5t": "Produto próprio",
    "ai.5d": "Desenvolvo o Vibron, uma IDE desktop em Electron pensada para o trabalho com agentes de IA, do editor ao terminal.",
    "career.title": "Trajetória",
    "career.1w": "jun 2022 — hoje",
    "career.1d": "Novas funcionalidades e resolução de incidentes complexos de produção nas aplicações do McDonald's.",
    "career.1a": "Investigo incidentes críticos correlacionando logs entre múltiplos sistemas.",
    "career.1b": "Depuro o código e reproduzo falhas em ambientes controlados até a causa raiz.",
    "career.1c": "Projeto e testo correções sem efeitos colaterais entre mercados: Alemanha, Austrália, Canadá, Estados Unidos e outros.",
    "career.1e": "Colaboro com times globais para validar achados e definir próximos passos.",
    "career.1f": "Apoio outros desenvolvedores em dúvidas e lógica de código, em rotina Scrum.",
    "career.2w": "nov 2020 — mai 2022",
    "career.2d": "Porta de entrada na RDI. Um ano e sete meses aprendendo por dentro as aplicações que depois passei a sustentar como engenheiro.",
    "career.3w": "nov 2019 — abr 2020",
    "career.3t": "Desenvolvedor back-end",
    "career.3d": "Primeira experiência profissional escrevendo software de back-end.",
    "career.4w": "nov 2018 — set 2019",
    "career.4t": "Técnico de suporte em TI",
    "career.4d": "Onde tudo começou: suporte a usuários e infraestrutura, e o hábito de diagnosticar antes de mexer.",
    "stack.data": "Dados",
    "stack.data.d": "PostgreSQL · Supabase · Object storage em nuvem",
    "stack.infra": "Infra e DevOps",
    "stack.infra.d": "Docker · Docker Compose · CI/CD · Linux · Git · Servidores VPS próprios (Contabo) · AWS, Azure e Google Cloud (conhecimento prático)",
    "stack.ai": "IA e automação",
    "stack.practice": "Prática",
    "stack.practice.d": "Debugging de produção · Análise de causa raiz · Scrum",
    "edu.title": "Formação",
    "edu.1t": "Pós-graduação em Engenharia de Software Full-Stack",
    "edu.2t": "Bacharelado em Engenharia da Computação",
    "edu.certs": "Certificações",
    "edu.langs": "Idiomas",
    "edu.langs.d": "Português nativo · Inglês profissional pleno · Espanhol básico",
    "contact.title": "Vamos Conversar",
    "contact.sub": "Prefiro uma boa mensagem escrita a uma ligação inesperada. Respondo todas.",
    "contact.gh": "Ver meu GitHub",
    "contact.li": "Conectar no LinkedIn"
  };

  const ui = {
    en: { burger: ["Open menu", "Close menu"], html: "en" },
    pt: { burger: ["Abrir menu", "Fechar menu"], html: "pt-BR" },
  };

  let lang = "en";
  function labels() {
    return ui[lang];
  }

  const translatable = $$("[data-i18n]");
  const en = Object.fromEntries(translatable.map((el) => [el.dataset.i18n, el.textContent.trim().replace(/\s+/g, " ")]));

  /* Display lines reveal character by character; screen readers get the plain text. */
  function splitChars(el) {
    const text = el.textContent.trim();
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    let i = 0;
    text.split(" ").forEach((word, w, words) => {
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      for (const ch of word) {
        const chEl = document.createElement("span");
        chEl.className = "ch";
        chEl.style.setProperty("--i", i++);
        chEl.textContent = ch;
        wordEl.append(chEl);
      }
      visual.append(wordEl);
      if (w < words.length - 1) visual.append(" ");
    });
    const plain = document.createElement("span");
    plain.className = "sr-only";
    plain.textContent = text;
    el.replaceChildren(plain, visual);
  }

  function setLang(next) {
    lang = next;
    const dict = next === "pt" ? pt : en;
    translatable.forEach((el) => {
      const text = dict[el.dataset.i18n];
      if (!text) return;
      el.textContent = text;
      if (el.classList.contains("split")) splitChars(el);
    });
    root.lang = labels().html;
    $$("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === next));
    });
    burger.setAttribute("aria-label", labels().burger[menuIsOpen() ? 1 : 0]);
    try {
      localStorage.setItem("lang", next);
    } catch {}
  }

  $$("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => setLang(btn.dataset.lang))
  );

  let stored = null;
  try {
    stored = localStorage.getItem("lang");
  } catch {}
  if (stored === "pt") setLang("pt");
  else $$(".split").forEach(splitChars);

  /* ---------- Matrix rain over the hero sky ---------- */

  const matrix = document.querySelector(".matrix");
  const ctx = matrix && matrix.getContext("2d");
  if (ctx) {
    const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\{}[]()#$%&*+=-:;!?@";
    const HEAD = [255, 255, 255];
    const MID = [96, 186, 134]; // soft green just behind the head
    const TAIL = [22, 92, 58]; // deep, non-fluorescent green
    const TRAIL_S = 0.75; // seconds for a lit cell to cool to ~37%
    // Easter egg: now and then six neighbouring drops each carry one letter of this across a row.
    // It cools like any other cell, with only a brief amber tint, so you have to be looking.
    const SECRET = "ALFACE";
    const SECRET_REPEATS = 4;
    const AMBER = [236, 196, 84];
    const newSpeed = () => 4 + Math.random() * 7; // rows per second
    const FRAME_MS = 55;
    const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    const mix = (a, b, t) => Math.round(a + (b - a) * t);

    let cell, cols, rows, glyphs, heat, drops, secret, nextSecretAt = 0, last = 0, rafId = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = matrix.clientWidth;
      const h = matrix.clientHeight;
      matrix.width = w * dpr;
      matrix.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = w < 720 ? 15 : 19;
      cols = Math.ceil(w / cell);
      rows = Math.ceil((h * 0.7) / cell); // the mask hides everything below ~68%
      glyphs = Array.from({ length: cols * rows }, randomGlyph);
      heat = new Float32Array(cols * rows);
      secret = new Uint8Array(cols * rows); // 0 = normal cell, n = nth letter of SECRET
      drops = Array.from({ length: cols }, () => ({ y: (Math.random() * 2 - 1) * rows, speed: newSpeed() }));
      ctx.font = `${cell - 2}px "BubbledotICG-FinePos", "Geist Pixel Circle", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    }

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      // time-based so a throttled tab slows the frame rate, not the look
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      const cool = Math.exp(-dt / TRAIL_S);
      const swapChance = 1.6 * dt;
      ctx.clearRect(0, 0, matrix.clientWidth, matrix.clientHeight);

      if (!nextSecretAt) nextSecretAt = now + 5000;
      if (now > nextSecretAt && cols > SECRET.length + 2) {
        nextSecretAt = now + 15000 + Math.random() * 5000;
        // Letters sit on a diagonal and light up strictly in order, first to last or last to first,
        // so the word can be read as it sweeps across, never from the middle out.
        const maxRow = Math.floor(rows * 0.55); // below this the mask has faded the rain out
        const step = maxRow >= 16 ? 2 : 1;
        const span = step * (SECRET.length - 1) + SECRET_REPEATS;
        const baseRow = 1 + ((Math.random() * Math.max(1, maxRow - span)) | 0);
        const col = 1 + ((Math.random() * (cols - SECRET.length - 1)) | 0);
        const rising = Math.random() < 0.5; // diagonal climbs or descends from A to E
        const reversed = Math.random() < 0.5; // E lights first instead of A
        const speed = 6.5;
        for (let k = 0; k < SECRET.length; k++) {
          const row = baseRow + step * (rising ? SECRET.length - 1 - k : k);
          // the letter repeats down its column, so the drop paints it a few times as it falls
          for (let rep = 0; rep < SECRET_REPEATS; rep++) {
            const s = (row + rep) * cols + col + k;
            if (s >= secret.length) break;
            secret[s] = k + 1;
            glyphs[s] = SECRET[k];
            heat[s] = 0; // stay dark until this column's head arrives
          }
          // same speed for all six; each head is placed to reach its letter 0.22s after the previous one
          const order = reversed ? SECRET.length - 1 - k : k;
          drops[col + k] = { y: row - speed * (0.5 + order * 0.22), speed };
        }
      }

      for (let x = 0; x < cols; x++) {
        const drop = drops[x];
        const prevRow = Math.floor(drop.y);
        drop.y += drop.speed * dt;
        const headRow = Math.floor(drop.y);
        // light every row the head crossed this frame, so fast drops leave no gaps
        for (let r = Math.max(prevRow + 1, 0); r <= headRow && r < rows; r++) heat[r * cols + x] = 1;
        if (drop.y > rows + 6) {
          drop.y = -Math.random() * rows * 0.6;
          drop.speed = newSpeed();
        }

        for (let y = 0; y < rows; y++) {
          const i = y * cols + x;
          const v = heat[i];
          if (v < 0.03) continue;
          // lit cells keep swapping glyphs, which is what makes the rain feel alive
          if (secret[i]) {
            // holds its letter while bright, then rejoins the rain and scrambles like the rest
            if (v < 0.25) secret[i] = 0;
            heat[i] = v * cool;
            const t = Math.min(1, (1 - v) / 0.72); // amber long enough for the repeats to be seen together
            ctx.fillStyle = `rgba(${mix(AMBER[0], MID[0], t)},${mix(AMBER[1], MID[1], t)},${mix(AMBER[2], MID[2], t)},${Math.min(1, 0.18 + v).toFixed(2)})`;
            ctx.fillText(glyphs[i], x * cell + cell / 2, y * cell + cell / 2);
            continue;
          }
          if (Math.random() < swapChance) glyphs[i] = randomGlyph();
          heat[i] = v * cool;

          // white head -> soft green -> deep green as the cell cools
          const from = v > 0.85 ? HEAD : MID;
          const to = v > 0.85 ? MID : TAIL;
          const t = v > 0.85 ? (1 - v) / 0.15 : 1 - v / 0.85;
          ctx.fillStyle = `rgba(${mix(from[0], to[0], t)},${mix(from[1], to[1], t)},${mix(from[2], to[2], t)},${Math.min(1, 0.18 + v).toFixed(2)})`;
          ctx.fillText(glyphs[i], x * cell + cell / 2, y * cell + cell / 2);
        }
      }
    }

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.fonts && document.fonts.ready.then(resize);
    // no point painting glyphs nobody can see
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(
        document.getElementById("inicio")
      );
    }
  }

  /* ---------- Pointer-driven motion (fine pointers only) ---------- */

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer) {
    const heroContent = document.querySelector(".hero");
    window.addEventListener(
      "pointermove",
      (e) => {
        if (document.body.classList.contains("past-hero")) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        heroContent.style.translate = `${(nx * 10).toFixed(1)}px ${(ny * 6).toFixed(1)}px`;
      },
      { passive: true }
    );

    $$(".magnet").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = `${(dx * 0.28).toFixed(1)}px ${(dy * 0.4).toFixed(1)}px`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.translate = "";
      });
    });
  }
})();
