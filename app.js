/* ==========================================================
   ROMANTIC PIXEL FLIGHT v4.0 - MULTI-LEVEL SHOOTER & FINAL BOSS
   ========================================================== */

(function () {
  "use strict";

  const TARGET_PHONE = "6289674037725";

  // APP STATE
  const state = {
    audioEnabled: false,
    currentSong: 1,
    songTitles: {
      1: "Bouncing Kitty Love 🐾",
      2: "Chibi Airplane Flight ✈️",
      3: "Strawberry Boba Pop 🧋",
      4: "Peluk Pilot Meow 💖"
    },
    heartsCollected: 0,
    targetHearts: 5,
    selectedTebusan: "Traktir Boba / Es Krim pas ketemu nanti! 🧋🍦",
    quizScore: 0,
    quizFinished: false,
    quizResultTitle: "KANGEN TINGKAT DEWA (1000%)! 🏆",
    currentDialogueIndex: 0,
    activeMode: "3d",
    autoRotate3D: true,
    isRolling3D: false,
    orbitSpeed2D: 0.02,
    orbitDirection2D: 1,
    orbitAngle2D: 0,
    envelopeOpened: false,

    // SHOOTER MULTI-LEVEL & BOSS STATE
    shooterGameActive: false,
    shooterLevel: 1, // 1: Level 1, 2: Level 2, 3: Boss Battle
    shooterLives: 3,
    levelKills: 0,
    levelTargetKills: 5,
    bossMaxHp: 20,
    bossHp: 20,
    bossDefeated: false,
    shooterGameOver: false
  };

  /* ==========================================================
     1. WEB AUDIO API - PROCEDURAL RETRO SOUND SYSTEM
     ========================================================== */
  let audioCtx = null;
  let bgmInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playBlipSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  function playLaserSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.11);
    } catch (e) {}
  }

  function playPopExplosionSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {}
  }

  function playHitHurtSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.21);
    } catch (e) {}
  }

  function playCoinSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1567.98, audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.31);
    } catch (e) {}
  }

  function playVictorySound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.26);
      });
    } catch (e) {}
  }

  function playWhooshSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.22);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.46);
    } catch (e) {}
  }

  const kawaiiSongs = {
    1: {
      speed: 150,
      notes: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 880.00, 1046.50, 987.77, 783.99, 659.25, 587.33, 659.25, 783.99, 1046.50, 1174.66],
      type: "sine"
    },
    2: {
      speed: 160,
      notes: [392.00, 523.25, 659.25, 523.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33, 523.25, 440.00, 523.25, 659.25, 783.99, 1046.50],
      type: "square"
    },
    3: {
      speed: 190,
      notes: [659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51, 1046.50],
      type: "triangle"
    },
    4: {
      speed: 210,
      notes: [523.25, 659.25, 880.00, 783.99, 659.25, 523.25, 440.00, 523.25, 587.33, 659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 523.25],
      type: "sine"
    }
  };

  function startBgmLoop() {
    if (bgmInterval) clearInterval(bgmInterval);
    const song = kawaiiSongs[state.currentSong] || kawaiiSongs[1];
    let noteIdx = 0;
    const bars = document.getElementById("visualizer-bars");
    if (bars) bars.classList.add("playing");

    bgmInterval = setInterval(() => {
      if (!state.audioEnabled || !audioCtx) return;
      try {
        const freq = song.notes[noteIdx];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = song.type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const vol = song.type === "square" ? 0.025 : 0.055;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.17);
        noteIdx = (noteIdx + 1) % song.notes.length;
      } catch (e) {}
    }, song.speed);
  }

  function stopBgmLoop() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    const bars = document.getElementById("visualizer-bars");
    if (bars) bars.classList.remove("playing");
  }

  /* ==========================================================
     2. BUTTON PARTICLE BURST ENGINE
     ========================================================== */
  function spawnButtonSparkles(x, y) {
    const emojis = ["✨", "💖", "⭐", "🐱", "🐾", "💫"];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "btn-sparkle-particle";
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 40 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 360;

      p.style.setProperty("--tx", `${tx}px`);
      p.style.setProperty("--ty", `${ty}px`);
      p.style.setProperty("--rot", `${rot}deg`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  function initButtonParticles() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button, a, .song-card-3d, .envelope-wrapper-3d, .quiz-option-btn-3d");
      if (btn) spawnButtonSparkles(e.clientX, e.clientY);
    });
  }

  /* ==========================================================
     3. BACKGROUND AMBIENT CANVAS (PASTEL CLOUDS & HEARTS)
     ========================================================== */
  function initAmbientCanvas() {
    const canvas = document.getElementById("ambient-canvas");
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        type: "cloud",
        x: Math.random() * width,
        y: Math.random() * (height * 0.7),
        size: 35 + Math.random() * 45,
        speed: 0.15 + Math.random() * 0.25,
        alpha: 0.35 + Math.random() * 0.3
      });
    }

    for (let i = 0; i < 18; i++) {
      particles.push({
        type: "heart",
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 9,
        vy: -0.4 - Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        alpha: 0.5 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? "#f43f5e" : "#fb7185"
      });
    }

    function drawPixelHeart(x, y, s, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      const u = s / 7;
      const map = [
        [0, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0]
      ];
      for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
          if (map[r][c]) {
            ctx.fillRect(Math.floor(x + c * u), Math.floor(y + r * u), Math.ceil(u), Math.ceil(u));
          }
        }
      }
      ctx.restore();
    }

    function drawFluffyCloud(x, y, s, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, s * 0.5, 0, Math.PI * 2);
      ctx.arc(x + s * 0.4, y - s * 0.15, s * 0.6, 0, Math.PI * 2);
      ctx.arc(x + s * 0.8, y, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        if (p.type === "cloud") {
          p.x += p.speed;
          if (p.x > width + 100) {
            p.x = -120;
            p.y = Math.random() * (height * 0.7);
          }
          drawFluffyCloud(p.x, p.y, p.size, p.alpha);
        } else if (p.type === "heart") {
          p.y += p.vy;
          p.x += p.vx;
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          drawPixelHeart(p.x, p.y, p.size, p.color, p.alpha);
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ==========================================================
     4. MODE 1: THREE.JS 3D VOXEL CAT AIRPLANE
     ========================================================== */
  let threeScene, threeCamera, threeRenderer, threeControls;
  let airplaneGroup, propellerMesh;

  function resize3D() {
    const container = document.getElementById("three-container");
    if (!container || !threeCamera || !threeRenderer) return;
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 440;
    threeCamera.aspect = w / h;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(w, h);
  }

  function initThreeVoxelPlane() {
    const container = document.getElementById("three-container");
    if (!window.THREE) return;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 440;

    threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0xbfe9ff);
    threeScene.fog = new THREE.FogExp2(0xbfe9ff, 0.015);

    threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    threeCamera.position.set(0, 10, 24);

    threeRenderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    threeRenderer.shadowMap.enabled = true;
    container.appendChild(threeRenderer.domElement);

    threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
    threeControls.enableDamping = true;
    threeControls.dampingFactor = 0.05;
    threeControls.autoRotate = state.autoRotate3D;
    threeControls.autoRotateSpeed = 2.0;
    threeControls.minDistance = 10;
    threeControls.maxDistance = 45;

    const ambientLight = new THREE.AmbientLight(0xfff1f2, 0.85);
    threeScene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.0);
    sunLight.position.set(20, 30, 25);
    sunLight.castShadow = true;
    threeScene.add(sunLight);

    const pinkFillLight = new THREE.PointLight(0xf472b6, 0.9, 50);
    pinkFillLight.position.set(-15, -10, 15);
    threeScene.add(pinkFillLight);

    airplaneGroup = new THREE.Group();
    threeScene.add(airplaneGroup);

    const voxelMat = (hexColor) => new THREE.MeshLambertMaterial({ color: hexColor });

    function addVoxel(w, h, d, hex, x, y, z, parent = airplaneGroup) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, voxelMat(hex));
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    // Fuselage
    addVoxel(3.6, 2.8, 9.0, 0xdb2777, 0, 0, 0);
    addVoxel(3.8, 1.0, 5.0, 0xf43f5e, 0, 1.0, 0.5);
    addVoxel(2.8, 2.0, 2.5, 0xbe123c, 0, 0.3, -5.2);

    // Wings
    addVoxel(15.0, 0.5, 3.2, 0x0284c7, 0, -0.2, 1.0);
    addVoxel(2.0, 0.6, 3.4, 0xf472b6, 7.5, -0.2, 1.0);
    addVoxel(2.0, 0.6, 3.4, 0xf472b6, -7.5, -0.2, 1.0);

    // Tail
    addVoxel(0.5, 3.5, 2.4, 0xf43f5e, 0, 2.0, -5.5);
    addVoxel(6.5, 0.4, 1.8, 0x0284c7, 0, 0.8, -5.5);

    // Canopy
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.6 });
    const canopyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 3.6), glassMat);
    canopyMesh.position.set(0, 1.8, 1.0);
    airplaneGroup.add(canopyMesh);

    // Chibi Cat Pilot Inside
    const catGroup = new THREE.Group();
    catGroup.position.set(0, 1.2, 1.2);
    airplaneGroup.add(catGroup);

    addVoxel(2.0, 1.8, 1.8, 0xffffff, 0, 0.4, 0, catGroup);
    addVoxel(0.5, 0.7, 0.5, 0xffffff, -0.7, 1.5, 0.1, catGroup);
    addVoxel(0.3, 0.5, 0.3, 0xf472b6, -0.7, 1.5, 0.25, catGroup);
    addVoxel(0.5, 0.7, 0.5, 0xffffff, 0.7, 1.5, 0.1, catGroup);
    addVoxel(0.3, 0.5, 0.3, 0xf472b6, 0.7, 1.5, 0.25, catGroup);
    addVoxel(0.35, 0.45, 0.2, 0x1e1b4b, -0.45, 0.5, 0.95, catGroup);
    addVoxel(0.15, 0.15, 0.22, 0xffffff, -0.5, 0.6, 0.96, catGroup);
    addVoxel(0.35, 0.45, 0.2, 0x1e1b4b, 0.45, 0.5, 0.95, catGroup);
    addVoxel(0.15, 0.15, 0.22, 0xffffff, 0.4, 0.6, 0.96, catGroup);
    addVoxel(0.4, 0.25, 0.2, 0xf43f5e, -0.65, 0.2, 0.95, catGroup);
    addVoxel(0.4, 0.25, 0.2, 0xf43f5e, 0.65, 0.2, 0.95, catGroup);
    addVoxel(0.25, 0.2, 0.2, 0xf43f5e, 0, 0.3, 0.98, catGroup);
    addVoxel(2.2, 0.4, 0.3, 0x92400e, 0, 0.9, 0.8, catGroup);
    addVoxel(0.7, 0.6, 0.3, 0xfacc15, -0.5, 0.9, 0.95, catGroup);
    addVoxel(0.7, 0.6, 0.3, 0xfacc15, 0.5, 0.9, 0.95, catGroup);
    addVoxel(0.45, 0.45, 0.6, 0xffffff, -0.7, 0.0, 1.4, catGroup);
    addVoxel(0.45, 0.45, 0.6, 0xffffff, 0.7, 0.0, 1.4, catGroup);

    // Propeller
    const propGroup = new THREE.Group();
    propGroup.position.set(0, 0, 4.8);
    airplaneGroup.add(propGroup);
    addVoxel(0.8, 0.8, 0.6, 0xfacc15, 0, 0, 0, propGroup);
    propellerMesh = new THREE.Group();
    addVoxel(0.5, 4.2, 0.15, 0xffffff, 0, 0, 0.35, propellerMesh);
    addVoxel(4.2, 0.5, 0.15, 0xffffff, 0, 0, 0.35, propellerMesh);
    propGroup.add(propellerMesh);

    // Clouds
    for (let c = 0; c < 10; c++) {
      const cloud = new THREE.Group();
      const numBlocks = 6 + Math.floor(Math.random() * 5);
      for (let b = 0; b < numBlocks; b++) {
        const bs = 1.4 + Math.random() * 1.6;
        addVoxel(bs, bs, bs, 0xffffff, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 5, cloud);
      }
      cloud.position.set((Math.random() - 0.5) * 60, -10 + Math.random() * 18, (Math.random() - 0.5) * 60);
      threeScene.add(cloud);
    }

    window.addEventListener("resize", resize3D);

    // 360-Degree Slider & Angle HUD hook
    const slider360 = document.getElementById("slider-360-main");
    const angleLbl = document.getElementById("angle-degrees-lbl-main");

    if (slider360) {
      slider360.addEventListener("input", (e) => {
        state.autoRotate3D = false;
        threeControls.autoRotate = false;
        document.getElementById("btn-toggle-rotate").textContent = "🔄 AUTO PUTAR 360°: OFF";
        const deg = parseFloat(e.target.value);
        const rad = deg * (Math.PI / 180);
        const dist = 24;
        threeCamera.position.x = dist * Math.sin(rad);
        threeCamera.position.z = dist * Math.cos(rad);
        threeControls.update();
        if (angleLbl) angleLbl.textContent = `SUDUT: ${Math.round(deg)}°`;
      });
    }

    threeControls.addEventListener("change", () => {
      if (angleLbl && threeCamera) {
        let angleRad = Math.atan2(threeCamera.position.x, threeCamera.position.z);
        let deg = Math.round(((angleRad * (180 / Math.PI)) + 360) % 360);
        angleLbl.textContent = `SUDUT: ${deg}°`;
        if (slider360) slider360.value = deg;
      }
    });

    function animateThree() {
      requestAnimationFrame(animateThree);
      if (state.activeMode === "3d" && !state.shooterGameActive) {
        if (propellerMesh) propellerMesh.rotation.z += 0.45;
        if (!state.isRolling3D) {
          airplaneGroup.position.y = Math.sin(Date.now() * 0.003) * 0.5;
          airplaneGroup.rotation.z = Math.sin(Date.now() * 0.002) * 0.08;
        }
        threeControls.update();
        threeRenderer.render(threeScene, threeCamera);
      }
    }
    animateThree();
  }

  function doBarrelRoll() {
    if (state.isRolling3D || !airplaneGroup) return;
    state.isRolling3D = true;
    playWhooshSound();

    let rollProgress = 0;
    const initialZ = airplaneGroup.rotation.z;
    const rollInterval = setInterval(() => {
      rollProgress += 0.15;
      airplaneGroup.rotation.z += 0.15;
      if (rollProgress >= Math.PI * 2) {
        clearInterval(rollInterval);
        airplaneGroup.rotation.z = initialZ;
        state.isRolling3D = false;
        spawnHeartsConfetti();
      }
    }, 16);
  }

  /* ==========================================================
     5. MODE 2: 2D RADAR CANVAS ORBIT
     ========================================================== */
  let canvas2D, ctx2D;

  function resize2D() {
    if (!canvas2D || !canvas2D.parentElement) return;
    canvas2D.width = canvas2D.parentElement.clientWidth || 800;
    canvas2D.height = canvas2D.parentElement.clientHeight || 440;
  }

  function init2DOrbitCanvas() {
    canvas2D = document.getElementById("canvas-2d-orbit");
    ctx2D = canvas2D.getContext("2d");
    resize2D();
    window.addEventListener("resize", resize2D);

    canvas2D.addEventListener("mousemove", (e) => {
      if (state.activeMode !== "2d") return;
      const rect = canvas2D.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const targetAngle = Math.atan2(e.clientY - rect.top - cy, e.clientX - rect.left - cx);
      state.orbitAngle2D += (targetAngle - state.orbitAngle2D) * 0.05;
    });

    const smokeTrails = [];

    function render2D() {
      requestAnimationFrame(render2D);
      if (state.activeMode !== "2d" || state.shooterGameActive) return;

      const w = canvas2D.width;
      const h = canvas2D.height;
      const cx = w / 2;
      const cy = h / 2;
      const orbitRadius = Math.min(w, h) * 0.35;

      ctx2D.clearRect(0, 0, w, h);

      const skyGrad = ctx2D.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#bae6fd");
      skyGrad.addColorStop(0.7, "#fbcfe8");
      skyGrad.addColorStop(1, "#fed7aa");
      ctx2D.fillStyle = skyGrad;
      ctx2D.fillRect(0, 0, w, h);

      ctx2D.save();
      ctx2D.strokeStyle = "rgba(2, 132, 199, 0.35)";
      ctx2D.lineWidth = 3;
      ctx2D.setLineDash([8, 8]);
      ctx2D.beginPath();
      ctx2D.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
      ctx2D.stroke();
      ctx2D.restore();

      // Center Heart Island
      const islandScale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      ctx2D.save();
      ctx2D.translate(cx, cy);
      ctx2D.scale(islandScale, islandScale);

      const grad = ctx2D.createRadialGradient(0, 0, 10, 0, 0, 55);
      grad.addColorStop(0, "rgba(244, 63, 94, 0.7)");
      grad.addColorStop(1, "rgba(244, 63, 94, 0)");
      ctx2D.fillStyle = grad;
      ctx2D.beginPath();
      ctx2D.arc(0, 0, 55, 0, Math.PI * 2);
      ctx2D.fill();

      ctx2D.font = "32px sans-serif";
      ctx2D.textAlign = "center";
      ctx2D.textBaseline = "middle";
      ctx2D.fillText("💖", 0, 0);

      ctx2D.font = "14px 'Press Start 2P', monospace";
      ctx2D.fillStyle = "#1e1b4b";
      ctx2D.fillText("LOVE", 0, 36);
      ctx2D.restore();

      state.orbitAngle2D += state.orbitSpeed2D * state.orbitDirection2D;
      const planeX = cx + Math.cos(state.orbitAngle2D) * orbitRadius;
      const planeY = cy + Math.sin(state.orbitAngle2D) * orbitRadius;
      const planeHeading = state.orbitAngle2D + (state.orbitDirection2D > 0 ? Math.PI / 2 : -Math.PI / 2);

      if (Math.random() > 0.4) {
        smokeTrails.push({
          x: planeX - Math.cos(planeHeading) * 16,
          y: planeY - Math.sin(planeHeading) * 16,
          radius: 3 + Math.random() * 3,
          alpha: 0.8,
          isHeart: Math.random() > 0.5
        });
      }

      for (let i = smokeTrails.length - 1; i >= 0; i--) {
        const t = smokeTrails[i];
        t.alpha -= 0.02;
        t.radius += 0.2;
        if (t.alpha <= 0) {
          smokeTrails.splice(i, 1);
          continue;
        }
        ctx2D.save();
        ctx2D.globalAlpha = t.alpha;
        if (t.isHeart) {
          ctx2D.fillStyle = "#fb7185";
          ctx2D.fillRect(t.x - 3, t.y - 3, 6, 6);
        } else {
          ctx2D.fillStyle = "#ffffff";
          ctx2D.fillRect(t.x - t.radius / 2, t.y - t.radius / 2, t.radius, t.radius);
        }
        ctx2D.restore();
      }

      ctx2D.save();
      ctx2D.translate(planeX, planeY);
      ctx2D.rotate(planeHeading);

      ctx2D.fillStyle = "#db2777";
      ctx2D.fillRect(-12, -7, 24, 14);
      ctx2D.fillStyle = "#0284c7";
      ctx2D.fillRect(-4, -20, 8, 40);
      ctx2D.fillStyle = "#fb7185";
      ctx2D.fillRect(-4, -20, 8, 4);
      ctx2D.fillRect(-4, 16, 8, 4);

      ctx2D.fillStyle = "#67e8f9";
      ctx2D.fillRect(0, -5, 10, 10);
      ctx2D.fillStyle = "#ffffff";
      ctx2D.fillRect(2, -4, 7, 8);
      ctx2D.fillStyle = "#1e1b4b";
      ctx2D.fillRect(7, -2, 2, 2);
      ctx2D.fillRect(7, 1, 2, 2);

      ctx2D.fillStyle = "#facc15";
      ctx2D.fillRect(12, -2, 3, 4);
      const propAngle = Date.now() * 0.05;
      ctx2D.save();
      ctx2D.translate(14, 0);
      ctx2D.rotate(propAngle);
      ctx2D.fillStyle = "#ffffff";
      ctx2D.fillRect(-2, -9, 4, 18);
      ctx2D.restore();

      ctx2D.restore();
    }
    render2D();
  }

  /* ==========================================================
     6. MODE SWITCHER TABS
     ========================================================== */
  function initModeSwitcher() {
    const tab3D = document.getElementById("tab-3d");
    const tab2D = document.getElementById("tab-2d");
    const view3D = document.getElementById("view-3d-wrapper");
    const view2D = document.getElementById("view-2d-wrapper");

    tab3D.addEventListener("click", () => {
      playBlipSound();
      state.activeMode = "3d";
      tab3D.classList.add("active-mode");
      tab2D.classList.remove("active-mode");
      view3D.style.display = "block";
      view2D.style.display = "none";
      setTimeout(resize3D, 20);
    });

    tab2D.addEventListener("click", () => {
      playBlipSound();
      state.activeMode = "2d";
      tab2D.classList.add("active-mode");
      tab3D.classList.remove("active-mode");
      view2D.style.display = "block";
      view3D.style.display = "none";
      setTimeout(resize2D, 20);
    });

    document.getElementById("btn-barrel-roll").addEventListener("click", doBarrelRoll);

    const btnToggleRotate = document.getElementById("btn-toggle-rotate");
    btnToggleRotate.addEventListener("click", () => {
      playBlipSound();
      state.autoRotate3D = !state.autoRotate3D;
      if (threeControls) threeControls.autoRotate = state.autoRotate3D;
      btnToggleRotate.textContent = state.autoRotate3D ? "🔄 AUTO PUTAR 360°: ON" : "🔄 AUTO PUTAR 360°: OFF";
    });

    document.getElementById("btn-reset-cam").addEventListener("click", () => {
      playBlipSound();
      if (threeCamera && threeControls) {
        threeCamera.position.set(0, 10, 24);
        threeControls.target.set(0, 0, 0);
        threeControls.update();
      }
    });

    const btnBoost2D = document.getElementById("btn-boost-2d");
    btnBoost2D.addEventListener("click", () => {
      playWhooshSound();
      state.orbitSpeed2D = 0.08;
      btnBoost2D.textContent = "⚡ TURBO AKTIF!";
      setTimeout(() => {
        state.orbitSpeed2D = 0.02;
        btnBoost2D.textContent = "🚀 TURBO SPEED!";
      }, 1500);
    });

    document.getElementById("btn-reverse-orbit").addEventListener("click", () => {
      playBlipSound();
      state.orbitDirection2D *= -1;
    });
  }

  /* ==========================================================
     7. RPG DIALOGUE SYSTEM
     ========================================================== */
  const dialogues = [
    "Meoww! 🐱✈️ Kapten Kitty mendarat membawa misi cinta spesial di layar cerah ini!",
    "Psstt... Si pembikin web ini tuh KANGEN BANGET TAUUU sama kamu! Tiap detik kepikiran terus! 🥺💖",
    "Saking kangennya, dia buat game multi-level di bawah khusus buat menguji keberanianmu merebut 'Semesta Hatinya'...",
    "Kalahkan rintangan di tiap level sampai Boss Terakhir, dan buktikan kamu pantas mendapatkan hatinya seutuhnya! 👑🚀✨"
  ];

  let typewriterTimeout = null;

  function showDialogue(index) {
    const el = document.getElementById("typewriter-text");
    if (!el) return;
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    const text = dialogues[index % dialogues.length];
    el.textContent = "";

    let charIdx = 0;
    function typeChar() {
      if (charIdx < text.length) {
        el.textContent += text.charAt(charIdx);
        charIdx++;
        typewriterTimeout = setTimeout(typeChar, 25);
      }
    }
    typeChar();
  }

  function initDialogueSystem() {
    showDialogue(0);
    document.getElementById("btn-next-dialogue").addEventListener("click", () => {
      playBlipSound();
      state.currentDialogueIndex++;
      showDialogue(state.currentDialogueIndex);
    });
  }

  /* ==========================================================
     8. FEATURE: 3D RETRO JUKEBOX
     ========================================================== */
  function initJukebox() {
    const songCards = document.querySelectorAll(".song-card-3d");
    const currentSongLabel = document.getElementById("current-song-title");

    songCards.forEach((card) => {
      card.addEventListener("click", () => {
        playBlipSound();
        songCards.forEach((c) => c.classList.remove("active-song"));
        card.classList.add("active-song");

        const songId = parseInt(card.getAttribute("data-song"), 10);
        state.currentSong = songId;
        currentSongLabel.textContent = `${state.songTitles[songId]}`;

        if (!state.audioEnabled) {
          const btnAudio = document.getElementById("btn-audio");
          const labelAudio = document.getElementById("audio-label");
          initAudioContext();
          state.audioEnabled = true;
          labelAudio.textContent = "MUSIK IMUT: ON 💖";
          btnAudio.classList.remove("btn-yellow-3d");
          btnAudio.classList.add("btn-magenta-3d");
        }
        startBgmLoop();
        updateWhatsAppLink();
      });
    });
  }

  /* ==========================================================
     9. FEATURE: ROMANTIC QUIZ
     ========================================================== */
  const quizQuestions = [
    {
      q: "Berapa kali kamu kepikiran si pembuat web ini dalam sehari? 🤔",
      options: [
        { text: "A. Cuma 100x doang kok! 🤭", points: 25 },
        { text: "B. Tiap menit dan tiap detik! ⏰💖", points: 35 },
        { text: "C. Sampai lupa makan & kebawa mimpi! 🥺", points: 35 },
        { text: "D. Gak kehitung, kangen banget tauuu! ✈️", points: 30 }
      ]
    },
    {
      q: "Kalau tiba-tiba dia muncul di depan rumahmu sekarang, kamu mau apa? 🥰",
      options: [
        { text: "A. Langsung peluk erat 10 detik! 🤗", points: 35 },
        { text: "B. Cubit pipinya gemas terus ajak jalan! 🧋", points: 30 },
        { text: "C. Tarik tangannya buat makan bareng! 🍜", points: 25 },
        { text: "D. Semua jawaban di atas sekaligus! ✨", points: 35 }
      ]
    },
    {
      q: "Seberapa butuh kamu ketemu sama dia minggu ini? 💌",
      options: [
        { text: "A. Level Darurat: Harus ketemu secepatnya! 🚨", points: 35 },
        { text: "B. Butuh banget buat obatin rasa rindu! 💕", points: 30 },
        { text: "C. Pokoknya gak mau tahu, harus luangin waktu! 😤", points: 30 },
        { text: "D. 1000% siap meluncur ke lokasi! 🚀", points: 35 }
      ]
    }
  ];

  let currentQuestionIdx = 0;

  function renderQuizQuestion() {
    const q = quizQuestions[currentQuestionIdx];
    document.getElementById("quiz-progress-text").textContent = `PERTANYAAN ${currentQuestionIdx + 1} DARI ${quizQuestions.length}:`;
    document.getElementById("quiz-question-title").textContent = `"${q.q}"`;

    const container = document.getElementById("quiz-options-container");
    container.innerHTML = "";

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn-3d";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => {
        playCoinSound();
        state.quizScore += opt.points;
        currentQuestionIdx++;

        if (currentQuestionIdx < quizQuestions.length) {
          renderQuizQuestion();
        } else {
          finishQuiz();
        }
      });
      container.appendChild(btn);
    });
  }

  function finishQuiz() {
    state.quizFinished = true;
    playVictorySound();
    spawnHeartsConfetti();

    document.getElementById("quiz-container").style.display = "none";
    const resultBox = document.getElementById("quiz-result-box");
    resultBox.style.display = "block";

    let badgeText = "🏆 HASIL: KANGEN TINGKAT DEWA (1000%)!";
    let descText = `"Diagnosis Pilot Meow: Hati kamu udah sah kangen berat! Gak bisa ditunda lagi, kamu wajib ketemu sama si pembikin web ini secepatnya!"`;

    if (state.quizScore >= 95) {
      badgeText = "🏆 HASIL: KANGEN MAKSIMAL OVERDOSE (999999%)! 💖";
      descText = `"Diagnosis: Tingkat kangenmu udah melampaui batas wajar! Segera hubungi nomor WhatsApp di bawah buat penanganan darurat!"`;
    }

    state.quizResultTitle = badgeText;
    document.getElementById("quiz-result-badge").textContent = badgeText;
    document.getElementById("quiz-result-desc").textContent = descText;
    updateWhatsAppLink();
  }

  function initQuiz() {
    renderQuizQuestion();
    document.getElementById("btn-retake-quiz").addEventListener("click", () => {
      playBlipSound();
      currentQuestionIdx = 0;
      state.quizScore = 0;
      state.quizFinished = false;
      document.getElementById("quiz-result-box").style.display = "none";
      document.getElementById("quiz-container").style.display = "block";
      renderQuizQuestion();
      updateWhatsAppLink();
    });
  }

  /* ==========================================================
     10. FEATURE: 3D SECRET LOVE LETTER
     ========================================================== */
  function initLoveLetter() {
    const envelope = document.getElementById("love-envelope");
    const content = document.getElementById("letter-content");
    const label = document.getElementById("envelope-label");

    envelope.addEventListener("click", () => {
      playCoinSound();
      state.envelopeOpened = !state.envelopeOpened;
      if (state.envelopeOpened) {
        content.style.display = "block";
        label.textContent = "[ SURAT RAHASIA TERBUKA 💖 ]";
        spawnHeartsConfetti();
      } else {
        content.style.display = "none";
        label.textContent = "[ KLIK DI SINI UNTUK BUKA SURAT RAHASIA ]";
      }
    });
  }

  /* ==========================================================
     11. FEATURE: MULTI-LEVEL ARCADE SHOOTER WITH FINAL BOSS
     - Level 1: Langit Awan Ragu ☁️ (5 musuh)
     - Level 2: Orbit Overthinking 👾 (6 musuh)
     - Level 3: BOSS BATTLE: Raksasa Rindu & Gengsi 👑💔 (Boss HP: 20)
     - Player Nabrak Musuh / Peluru = Mati!
     - Kalahkan Boss = Dapatkan "SEMESTA HATI AKU" 🌌💖
     ========================================================== */
  let shooterCanvas, shooterCtx;
  let shooterPlayer = { x: 300, y: 320, width: 36, height: 30, invulnerable: 0 };
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let shooterAnimId = null;
  let lastShootTime = 0;
  let lastEnemySpawnTime = 0;

  // Boss Object
  let boss = {
    active: false,
    x: 300,
    y: 80,
    width: 90,
    height: 70,
    vx: 2.2,
    hp: 20,
    maxHp: 20,
    lastShoot: 0
  };

  function updateShooterHUD() {
    const levelDisplay = document.getElementById("shooter-level-display");
    const livesDisplay = document.getElementById("shooter-lives-display");
    const progressDisplay = document.getElementById("shooter-progress-display");
    const bossHud = document.getElementById("boss-hud-container");
    const bossHpBar = document.getElementById("boss-hp-bar");

    // Lives Display
    let livesStr = "";
    for (let l = 0; l < state.shooterLives; l++) livesStr += "❤️";
    if (livesDisplay) livesDisplay.textContent = livesStr || "💀 CRASH!";

    // Level Header & Progress
    if (state.shooterLevel === 1) {
      if (levelDisplay) levelDisplay.textContent = "LEVEL 1: LANGIT AWAN RAGU ☁️";
      if (progressDisplay) progressDisplay.textContent = `${state.levelKills}/5 Musuh`;
      if (bossHud) bossHud.style.display = "none";
    } else if (state.shooterLevel === 2) {
      if (levelDisplay) levelDisplay.textContent = "LEVEL 2: ORBIT OVERTHINKING 👾";
      if (progressDisplay) progressDisplay.textContent = `${state.levelKills}/6 Musuh`;
      if (bossHud) bossHud.style.display = "none";
    } else if (state.shooterLevel === 3) {
      if (levelDisplay) levelDisplay.textContent = "⚠️ BOSS BATTLE: GERBANG SEMESTA HATI! ⚠️";
      if (progressDisplay) progressDisplay.textContent = `BOSS HP: ${state.bossHp}/${state.bossMaxHp}`;
      if (bossHud) {
        bossHud.style.display = "flex";
        const pct = Math.max(0, (state.bossHp / state.bossMaxHp) * 100);
        bossHpBar.style.width = `${pct}%`;
      }
    }
  }

  function resetShooterGame(fullReset = true) {
    if (fullReset) {
      state.shooterLevel = 1;
      state.shooterLives = 3;
      state.levelKills = 0;
      state.levelTargetKills = 5;
      state.bossHp = state.bossMaxHp;
      state.bossDefeated = false;
      state.shooterGameOver = false;
      boss.active = false;
    }
    bullets = [];
    enemyBullets = [];
    enemies = [];
    shooterPlayer.x = shooterCanvas.width / 2;
    shooterPlayer.y = shooterCanvas.height - 50;
    shooterPlayer.invulnerable = Date.now() + 1500; // 1.5s invulnerable on spawn
    updateShooterHUD();
  }

  function initShooterModal() {
    const modal = document.getElementById("shooter-modal");
    const btnOpen = document.getElementById("btn-open-shooter");
    const btnClose = document.getElementById("btn-close-shooter");
    shooterCanvas = document.getElementById("shooter-canvas");
    shooterCtx = shooterCanvas.getContext("2d");

    btnOpen.addEventListener("click", () => {
      playVictorySound();
      modal.style.display = "flex";
      state.shooterGameActive = true;
      resetShooterGame(true);
      startShooterLoop();
    });

    btnClose.addEventListener("click", () => {
      playBlipSound();
      modal.style.display = "none";
      state.shooterGameActive = false;
      if (shooterAnimId) cancelAnimationFrame(shooterAnimId);
      updateWhatsAppLink();
    });

    function updatePlayerPos(clientX, clientY) {
      if (state.shooterGameOver || state.bossDefeated) return;
      const rect = shooterCanvas.getBoundingClientRect();
      const scaleX = shooterCanvas.width / rect.width;
      const scaleY = shooterCanvas.height / rect.height;
      const mx = (clientX - rect.left) * scaleX;
      const my = (clientY - rect.top) * scaleY;
      shooterPlayer.x = Math.max(25, Math.min(shooterCanvas.width - 25, mx));
      shooterPlayer.y = Math.max(140, Math.min(shooterCanvas.height - 30, my));
    }

    shooterCanvas.addEventListener("mousemove", (e) => {
      if (state.shooterGameActive) updatePlayerPos(e.clientX, e.clientY);
    });

    shooterCanvas.addEventListener("touchmove", (e) => {
      if (state.shooterGameActive && e.touches[0]) {
        updatePlayerPos(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    // Click canvas to retry if GameOver or claim victory
    shooterCanvas.addEventListener("click", (e) => {
      if (state.shooterGameOver) {
        playBlipSound();
        resetShooterGame(true);
      } else if (state.bossDefeated) {
        // Send to WhatsApp directly
        const btnWA = document.getElementById("btn-whatsapp");
        if (btnWA) btnWA.click();
      }
    });
  }

  function spawnModerateEnemy() {
    if (state.shooterLevel === 3) return; // Boss battle, no regular enemies
    const now = Date.now();
    // Enemies spawn one by one in moderate pace (every 1.6 - 2.2 seconds)
    if (now - lastEnemySpawnTime < 1800) return;
    if (enemies.length >= 2) return; // Maximum 2 enemies on screen at once! ("musuh nya ga sebanyak itu")

    lastEnemySpawnTime = now;

    if (state.shooterLevel === 1) {
      // Level 1: Awan Ragu ☁️ (Slow and peaceful)
      enemies.push({
        x: 40 + Math.random() * (shooterCanvas.width - 80),
        y: -30,
        width: 38,
        height: 30,
        hp: 2,
        maxHp: 2,
        speed: 1.2,
        emoji: "☁️",
        name: "Awan Ragu",
        sine: false
      });
    } else if (state.shooterLevel === 2) {
      // Level 2: Monster Overthinking 👾 (Slight sine curve)
      enemies.push({
        x: 50 + Math.random() * (shooterCanvas.width - 100),
        y: -30,
        width: 36,
        height: 32,
        hp: 3,
        maxHp: 3,
        speed: 1.5,
        emoji: "👾",
        name: "Monster Overthinking",
        sine: true,
        sineOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function triggerPlayerDeath() {
    if (Date.now() < shooterPlayer.invulnerable) return; // Protected
    state.shooterLives--;
    playHitHurtSound();
    updateShooterHUD();

    if (state.shooterLives <= 0) {
      state.shooterGameOver = true;
      playPopExplosionSound();
    } else {
      // Temporary invulnerability
      shooterPlayer.invulnerable = Date.now() + 1800;
    }
  }

  function advanceShooterLevel() {
    playVictorySound();
    spawnHeartsConfetti();

    if (state.shooterLevel === 1) {
      state.shooterLevel = 2;
      state.levelKills = 0;
      state.levelTargetKills = 6;
      enemies = [];
      bullets = [];
      enemyBullets = [];
      shooterPlayer.invulnerable = Date.now() + 1500;
      updateShooterHUD();
    } else if (state.shooterLevel === 2) {
      // Advance to BOSS BATTLE!
      state.shooterLevel = 3;
      state.bossHp = state.bossMaxHp;
      boss.active = true;
      boss.x = shooterCanvas.width / 2;
      boss.y = 80;
      boss.vx = 2.0;
      enemies = [];
      bullets = [];
      enemyBullets = [];
      shooterPlayer.invulnerable = Date.now() + 2000;
      updateShooterHUD();
    }
  }

  function startShooterLoop() {
    function loop() {
      if (!state.shooterGameActive) return;
      shooterAnimId = requestAnimationFrame(loop);

      const w = shooterCanvas.width;
      const h = shooterCanvas.height;

      // 1. Draw Space Background with Stars
      shooterCtx.fillStyle = "#0c061a";
      shooterCtx.fillRect(0, 0, w, h);

      shooterCtx.fillStyle = "#ffffff";
      for (let s = 0; s < 30; s++) {
        const sx = (s * 41 + Date.now() * 0.04) % w;
        const sy = (s * 53 + Date.now() * (state.shooterLevel === 3 ? 0.25 : 0.12)) % h;
        shooterCtx.fillRect(sx, sy, s % 3 === 0 ? 3 : 2, s % 3 === 0 ? 3 : 2);
      }

      // If GameOver or BossDefeated, render overlay and pause action
      if (state.shooterGameOver) {
        shooterCtx.fillStyle = "rgba(15, 23, 42, 0.85)";
        shooterCtx.fillRect(0, 0, w, h);

        shooterCtx.font = "20px 'Press Start 2P', monospace";
        shooterCtx.fillStyle = "#ef4444";
        shooterCtx.textAlign = "center";
        shooterCtx.fillText("💥 PESAWAT TERTABRAK! 😿", w / 2, h / 2 - 30);

        shooterCtx.font = "22px 'VT323', monospace";
        shooterCtx.fillStyle = "#ffffff";
        shooterCtx.fillText('"Jangan nyerah! Semesta hatiku masih setia nungguin kamu..."', w / 2, h / 2 + 10);

        shooterCtx.font = "14px 'Press Start 2P', monospace";
        shooterCtx.fillStyle = "#facc15";
        shooterCtx.fillText("👉 [ KLIK DI SINI UNTUK COBA LAGI ] 👈", w / 2, h / 2 + 50);
        return;
      }

      if (state.bossDefeated) {
        shooterCtx.fillStyle = "rgba(15, 23, 42, 0.9)";
        shooterCtx.fillRect(0, 0, w, h);

        shooterCtx.font = "28px sans-serif";
        shooterCtx.textAlign = "center";
        shooterCtx.fillText("🌌💖👑🐱✈️", w / 2, h / 2 - 60);

        shooterCtx.font = "16px 'Press Start 2P', monospace";
        shooterCtx.fillStyle = "#facc15";
        shooterCtx.fillText("🏆 BOSS TERAKHIR DIKALAHKAN! 🏆", w / 2, h / 2 - 20);

        shooterCtx.font = "24px 'VT323', monospace";
        shooterCtx.fillStyle = "#fbcfe8";
        shooterCtx.fillText('"SEMESTA HATI AKU RESMI JADI MILIK KAMU SEUTUHNYA!"', w / 2, h / 2 + 15);
        shooterCtx.fillText("Gak ada lagi rasa ragu atau gengsi. Seluruh cinta ini cuma buat kamu. 🥰", w / 2, h / 2 + 45);

        shooterCtx.font = "13px 'Press Start 2P', monospace";
        shooterCtx.fillStyle = "#22c55e";
        shooterCtx.fillText("💌 [ KLIK DI SINI UNTUK KLAIM DI WHATSAPP ] 💌", w / 2, h / 2 + 90);
        return;
      }

      // 2. Player Laser Firing
      if (Date.now() - lastShootTime > 190) {
        lastShootTime = Date.now();
        playLaserSound();
        bullets.push({ x: shooterPlayer.x - 12, y: shooterPlayer.y - 12, vy: -7 });
        bullets.push({ x: shooterPlayer.x + 12, y: shooterPlayer.y - 12, vy: -7 });
      }

      // 3. Update & Draw Player Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y += b.vy;
        if (b.y < -20) {
          bullets.splice(i, 1);
          continue;
        }
        shooterCtx.font = "14px sans-serif";
        shooterCtx.textAlign = "center";
        shooterCtx.fillText("💖", b.x, b.y);
      }

      // 4. Update Regular Enemies (Level 1 & 2)
      spawnModerateEnemy();

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.speed;
        if (e.sine) {
          e.x += Math.sin(Date.now() * 0.003 + e.sineOffset) * 1.5;
        }

        // Draw Enemy
        shooterCtx.font = "26px sans-serif";
        shooterCtx.textAlign = "center";
        shooterCtx.fillText(e.emoji, e.x, e.y);

        // Check Collision with Player Bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.abs(b.x - e.x) < 22 && Math.abs(b.y - e.y) < 20) {
            bullets.splice(j, 1);
            e.hp--;
            playPopExplosionSound();

            if (e.hp <= 0) {
              enemies.splice(i, 1);
              state.levelKills++;
              updateShooterHUD();

              if (state.levelKills >= state.levelTargetKills) {
                advanceShooterLevel();
              }
              break;
            }
          }
        }

        // Check Collision with Player Plane: NABRAK MUSUH = MATI/HURT!
        if (Math.abs(e.x - shooterPlayer.x) < 26 && Math.abs(e.y - shooterPlayer.y) < 24) {
          enemies.splice(i, 1);
          triggerPlayerDeath();
          break;
        }

        if (e.y > h + 30) {
          enemies.splice(i, 1);
        }
      }

      // 5. Update & Draw FINAL BOSS (Level 3)
      if (state.shooterLevel === 3 && boss.active) {
        boss.x += boss.vx;
        if (boss.x > w - 60 || boss.x < 60) boss.vx *= -1;

        // Boss Shoots Slow Energy Ring
        if (Date.now() - boss.lastShoot > 1400) {
          boss.lastShoot = Date.now();
          playWhooshSound();
          enemyBullets.push({ x: boss.x - 20, y: boss.y + 20, vx: -1.0, vy: 2.2 });
          enemyBullets.push({ x: boss.x, y: boss.y + 25, vx: 0, vy: 2.5 });
          enemyBullets.push({ x: boss.x + 20, y: boss.y + 20, vx: 1.0, vy: 2.2 });
        }

        // Draw Giant Boss: "Raksasa Rindu & Gengsi"
        shooterCtx.save();
        shooterCtx.translate(boss.x, boss.y);
        const bPulse = 1 + Math.sin(Date.now() * 0.006) * 0.08;
        shooterCtx.scale(bPulse, bPulse);

        // Boss Aura
        const bglow = shooterCtx.createRadialGradient(0, 0, 10, 0, 0, 50);
        bglow.addColorStop(0, "rgba(244, 63, 94, 0.7)");
        bglow.addColorStop(1, "rgba(244, 63, 94, 0)");
        shooterCtx.fillStyle = bglow;
        shooterCtx.beginPath();
        shooterCtx.arc(0, 0, 50, 0, Math.PI * 2);
        shooterCtx.fill();

        shooterCtx.font = "48px sans-serif";
        shooterCtx.textAlign = "center";
        shooterCtx.textBaseline = "middle";
        shooterCtx.fillText("👾👑", 0, 0);

        shooterCtx.restore();

        // Check Boss Hit by Player Bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.abs(b.x - boss.x) < 40 && Math.abs(b.y - boss.y) < 35) {
            bullets.splice(j, 1);
            state.bossHp--;
            boss.hp = state.bossHp;
            playPopExplosionSound();
            updateShooterHUD();

            if (state.bossHp <= 0) {
              state.bossDefeated = true;
              boss.active = false;
              playVictorySound();
              spawnHeartsConfetti();
              updateWhatsAppLink();
              break;
            }
          }
        }

        // Check Boss Collision with Player Plane
        if (Math.abs(boss.x - shooterPlayer.x) < 45 && Math.abs(boss.y - shooterPlayer.y) < 40) {
          triggerPlayerDeath();
        }
      }

      // 6. Update & Draw Boss Enemy Projectiles
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        eb.x += eb.vx;
        eb.y += eb.vy;

        shooterCtx.font = "14px sans-serif";
        shooterCtx.fillText("⭐", eb.x, eb.y);

        // Check Player Hit by Boss Bullet
        if (Math.abs(eb.x - shooterPlayer.x) < 20 && Math.abs(eb.y - shooterPlayer.y) < 20) {
          enemyBullets.splice(i, 1);
          triggerPlayerDeath();
          continue;
        }

        if (eb.y > h + 20 || eb.x < -20 || eb.x > w + 20) {
          enemyBullets.splice(i, 1);
        }
      }

      // 7. Draw Player: THE CHIBI CAT AIRPLANE! 🐱✈️
      // Blink if invulnerable
      const isBlinking = Date.now() < shooterPlayer.invulnerable && Math.floor(Date.now() / 100) % 2 === 0;
      if (!isBlinking) {
        shooterCtx.save();
        shooterCtx.translate(shooterPlayer.x, shooterPlayer.y);

        // Fuselage
        shooterCtx.fillStyle = "#db2777";
        shooterCtx.fillRect(-12, -7, 24, 14);

        // Wings
        shooterCtx.fillStyle = "#0284c7";
        shooterCtx.fillRect(-22, -2, 44, 7);
        shooterCtx.fillStyle = "#f43f5e";
        shooterCtx.fillRect(-22, -2, 6, 7);
        shooterCtx.fillRect(16, -2, 6, 7);

        // Cockpit & Chibi Cat Head
        shooterCtx.fillStyle = "#67e8f9";
        shooterCtx.fillRect(-6, -10, 12, 10);
        shooterCtx.fillStyle = "#ffffff";
        shooterCtx.fillRect(-5, -9, 10, 8);
        shooterCtx.fillStyle = "#f43f5e";
        shooterCtx.fillRect(-5, -12, 3, 3);
        shooterCtx.fillRect(2, -12, 3, 3);
        shooterCtx.fillStyle = "#1e1b4b";
        shooterCtx.fillRect(-3, -6, 2, 2);
        shooterCtx.fillRect(1, -6, 2, 2);

        // Propeller
        const propAngle = Date.now() * 0.06;
        shooterCtx.save();
        shooterCtx.translate(0, -13);
        shooterCtx.rotate(propAngle);
        shooterCtx.fillStyle = "#ffffff";
        shooterCtx.fillRect(-2, -9, 4, 18);
        shooterCtx.restore();

        shooterCtx.restore();
      }
    }

    loop();
  }

  /* ==========================================================
     12. QUEST & CHALLENGES
     ========================================================== */
  function spawnHeartsConfetti() {
    try {
      if (window.confetti) {
        window.confetti({
          particleCount: 60,
          spread: 85,
          origin: { y: 0.6 },
          colors: ["#db2777", "#f43f5e", "#f472b6", "#38bdf8", "#facc15"]
        });
      }
    } catch (e) {}
  }

  function createFloatingHeart(x, y) {
    const heart = document.createElement("div");
    heart.className = "floating-pixel-heart";
    heart.textContent = Math.random() > 0.3 ? "💖" : "🐱";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  function collectHeart(x, y) {
    createFloatingHeart(x, y);
    if (state.heartsCollected < state.targetHearts) {
      state.heartsCollected++;
      playCoinSound();

      const slot = document.querySelector(`.slot-heart[data-idx="${state.heartsCollected}"]`);
      if (slot) {
        slot.textContent = "💖";
        slot.classList.add("collected");
      }

      const label = document.getElementById("hearts-collected-label");
      if (label) {
        label.textContent = `${state.heartsCollected} / ${state.targetHearts} Tertangkap!`;
      }

      if (state.heartsCollected === state.targetHearts) {
        playVictorySound();
        spawnHeartsConfetti();
        if (label) {
          label.textContent = "🎉 MISI 1 TUNTAS! SEMPURNA! 🎉";
          label.style.color = "#16a34a";
        }
      }
    }
  }

  function initQuestSystem() {
    window.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, a, input, label, .song-card-3d, .envelope-wrapper-3d, #shooter-modal")) return;
      collectHeart(e.clientX, e.clientY);
    });

    const radioInputs = document.querySelectorAll('input[name="tebusan"]');
    radioInputs.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        playBlipSound();
        state.selectedTebusan = e.target.value;
        updateWhatsAppLink();
      });
    });

    updateWhatsAppLink();
  }

  /* ==========================================================
     13. WHATSAPP LINK & MESSAGE GENERATOR
     ========================================================== */
  function updateWhatsAppLink() {
    const previewEl = document.getElementById("wa-text-preview");
    const btnWA = document.getElementById("btn-whatsapp");
    if (!previewEl || !btnWA) return;

    const currentSongName = state.songTitles[state.currentSong] || "Bouncing Kitty Love 🐾";
    const quizResultText = state.quizFinished ? state.quizResultTitle : "Kangen Tingkat Tinggi (1000%)!";
    
    let shooterStatusText = "🎮 Main Game Ruang Hati: Masih dalam proses penaklukan!";
    if (state.bossDefeated) {
      shooterStatusText = "🏆 NGALAHIN BOSS TERAKHIR! 'Semesta Hati Kamu' resmi jadi milikku seutuhnya! 🌌💖";
    }

    const message = 
`Hai kamu! 🐱✈️ Aku barusan selesai buka web pesawat cinta kamu versi cerah ini!
Ternyata kamu beneran KANGEN BANGET TAUUU sama kamu! 🥺💖

Berikut laporan hasil penjelajahanku di web kamu:
🎯 Hasil Kuis Kangen: ${quizResultText}
🚀 Status Ruang Hati: ${shooterStatusText}
🎵 Lagu Imut Favorit: ${currentSongName}
💌 Surat Rahasia: Udah kubaca sampai selesai! 🥰
🎁 Tebusan Kangen yang Aku Pilih:
👉 "${state.selectedTebusan}" 👈

Yuk ketemu sekarang buat ngerayain kemenanganku! Kabarin aku sekarang yaa! 💕`;

    previewEl.textContent = `"${message}"`;

    const encoded = encodeURIComponent(message);
    btnWA.href = `https://wa.me/${TARGET_PHONE}?text=${encoded}`;
  }

  /* ==========================================================
     14. AUDIO TOGGLE BUTTON
     ========================================================== */
  function initAudioControls() {
    const btnAudio = document.getElementById("btn-audio");
    const labelAudio = document.getElementById("audio-label");

    btnAudio.addEventListener("click", () => {
      initAudioContext();
      state.audioEnabled = !state.audioEnabled;

      if (state.audioEnabled) {
        labelAudio.textContent = "MUSIK IMUT: ON 💖";
        btnAudio.classList.remove("btn-yellow-3d");
        btnAudio.classList.add("btn-magenta-3d");
        playBlipSound();
        startBgmLoop();
      } else {
        labelAudio.textContent = "MUSIK IMUT: OFF";
        btnAudio.classList.remove("btn-magenta-3d");
        btnAudio.classList.add("btn-yellow-3d");
        stopBgmLoop();
      }
    });

    window.addEventListener("pointerdown", () => {
      initAudioContext();
    }, { once: true });
  }

  /* ==========================================================
     INITIALIZATION ON DOM CONTENT LOADED
     ========================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initAmbientCanvas();
    initButtonParticles();
    initThreeVoxelPlane();
    init2DOrbitCanvas();
    initModeSwitcher();
    initDialogueSystem();
    initJukebox();
    initQuiz();
    initLoveLetter();
    initShooterModal();
    initQuestSystem();
    initAudioControls();
  });
})();
