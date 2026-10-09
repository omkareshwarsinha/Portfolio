import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

interface HeroSpatial3DProps {
  scrollProgress: number;
  mousePos: { x: number; y: number }; // normalized -0.5 to 0.5
  isLight?: boolean;
}

interface FloatingLabel3D {
  name: string;
  tag: string;
  theta: number; // spherical angle
  phi: number;   // polar angle
  radius: number;
  speed: number;
  // Screen projected coordinates
  screenX: number;
  screenY: number;
  scale: number;
  opacity: number;
  isFront: boolean;
}

export const HeroSpatial3D: React.FC<HeroSpatial3DProps> = ({
  scrollProgress,
  mousePos,
  isLight = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { customization } = useTheme();

  const [labels, setLabels] = useState<FloatingLabel3D[]>([
    { name: "AI SYSTEMS", tag: "NEURAL CORE", theta: 0.3, phi: 1.2, radius: 2.5, speed: 0.0028, screenX: 0, screenY: 0, scale: 1, opacity: 1, isFront: true },
    { name: "CYBERSECURITY", tag: "ZERO-TRUST", theta: 1.8, phi: 1.7, radius: 2.6, speed: -0.0022, screenX: 0, screenY: 0, scale: 1, opacity: 1, isFront: true },
    { name: "AUTOMATION", tag: "AUTONOMOUS", theta: 3.1, phi: 0.9, radius: 2.45, speed: 0.003, screenX: 0, screenY: 0, scale: 1, opacity: 1, isFront: true },
    { name: "SOFTWARE", tag: "HIGH-SCALE", theta: 4.4, phi: 1.9, radius: 2.55, speed: -0.0024, screenX: 0, screenY: 0, scale: 1, opacity: 1, isFront: true },
    { name: "R&D LABS", tag: "OMNINTELL", theta: 5.4, phi: 1.4, radius: 2.48, speed: 0.0026, screenX: 0, screenY: 0, scale: 1, opacity: 1, isFront: true },
  ]);

  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = mount.clientWidth || window.innerWidth || 800;
    const height = mount.clientHeight || window.innerHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Group for the floating spatial elements & fluid flow
    const globeSystemGroup = new THREE.Group();
    scene.add(globeSystemGroup);

    // Theme color parsing for Three.js materials
    const primaryHex = parseInt((customization.primaryColor || "#00f0ff").replace("#", ""), 16);
    const secondaryHex = parseInt((customization.secondaryColor || "#8b5cf6").replace("#", ""), 16);

    // 1. BACKGROUND STARS (Subtle cosmic ambient space dust)
    const starCount = 320;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 36;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      starPos[i * 3 + 2] = -5 - Math.random() * 18;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.04,
      color: isLight ? 0x475569 : secondaryHex,
      transparent: true,
      opacity: isLight ? 0.35 : 0.6,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 2. GOOGLE FLOW 3D PARTICLES (Harmonic fluid currents orbiting the spatial core)
    const flowCount = 180;
    const flowGeo = new THREE.BufferGeometry();
    const flowPos = new Float32Array(flowCount * 3);
    const flowData: {
      theta: number;
      speed: number;
      rBase: number;
      phi: number;
      oscFreq: number;
      oscAmp: number;
    }[] = [];

    for (let i = 0; i < flowCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phiAngle = 0.3 + Math.random() * 2.5;
      const rBase = 2.4 + Math.random() * 0.9;
      const speed = (0.003 + Math.random() * 0.006) * (Math.random() > 0.35 ? 1 : -1);
      const oscFreq = 2 + Math.floor(Math.random() * 4);
      const oscAmp = 0.08 + Math.random() * 0.16;

      flowData.push({
        theta,
        speed,
        rBase,
        phi: phiAngle,
        oscFreq,
        oscAmp,
      });

      flowPos[i * 3] = rBase * Math.sin(phiAngle) * Math.cos(theta);
      flowPos[i * 3 + 1] = rBase * Math.cos(phiAngle);
      flowPos[i * 3 + 2] = rBase * Math.sin(phiAngle) * Math.sin(theta);
    }

    flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
    const flowMat = new THREE.PointsMaterial({
      size: 0.048,
      color: primaryHex,
      transparent: true,
      opacity: isLight ? 0.45 : 0.75,
      blending: THREE.AdditiveBlending,
    });
    const flowParticles = new THREE.Points(flowGeo, flowMat);
    globeSystemGroup.add(flowParticles);

    // 3. FOREGROUND FLOATING DEPTH DUST
    const fgCount = 60;
    const fgGeo = new THREE.BufferGeometry();
    const fgPos = new Float32Array(fgCount * 3);
    const fgVel: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < fgCount; i++) {
      fgPos[i * 3] = (Math.random() - 0.5) * 11;
      fgPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      fgPos[i * 3 + 2] = 0.8 + Math.random() * 3.8;
      fgVel.push({
        x: (Math.random() - 0.5) * 0.0016,
        y: (Math.random() - 0.5) * 0.0016,
        z: -0.0012 - Math.random() * 0.002,
      });
    }
    fgGeo.setAttribute("position", new THREE.BufferAttribute(fgPos, 3));
    const fgMat = new THREE.PointsMaterial({
      size: 0.05,
      color: primaryHex,
      transparent: true,
      opacity: isLight ? 0.3 : 0.6,
      blending: THREE.AdditiveBlending,
    });
    const fgParticles = new THREE.Points(fgGeo, fgMat);
    scene.add(fgParticles);

    // 4. ANIMATION LOOP & 3D PROJECTION
    let animId: number;
    const clock = new THREE.Clock();
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const updateSize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(mount);
    window.addEventListener("resize", updateSize);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera parallax based on mouse
      currentParallaxX += (mousePos.x * 0.7 - currentParallaxX) * 0.05;
      currentParallaxY += (-mousePos.y * 0.45 - currentParallaxY) * 0.05;

      // Scroll camera flight: camera pushes subtly forward while spatial elements recede
      const safeScroll = isNaN(scrollProgress) ? 0 : scrollProgress;
      const scrollCamZ = 6.2 - safeScroll * 0.6;
      const scrollGlobeZ = -safeScroll * 1.5;
      const scrollGlobeScale = Math.max(0.7, 1.0 - safeScroll * 0.15);

      camera.position.x = currentParallaxX;
      camera.position.y = currentParallaxY;
      camera.position.z = scrollCamZ;
      camera.lookAt(0, 0, 0);

      // Smooth spatial rotation for orbit labels and fluid particles
      globeSystemGroup.position.z = scrollGlobeZ;
      globeSystemGroup.scale.setScalar(scrollGlobeScale);
      globeSystemGroup.rotation.y = time * 0.015 + currentParallaxX * 0.1;

      // Animate Google Flow 3D fluid particles
      const flowAttr = flowGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < flowCount; i++) {
        const item = flowData[i];
        item.theta += item.speed;

        const harmonicR =
          item.rBase + Math.sin(time * item.oscFreq + item.theta * 3) * item.oscAmp;
        const px = harmonicR * Math.sin(item.phi) * Math.cos(item.theta);
        const py = harmonicR * Math.cos(item.phi);
        const pz = harmonicR * Math.sin(item.phi) * Math.sin(item.theta);

        flowAttr.setXYZ(i, px, py, pz);
      }
      flowAttr.needsUpdate = true;

      // Animate foreground floating depth dust
      const fgAttr = fgGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fgCount; i++) {
        let px = fgAttr.getX(i) + fgVel[i].x;
        let py = fgAttr.getY(i) + fgVel[i].y;
        let pz = fgAttr.getZ(i) + fgVel[i].z;

        if (pz < -1.0) {
          pz = 4.2;
          px = (Math.random() - 0.5) * 11;
          py = (Math.random() - 0.5) * 8;
        }
        fgAttr.setXYZ(i, px, py, pz);
      }
      fgAttr.needsUpdate = true;

      // Project floating 3D labels into screen space
      const currentLabels = labelsRef.current;
      const updatedLabels = currentLabels.map((lbl) => {
        const theta = lbl.theta + lbl.speed;
        const x = lbl.radius * Math.sin(lbl.phi) * Math.cos(theta);
        const y = lbl.radius * Math.cos(lbl.phi);
        const z = lbl.radius * Math.sin(lbl.phi) * Math.sin(theta);

        const pos3D = new THREE.Vector3(x, y, z);
        pos3D.applyMatrix4(globeSystemGroup.matrixWorld);

        const isFront = pos3D.z > -0.5;

        // Project to 2D NDC
        pos3D.project(camera);

        const currentW = mount.clientWidth || window.innerWidth;
        const currentH = mount.clientHeight || window.innerHeight;

        const sx = ((pos3D.x + 1) * currentW) / 2;
        const sy = ((-pos3D.y + 1) * currentH) / 2;

        const dist = camera.position.distanceTo(new THREE.Vector3(x, y, z));
        const scale = Math.max(0.65, Math.min(1.15, 6.2 / dist));
        const opacity = isFront
          ? Math.max(0.35, Math.min(1, (pos3D.z + 1) * 0.75))
          : 0.18;

        return {
          ...lbl,
          theta,
          screenX: sx,
          screenY: sy,
          scale,
          opacity,
          isFront,
        };
      });

      setLabels(updatedLabels);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();

      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      flowGeo.dispose();
      flowMat.dispose();
      fgGeo.dispose();
      fgMat.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isLight, customization.primaryColor, customization.secondaryColor]);

  const primaryCol = customization.primaryColor || "#00f0ff";

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Three.js Canvas Mount - transparent overlay so background globe shines unobstructed */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 3D Floating Labels Anchored in Physical Space */}
      {labels.map((lbl, idx) => {
        if (lbl.screenX <= -100 || lbl.screenY <= -100) return null;
        return (
          <div
            key={lbl.name || idx}
            className="absolute transition-transform duration-75 ease-out select-none will-change-transform"
            style={{
              left: `${lbl.screenX}px`,
              top: `${lbl.screenY}px`,
              transform: `translate(-50%, -50%) scale(${lbl.scale.toFixed(3)})`,
              opacity: lbl.opacity,
              zIndex: lbl.isFront ? 25 : 5,
            }}
          >
            <div className="flex items-center gap-2 group pointer-events-auto cursor-default">
              {/* Pulsing spatial anchor dot */}
              <div className="relative flex items-center justify-center">
                <span
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: primaryCol,
                    boxShadow: `0 0 10px ${primaryCol}`,
                  }}
                />
                <span
                  className="absolute w-4 h-4 rounded-full border animate-ping"
                  style={{ borderColor: `${primaryCol}80` }}
                />
              </div>

              {/* Floating Spatial Pill / Badge with Glassmorphism */}
              <div
                className="px-2.5 py-1 rounded-md backdrop-blur-md border shadow-lg flex flex-col transition-all duration-300"
                style={{
                  backgroundColor: "rgba(8, 11, 17, 0.75)",
                  borderColor: `${primaryCol}40`,
                  boxShadow: `0 4px 20px ${primaryCol}25`,
                }}
              >
                <span
                  className="text-[0.58rem] font-mono tracking-widest uppercase leading-none font-bold"
                  style={{ color: primaryCol }}
                >
                  {lbl.name}
                </span>
                <span className="text-[0.48rem] font-mono tracking-wider text-slate-300 uppercase leading-tight">
                  {lbl.tag}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
