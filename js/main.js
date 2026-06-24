(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intro = document.querySelector("#intro");
  const progress = document.querySelector(".scroll-meter span");
  const navLinks = Array.from(document.querySelectorAll(".chapter-nav a"));
  const playButton = document.querySelector('[data-audio="play"]');
  const muteButton = document.querySelector('[data-audio="mute"]');
  const volumeInput = document.querySelector('[data-audio="volume"]');

  const setIcon = (button, icon, label) => {
    if (!button) return;
    button.innerHTML = `<i data-lucide="${icon}"></i>`;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    if (window.lucide) window.lucide.createIcons();
  };

  const finishIntro = () => {
    intro?.classList.add("is-finished");
  };

  window.addEventListener("load", () => {
    window.setTimeout(finishIntro, 3400);
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) window.lucide.createIcons();
    window.setTimeout(finishIntro, 4300);
    setupLazyMedia();
    setupAudio();
    setupMotion();
    setupParticles();
  });

  function setupLazyMedia() {
    const imageTargets = Array.from(document.querySelectorAll(".lazy-bg"));
    const videoTargets = Array.from(document.querySelectorAll(".lazy-video"));

    const loadBackground = (element) => {
      const source = element.dataset.bg;
      if (!source || element.classList.contains("is-loaded")) return;

      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        element.style.setProperty("--bg", `url("${source}")`);
        element.classList.add("is-loaded");
      };
      image.src = source;
    };

    const loadVideo = (video) => {
      const source = video.dataset.src;
      if (!source || video.src) return;
      video.src = source;
      video.load();
      video.play().catch(() => {});
    };

    if (!("IntersectionObserver" in window)) {
      imageTargets.forEach(loadBackground);
      videoTargets.forEach(loadVideo);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.matches(".lazy-video")) {
            loadVideo(entry.target);
          } else {
            loadBackground(entry.target);
          }
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "420px 0px" }
    );

    imageTargets.forEach((element) => observer.observe(element));
    videoTargets.forEach((video) => observer.observe(video));
  }

  function setupAudio() {
    class CinemaSound {
      constructor() {
        this.context = null;
        this.master = null;
        this.started = false;
        this.muted = false;
        this.volume = Number(volumeInput?.value || 0.42);
        this.nodes = [];
      }

      async start() {
        if (!this.context) this.createGraph();
        if (!this.context) return false;
        await this.context.resume();
        if (!this.started) {
          this.started = true;
          this.engineStartup();
          window.setTimeout(() => this.garageDoor(), 1200);
        }
        this.applyVolume();
        return true;
      }

      pause() {
        if (!this.context) return;
        this.context.suspend();
      }

      isRunning() {
        return this.context && this.context.state === "running";
      }

      setMuted(value) {
        this.muted = value;
        this.applyVolume();
      }

      setVolume(value) {
        this.volume = value;
        this.applyVolume();
      }

      applyVolume() {
        if (!this.master) return;
        const now = this.context.currentTime;
        const level = this.muted ? 0 : this.volume;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.linearRampToValueAtTime(level, now + 0.08);
      }

      createGraph() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.context.destination);
        this.ambientPad();
        this.cityTexture();
      }

      ambientPad() {
        const now = this.context.currentTime;
        const padGain = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 520;
        padGain.gain.value = 0.08;
        filter.connect(padGain);
        padGain.connect(this.master);

        [48, 72, 96].forEach((frequency, index) => {
          const oscillator = this.context.createOscillator();
          oscillator.type = index === 0 ? "sine" : "triangle";
          oscillator.frequency.value = frequency;
          oscillator.detune.value = index * 6;
          oscillator.connect(filter);
          oscillator.start(now);
          this.nodes.push(oscillator);
        });
      }

      cityTexture() {
        const buffer = this.noiseBuffer(2);
        const noise = this.context.createBufferSource();
        const filter = this.context.createBiquadFilter();
        const gain = this.context.createGain();

        noise.buffer = buffer;
        noise.loop = true;
        filter.type = "bandpass";
        filter.frequency.value = 900;
        filter.Q.value = 0.55;
        gain.gain.value = 0.025;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
        noise.start();
        this.nodes.push(noise);
      }

      engineStartup() {
        const now = this.context.currentTime;
        const engine = this.context.createOscillator();
        const growl = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        engine.type = "sawtooth";
        growl.type = "square";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(420, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 1.1);
        filter.frequency.exponentialRampToValueAtTime(620, now + 2.1);

        engine.frequency.setValueAtTime(42, now);
        engine.frequency.exponentialRampToValueAtTime(132, now + 0.55);
        engine.frequency.exponentialRampToValueAtTime(74, now + 1.9);
        growl.frequency.setValueAtTime(22, now);
        growl.frequency.exponentialRampToValueAtTime(48, now + 0.75);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.28, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 2.15);

        engine.connect(filter);
        growl.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
        engine.start(now);
        growl.start(now);
        engine.stop(now + 2.25);
        growl.stop(now + 2.25);
      }

      garageDoor() {
        const now = this.context.currentTime;
        const source = this.context.createBufferSource();
        const filter = this.context.createBiquadFilter();
        const gain = this.context.createGain();

        source.buffer = this.noiseBuffer(2.4);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(160, now);
        filter.frequency.linearRampToValueAtTime(420, now + 1.6);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.03, now + 2.35);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
        source.start(now);
      }

      noiseBuffer(duration) {
        const length = Math.floor(this.context.sampleRate * duration);
        const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        let previous = 0;

        for (let i = 0; i < length; i += 1) {
          const white = Math.random() * 2 - 1;
          previous = previous * 0.93 + white * 0.07;
          data[i] = previous;
        }

        return buffer;
      }
    }

    const sound = new CinemaSound();

    playButton?.addEventListener("click", async () => {
      if (!sound.context || !sound.isRunning()) {
        const started = await sound.start();
        if (started) setIcon(playButton, "pause", "Pause ambience");
      } else {
        sound.pause();
        setIcon(playButton, "play", "Play ambience");
      }
    });

    muteButton?.addEventListener("click", async () => {
      if (!sound.context) {
        const started = await sound.start();
        if (!started) return;
      }
      sound.setMuted(!sound.muted);
      setIcon(muteButton, sound.muted ? "volume-x" : "volume-2", sound.muted ? "Unmute" : "Mute");
      if (sound.isRunning()) setIcon(playButton, "pause", "Pause ambience");
    });

    volumeInput?.addEventListener("input", (event) => {
      sound.setVolume(Number(event.target.value));
    });
  }

  function setupMotion() {
    if (!window.gsap || !window.ScrollTrigger) {
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progress) progress.style.width = `${self.progress * 100}%`;
      }
    });

    document.querySelectorAll("[data-chapter]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (!self.isActive) return;
          const targetId = section.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("is-active", Boolean(targetId && href === targetId));
          });
        }
      });
    });

    if (prefersReducedMotion) return;

    gsap.utils.toArray(".scene-content, .vehicle-content").forEach((content) => {
      gsap.from(content, {
        y: 46,
        opacity: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: content,
          start: "top 78%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".lazy-bg").forEach((section) => {
      gsap.fromTo(
        section,
        { backgroundPosition: "center 42%" },
        {
          backgroundPosition: "center 58%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    gsap.utils.toArray(".vehicle").forEach((vehicle) => {
      gsap.fromTo(
        vehicle,
        { filter: "brightness(0.72) saturate(0.86)" },
        {
          filter: "brightness(1.07) saturate(1.04)",
          ease: "none",
          scrollTrigger: {
            trigger: vehicle,
            start: "top 88%",
            end: "center 35%",
            scrub: true
          }
        }
      );
    });

    gsap.utils.toArray(".quote-stack p").forEach((quote, index) => {
      gsap.from(quote, {
        y: 34,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: quote,
          start: "top 86%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".word-cloud span").forEach((word, index) => {
      gsap.to(word, {
        yPercent: index % 2 === 0 ? -30 : 30,
        xPercent: index % 2 === 0 ? 12 : -12,
        ease: "none",
        scrollTrigger: {
          trigger: "#discipline",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    gsap.utils.toArray(".counter").forEach((counter) => {
      const number = counter.querySelector("strong");
      const target = Number(counter.dataset.target || 0);
      const suffix = counter.dataset.suffix || "";
      const value = { current: 0 };

      gsap.to(value, {
        current: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          number.textContent = `${Math.round(value.current).toLocaleString()}${suffix}`;
        },
        scrollTrigger: {
          trigger: counter,
          start: "top 82%",
          once: true
        }
      });
    });

    gsap.to(".garage-door-left", {
      x: 0,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#finale",
        start: "top 55%",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".garage-door-right", {
      x: 0,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#finale",
        start: "top 55%",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.from(".finale-content", {
      opacity: 0,
      scale: 0.96,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#finale",
        start: "top 45%"
      }
    });
  }

  function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  }

  function setupParticles() {
    if (prefersReducedMotion) return;

    const canvas = document.querySelector("#particles");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const particles = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.length = 0;

      const count = width > 900 ? 62 : 32;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.7 + 0.45,
          speed: Math.random() * 0.22 + 0.08,
          drift: (Math.random() - 0.5) * 0.16,
          alpha: Math.random() * 0.42 + 0.08
        });
      }
    };

    const draw = () => {
      frame = window.requestAnimationFrame(draw);
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -10) particle.y = height + 10;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 5
        );
        gradient.addColorStop(0, `rgba(248, 242, 231, ${particle.alpha})`);
        gradient.addColorStop(0.5, `rgba(200, 163, 90, ${particle.alpha * 0.28})`);
        gradient.addColorStop(1, "rgba(248, 242, 231, 0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        context.fill();
      });
    };

    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
      } else {
        draw();
      }
    });
  }
})();
