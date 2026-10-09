/**
 * Omnintell Technologies & Omnintell Labs — Interactive Engine
 * Founder & CEO: Omkareshwar Sinha (Jack)
 * 
 * Features:
 * - 3D Mathematical Earth Globe with continuous rotation & interactive drag
 * - Ambient Cyber Particle Constellation
 * - 3D Physics Tilt with dynamic glare reflection
 * - Animated Skill Progress Bars on scroll
 * - Project Filter System & Project Detail Modal
 * - Web Audio API Synthesized Audio Feedback
 * - Async Consultation Form & Master Admin Authentication
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. SUBTLE SYNTHESIZED WEB AUDIO FEEDBACK (Zero external audio files needed)
  // ---------------------------------------------------------------------------
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playUiTone(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(880, now + 0.16);    // A5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {}
  }

  // ---------------------------------------------------------------------------
  // 2. CONTINUOUS & INTERACTIVE 3D EARTH GLOBE
  // ---------------------------------------------------------------------------
  function init3DGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, cx, cy, radius;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || (window.innerHeight * 0.85);
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      cx = width / 2;
      cy = height / 2;
      radius = Math.min(width, height) * 0.44;
    }
    resize();
    window.addEventListener('resize', resize);

    // 1,700 Fibonacci points on sphere surface
    const points = [];
    const numPoints = 1700;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numPoints; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      
      // Continental noise mapping simulation
      const noise = Math.sin(theta * 3.8) * Math.cos(phi * 2.8) + Math.cos(theta * 2.2 + phi * 1.5);
      const isLand = noise > -0.22;
      
      points.push({ x, y, z, isLand });
    }

    // Special India coordinate marker (approx 21.2° N, 81.6° E for Chhattisgarh)
    const lat = 21.2 * (Math.PI / 180);
    const lon = 81.6 * (Math.PI / 180);
    const indiaMarker = {
      x: Math.cos(lat) * Math.sin(lon),
      y: -Math.sin(lat),
      z: Math.cos(lat) * Math.cos(lon)
    };

    let angle = 0;
    let dragVelocity = 0.0035;
    let isDragging = false;
    let lastMouseX = 0;
    const tilt = 0.26; // Earth axial tilt

    // Mouse / Touch Interaction
    window.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      angle += deltaX * 0.005;
      dragVelocity = deltaX * 0.002;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
      }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - lastMouseX;
      lastMouseX = e.touches[0].clientX;
      angle += deltaX * 0.005;
      dragVelocity = deltaX * 0.002;
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    let pulseTime = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);
      pulseTime += 0.04;

      if (!isDragging) {
        // Natural continuous spinning + inertia recovery
        dragVelocity += (0.0032 - dragVelocity) * 0.03;
        angle += dragVelocity;
      }

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      // Ambient Glowing Core
      const radialGlow = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.35);
      radialGlow.addColorStop(0, 'rgba(182, 0, 168, 0.16)');
      radialGlow.addColorStop(0.5, 'rgba(118, 33, 176, 0.09)');
      radialGlow.addColorStop(1, 'rgba(8, 11, 17, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
      ctx.stroke();

      // Render 3D Surface Points
      for (let i = 0; i < numPoints; i++) {
        const p = points[i];
        // Rotation around Y
        const rx = p.x * cosA - p.z * sinA;
        const ry = p.y;
        const rz = p.x * sinA + p.z * cosA;
        // Tilt around X
        const ty = ry * cosT - rz * sinT;
        const tz = ry * sinT + rz * cosT;

        if (tz > -0.25) {
          const depth = (tz + 1) / 2; // 0..1
          const scale = radius * 0.98;
          const sx = cx + rx * scale;
          const sy = cy + ty * scale;

          if (p.isLand) {
            ctx.fillStyle = `rgba(182, 0, 168, ${Math.min(1, depth * 0.95 + 0.15)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, depth * 1.8 + 0.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(0, 240, 255, ${Math.min(1, depth * 0.5 + 0.05)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, depth * 0.9 + 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Render Special Pulsing Beacon for India
      const mx = indiaMarker.x * cosA - indiaMarker.z * sinA;
      const my = indiaMarker.y;
      const mz = indiaMarker.x * sinA + indiaMarker.z * cosA;
      const mty = my * cosT - mz * sinT;
      const mtz = my * sinT + mz * cosT;

      if (mtz > 0.05) {
        const scale = radius * 0.98;
        const sx = cx + mx * scale;
        const sy = cy + mty * scale;
        const pulse = (Math.sin(pulseTime) + 1) / 2; // 0..1

        // Outer beacon wave
        ctx.strokeStyle = `rgba(0, 240, 255, ${1 - pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();

        // Inner beacon dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label tooltip
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('OMNINTELL HQ', sx + 10, sy - 5);
      }

      // Fluid Google Flow Chromatic Currents (Orbit lines removed)
      const flowParticleCount = 28;
      for (let f = 0; f < flowParticleCount; f++) {
        const pAngle = angle * 1.8 + (f * Math.PI * 2 / flowParticleCount);
        const pR = radius * (1.18 + Math.sin(pulseTime * 2 + f) * 0.12);
        const px = cx + Math.cos(pAngle) * pR;
        const py = cy + Math.sin(pAngle) * pR * 0.38 + Math.cos(pAngle * 2 + pulseTime) * 12;
        const pAlpha = 0.2 + (Math.sin(pulseTime * 3 + f) + 1) * 0.3;
        ctx.fillStyle = f % 2 === 0 ? `rgba(0, 240, 255, ${pAlpha})` : `rgba(168, 85, 247, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render 5 3D Spatial Orbiting Labels
      const spatialLabels = [
        { text: 'AI SYSTEMS', tag: 'NEURAL CORE', angle: angle * 0.9 + 0.5, dist: radius * 1.34, pitch: 0.3 },
        { text: 'CYBERSECURITY', tag: 'ZERO-TRUST', angle: -angle * 0.8 + 2.0, dist: radius * 1.45, pitch: -0.4 },
        { text: 'AUTOMATION', tag: 'AUTONOMOUS', angle: angle * 1.1 + 3.4, dist: radius * 1.3, pitch: 0.6 },
        { text: 'SOFTWARE', tag: 'HIGH-SCALE', angle: -angle * 0.95 + 4.8, dist: radius * 1.42, pitch: -0.25 },
        { text: 'R&D', tag: 'OMNINTELL', angle: angle * 0.85 + 5.8, dist: radius * 1.38, pitch: 0.45 }
      ];

      spatialLabels.forEach((lbl) => {
        const lx = Math.cos(lbl.angle) * lbl.dist;
        const lz = Math.sin(lbl.angle) * lbl.dist;
        const ly = Math.sin(lbl.pitch) * (lbl.dist * 0.4) + Math.cos(lbl.angle) * 15;
        const sx = cx + lx;
        const sy = cy + ly;
        const isFront = lz > -radius * 0.15;
        const depthAlpha = isFront ? 1.0 : 0.22;

        // Glowing anchor pin
        ctx.fillStyle = isFront ? '#00f0ff' : 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Spatial label card
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(0, 240, 255, ${depthAlpha})`;
        ctx.fillText(lbl.text, sx + 8, sy - 2);
        ctx.font = '7px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(182, 196, 210, ${depthAlpha * 0.75})`;
        ctx.fillText(lbl.tag, sx + 8, sy + 7);
      });

      requestAnimationFrame(render);
    }
    render();
  }

  // ---------------------------------------------------------------------------
  // 3. 3D CARD TILT ON MOUSE MOVE
  // ---------------------------------------------------------------------------
  function initCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 4. ANIMATED SKILLS PROGRESS ON SCROLL
  // ---------------------------------------------------------------------------
  function initSkillAnimations() {
    const bars = document.querySelectorAll('.progress-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-level') || '90';
            bar.style.width = targetWidth + '%';
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.15 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  // ---------------------------------------------------------------------------
  // 5. PROJECT CATEGORY FILTERING & MODAL PREVIEW
  // ---------------------------------------------------------------------------
  window.filterProjects = function (category, btn) {
    playUiTone('click');
    document.querySelectorAll('.filter-pill').forEach((p) => {
      p.classList.remove('bg-[#7621B0]', 'text-white');
      p.classList.add('bg-white/5', 'text-white/70');
    });
    if (btn) {
      btn.classList.add('bg-[#7621B0]', 'text-white');
      btn.classList.remove('bg-white/5', 'text-white/70');
    }

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const c = card.getAttribute('data-category') || '';
      if (category === 'all' || c.toLowerCase().includes(category.toLowerCase())) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        setTimeout(() => { card.style.opacity = '1'; }, 20);
      } else {
        card.style.display = 'none';
      }
    });
  };

  window.openProjectModal = function (title, desc, category, tags, url, img) {
    playUiTone('click');
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;

    document.getElementById('modalProjTitle').innerText = title || 'Project Showcase';
    document.getElementById('modalProjDesc').innerText = desc || '';
    document.getElementById('modalProjCategory').innerText = category || 'Showcase';
    document.getElementById('modalProjImg').src = img || '';

    const linkBtn = document.getElementById('modalProjLink');
    if (url && url !== '#') {
      linkBtn.href = url;
      linkBtn.classList.remove('hidden');
    } else {
      linkBtn.classList.add('hidden');
    }

    const tagsContainer = document.getElementById('modalProjTags');
    tagsContainer.innerHTML = '';
    const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',') : []);
    tagList.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'text-[0.7rem] font-mono px-2.5 py-1 rounded-md bg-white/10 text-cyan-300 border border-white/10';
      span.innerText = t.trim();
      tagsContainer.appendChild(span);
    });

    modal.classList.remove('hidden');
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById('projectDetailModal');
    if (modal) modal.classList.add('hidden');
  };

  // ---------------------------------------------------------------------------
  // 6. ASYNC CONTACT TRANSMISSION WITH REAL-TIME FEEDBACK
  // ---------------------------------------------------------------------------
  window.submitConsultationForm = function (e) {
    e.preventDefault();
    playUiTone('click');
    const form = e.target;
    const btn = document.getElementById('submitInquiryBtn');
    const feedback = document.getElementById('contactFeedbackText');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Transmitting Telemetry...';
    }

    const fd = new FormData(form);
    fd.append('action', 'submit_contact');

    fetch('index.php', { method: 'POST', body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'Transmit Inquiry';
        }
        if (feedback) {
          feedback.classList.remove('hidden');
          if (res.success) {
            playUiTone('success');
            feedback.className = 'text-center text-xs font-mono mt-3 text-emerald-400 font-semibold';
            feedback.innerText = '✓ Inquiry transmitted directly to Omkareshwar Sinha (Jack).';
            form.reset();
          } else {
            feedback.className = 'text-center text-xs font-mono mt-3 text-rose-400 font-semibold';
            feedback.innerText = 'Error: ' + (res.error || 'Transmission failed.');
          }
        }
      })
      .catch(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'Transmit Inquiry';
        }
        if (feedback) {
          feedback.classList.remove('hidden');
          feedback.className = 'text-center text-xs font-mono mt-3 text-rose-400 font-semibold';
          feedback.innerText = 'Transmission network error. Please reach out to omkareshwarsinha6@gmail.com directly.';
        }
      });
  };

  // ---------------------------------------------------------------------------
  // 7. MASTER ADMIN AUTHENTICATION
  // ---------------------------------------------------------------------------
  window.submitAdminLogin = function () {
    playUiTone('click');
    const pwdInput = document.getElementById('adminMasterPwd');
    const feedback = document.getElementById('adminAuthFeedback');
    if (!pwdInput) return;
    const pwd = pwdInput.value.trim();
    if (!pwd) return;

    const fd = new FormData();
    fd.append('action', 'login');
    fd.append('password', pwd);

    fetch('index.php', { method: 'POST', body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          playUiTone('success');
          sessionStorage.setItem('admin_token', res.token);
          if (feedback) {
            feedback.className = 'text-xs font-mono text-emerald-400 text-center';
            feedback.innerText = '✓ Master credentials accepted. Entering console...';
          }
          setTimeout(() => { window.location.reload(); }, 600);
        } else {
          if (feedback) {
            feedback.className = 'text-xs font-mono text-rose-400 text-center';
            feedback.innerText = res.error || 'Authentication denied.';
          }
        }
      })
      .catch(() => {
        if (feedback) {
          feedback.className = 'text-xs font-mono text-rose-400 text-center';
          feedback.innerText = 'Authentication server connection error.';
        }
      });
  };

  // ---------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    init3DGlobe();
    initCardTilt();
    initSkillAnimations();
  });

})();
