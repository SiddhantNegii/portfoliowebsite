import * as THREE from 'three';
import { ARCADE_CHANNELS, PROJECTS, ROOM } from '../content.js';

const ROWS = 6;
const TERMINAL = ROOM.macbook.screen ?? [];
const fit = (t, n) => (t.length > n ? `${t.slice(0, n - 2)}..` : t);

export function drawArcade(x, w, h, pixel, { mode, channel, index }) {
  x.fillStyle = '#100c18';
  x.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 8) {
    x.fillStyle = 'rgba(255,255,255,.035)';
    x.fillRect(0, y, w, 3);
  }
  const line = (t, px, color, y, align = 'left', left = 90) => {
    x.textAlign = align;
    x.fillStyle = color;
    x.font = pixel(px);
    x.fillText(t, { center: w / 2, right: w - left }[align] ?? left, y);
  };

  if (mode === 'menu') {
    line('PLAYER 1', 40, '#ff2e88', 110, 'center');
    line('SELECT CHANNEL', 34, '#ffe9a8', 210, 'center');
    ARCADE_CHANNELS.forEach((c, i) => line(`${i === channel ? '>' : ' '} ${c.name}`, 38, i === channel ? '#00e0c6' : '#ffe9a8', 330 + i * 90, 'left', 260));
    line('PRESS A', 28, '#ffc531', h - 50, 'center');
    return;
  }

  const { name, items } = ARCADE_CHANNELS[channel];
  const rows = [...items, '< BACK'];
  const start = Math.max(0, Math.min(index - 2, rows.length - ROWS));
  line(name, 36, '#ff2e88', 90, 'left', 60);
  line(`${Math.min(index + 1, items.length)}/${items.length}`, 28, '#ffc531', 90, 'right', 60);
  rows.slice(start, start + ROWS).forEach((t, k) => {
    const i = start + k;
    const on = i === index;
    if (on) {
      x.fillStyle = 'rgba(0,224,198,.16)';
      x.fillRect(40, 150 + k * 92, w - 80, 76);
    }
    line(`${on ? '>' : ' '} ${fit(t, 26)}`, 30, on ? '#00e0c6' : '#ffe9a8', 200 + k * 92, 'left', 60);
  });
  if (start + ROWS < rows.length) line('MORE BELOW', 22, '#ffc531', h - 30, 'center');
}

export const VIEWS = {
  macbook: { target: [-0.5, 1.05, -0.4], from: [0.25, 0.65, 1.7] },
  monitor: { target: [0.4, 1.4, -0.8], from: [0.05, 0.25, 2.2] },
  arcade: { target: [2.55, 1.4, -0.75], from: [1.0, 0.25, 3.1] },
  couch: { target: [-2.15, 0.5, 1.15], from: [2.6, 1.3, 2.0] },
  fridge: { target: [-2.6, 1.0, -0.6], from: [2.6, 1.5, 1.5] },
  phone: { target: [1.3, 0.65, 1.2], from: [-0.4, 0.55, 1.6] },
};

export function buildRoom(scene, kit) {
  const { box, cyl, ball, put, screen, group, fonts } = kit;
  const { mono, pixel, display } = fonts;

  const rug = box(5.6, 0.02, 3.6, 0xcfc6bb, 1);
  rug.castShadow = false;
  put(scene, rug, 0, 0.01, 0.15);

  /* desk */
  const desk = new THREE.Group();
  desk.position.set(0, 0, -0.55);
  scene.add(desk);
  put(desk, box(2.5, 0.08, 1.0, 0x2b2b2f, 0.6), 0, 0.76, 0);
  [[-1.16, -0.43], [1.16, -0.43], [-1.16, 0.43], [1.16, 0.43]].forEach(([x, z]) => put(desk, box(0.07, 0.72, 0.07, 0xa3a3a8, 0.4, 0.4), x, 0.36, z));
  put(desk, box(0.55, 0.42, 0.86, 0xb9b9be, 0.5), 0.86, 0.5, 0);
  put(desk, cyl(0.055, 0.05, 0.11, 0xff9900), 1.0, 0.855, 0.25);
  put(desk, cyl(0.09, 0.07, 0.16, 0x8e8b93), -1.05, 0.88, -0.25);
  for (let i = 0; i < 5; i++) {
    const leaf = ball(0.09, i % 2 ? 0x6f9a5b : 0x5f8a4d);
    leaf.scale.set(0.6, 1.5, 0.6);
    leaf.rotation.z = (i - 2) * 0.35;
    put(desk, leaf, -1.05 + (i - 2) * 0.04, 1.05, -0.25);
  }

  /* MacBook */
  const mac = group('macbook', -0.5, 0.8, -0.35, 0.25);
  put(mac, box(0.66, 0.03, 0.46, 0xc9cbd0, 0.35, 0.6), 0, 0.015, 0);
  put(mac, box(0.56, 0.004, 0.2, 0x2a2b2f, 0.8), 0, 0.032, -0.04);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.03, -0.23);
  hinge.rotation.x = -0.28;
  mac.add(hinge);
  put(hinge, box(0.66, 0.44, 0.02, 0xc9cbd0, 0.35, 0.6), 0, 0.22, 0);
  put(hinge, screen(0.6, 0.38, (x, w, h) => {
    x.fillStyle = '#111317'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#2a2d34'; x.fillRect(0, 0, w, 54);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(34 + i * 34, 27, 10, 0, 7); x.fill(); });
    x.font = mono(30); x.fillStyle = '#9aa0aa'; x.fillText('~/siddhant — zsh', 150, 37);
    TERMINAL.slice(0, 7).forEach((t, i) => {
      x.fillStyle = t.startsWith('$') ? '#63e2c6' : '#f2f2f2';
      x.font = mono(34);
      x.fillText(fit(t, 30), 40, 108 + i * 52);
    });
  }), 0, 0.22, 0.011);

  /* Monitor */
  const mon = group('monitor', 0.4, 0.8, -0.8);
  put(mon, box(0.34, 0.02, 0.22, 0x2a2a2e, 0.5), 0, 0.01, 0);
  put(mon, box(0.05, 0.36, 0.05, 0x2a2a2e, 0.5), 0, 0.19, -0.04);
  put(mon, box(1.05, 0.62, 0.05, 0x1d1d20, 0.5), 0, 0.62, 0);
  put(mon, screen(0.99, 0.56, (x, w) => {
    x.fillStyle = '#f4f3f7'; x.fillRect(0, 0, w, 600);
    x.fillStyle = '#1b1a1f'; x.font = mono(52, 800); x.fillText('projects/', 46, 84);
    PROJECTS.slice(0, 5).forEach((p, i) => {
      const slug = fit(p.t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), 24);
      x.fillStyle = p.live ? '#2f7d6d' : '#55525e';
      x.font = mono(38);
      x.fillText(`${p.live ? '●' : '○'} ${slug}`, 46, 170 + i * 76);
      x.fillText(p.live ? 'LIVE' : 'repo', w - 170, 170 + i * 76);
    });
  }), 0, 0.62, 0.026);

  /* chair */
  const chair = new THREE.Group();
  chair.position.set(0.05, 0, 0.35);
  chair.rotation.y = -0.35;
  scene.add(chair);
  put(chair, box(0.56, 0.08, 0.56, 0xb07a4f, 0.55), 0, 0.5, 0);
  put(chair, box(0.56, 0.58, 0.08, 0xb07a4f, 0.55), 0, 0.86, 0.26);
  put(chair, cyl(0.03, 0.03, 0.44, 0x3a3a3e), 0, 0.26, 0);
  for (let i = 0; i < 5; i++) {
    const leg = box(0.32, 0.03, 0.05, 0x3a3a3e, 0.5);
    leg.rotation.y = (i * Math.PI * 2) / 5;
    leg.position.set(Math.cos(i * 1.2566) * 0.16, 0.05, -Math.sin(i * 1.2566) * 0.16);
    chair.add(leg);
  }

  /* fridge */
  const fridge = group('fridge', -2.6, 0, -0.6, 0.25);
  put(fridge, box(0.82, 1.78, 0.74, 0xe8ece6, 0.4), 0, 0.93, 0);
  put(fridge, box(0.83, 0.015, 0.75, 0xb9bdb6, 0.5), 0, 1.3, 0);
  put(fridge, box(0.05, 0.3, 0.05, 0x9aa0a6, 0.3, 0.7), 0.32, 1.52, 0.4);
  put(fridge, box(0.05, 0.5, 0.05, 0x9aa0a6, 0.3, 0.7), 0.32, 0.95, 0.4);
  [[0xff2e88, -0.2, 1.0], [0x00e0c6, 0.0, 0.85], [0xffc531, -0.1, 0.7], [0xff9900, 0.12, 1.08]].forEach(([c, x, y]) => put(fridge, box(0.09, 0.09, 0.02, c, 0.5), x, y, 0.38));
  [[-0.2, 0.08], [0.2, 0.08], [-0.2, -0.3], [0.2, -0.3]].forEach(([x, z]) => put(fridge, cyl(0.03, 0.03, 0.04, 0x55525e), x, 0.02, z));
  put(fridge, box(0.26, 0.2, 0.14, 0xe5243b, 0.6), -0.18, 1.92, 0);
  put(fridge, box(0.16, 0.14, 0.12, 0x3b82f6, 0.6), 0.16, 1.89, 0.05);

  /* arcade cabinet */
  const arcade = group('arcade', 2.55, 0, -0.75, 0.3);
  const CAB = 0x2a2236;
  put(arcade, box(0.82, 1.02, 0.72, CAB, 0.55), 0, 0.51, 0);
  put(arcade, box(0.82, 0.92, 0.46, CAB, 0.55), 0, 1.48, -0.13);
  put(arcade, box(0.82, 0.3, 0.3, CAB, 0.55), 0, 2.07, -0.04);
  [-0.416, 0.416].forEach((x) => {
    put(arcade, box(0.012, 1.9, 0.06, 0xff2e88, 0.5), x, 1.0, 0.18);
    put(arcade, box(0.012, 1.6, 0.04, 0xffc531, 0.5), x, 0.85, 0.06);
    put(arcade, box(0.012, 1.2, 0.03, 0x00e0c6, 0.5), x, 0.7, -0.05);
  });
  const panel = box(0.82, 0.07, 0.36, 0x3a3046, 0.6);
  panel.rotation.x = 0.32;
  put(arcade, panel, 0, 1.06, 0.24);
  const stick = new THREE.Group();
  stick.position.set(-0.2, 1.09, 0.24);
  arcade.add(stick);
  put(stick, cyl(0.014, 0.014, 0.12, 0x1b1a1f, 10), 0, 0.06, 0).userData.control = 'down';
  put(stick, ball(0.038, 0xe5243b), 0, 0.13, 0).userData.control = 'down';
  const buttons = [[0xff2e88, 0.02], [0x00e0c6, 0.13], [0xffc531, 0.24]].map(([c, x]) => {
    const button = cyl(0.03, 0.03, 0.025, c, 16);
    button.rotation.x = 0.32;
    button.userData.control = 'enter';
    button.userData.baseY = 1.11;
    return put(arcade, button, x, 1.11, 0.25);
  });
  put(arcade, box(0.22, 0.26, 0.012, 0x1b1a1f, 0.4), 0, 0.42, 0.362);
  [-0.05, 0.05].forEach((x) => put(arcade, box(0.03, 0.06, 0.01, 0xffc531, 0.3, 0.6), x, 0.47, 0.37));
  const arcadeScreen = screen(0.64, 0.5, (x, w, h) => drawArcade(x, w, h, pixel, { mode: 'menu', channel: 0, index: 0 }));
  put(arcade, arcadeScreen, 0, 1.5, 0.106);
  const marquee = screen(0.76, 0.22, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#ff2e88'); g.addColorStop(1, '#7b2bff');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#ffe9a8'; x.textAlign = 'center'; x.font = pixel(96); x.fillText('FAVES', w / 2, h / 2 + 46);
    x.fillStyle = '#ffc531';
    [[60, 70], [w - 60, 70], [110, h - 60], [w - 110, h - 60]].forEach(([sx, sy]) => { x.beginPath(); x.arc(sx, sy, 12, 0, 7); x.fill(); });
  });
  put(arcade, marquee, 0, 2.07, 0.111);
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 128;
  const gx = glowCanvas.getContext('2d');
  const halo = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
  halo.addColorStop(0, 'rgba(255,46,136,1)');
  halo.addColorStop(1, 'rgba(255,46,136,0)');
  gx.fillStyle = halo;
  gx.fillRect(0, 0, 128, 128);
  const marqueeGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.0),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, opacity: 0.12, depthWrite: false }),
  );
  put(arcade, marqueeGlow, 0, 2.07, -0.2);

  /* couch with hobby props */
  const couch = group('couch', -2.15, 0, 1.15, 0.85);
  const SOFA = 0x4f7a74;
  const SOFA_LIGHT = 0x5d8a83;
  put(couch, box(1.8, 0.36, 0.86, SOFA, 0.9), 0, 0.24, 0);
  put(couch, box(1.8, 0.6, 0.22, SOFA, 0.9), 0, 0.62, -0.32);
  [-0.88, 0.88].forEach((x) => put(couch, box(0.2, 0.52, 0.86, SOFA, 0.9), x, 0.38, 0));
  [-0.4, 0.4].forEach((x) => put(couch, box(0.78, 0.14, 0.64, SOFA_LIGHT, 0.95), x, 0.49, 0.07));
  [[-0.82, -0.36], [0.82, -0.36], [-0.82, 0.36], [0.82, 0.36]].forEach(([x, z]) => put(couch, cyl(0.03, 0.025, 0.07, 0x5e4433, 10), x, 0.035, z));
  const sketch = box(0.34, 0.02, 0.25, 0xfaf7f0, 0.8);
  sketch.rotation.y = 0.35;
  put(couch, sketch, 0.42, 0.57, 0.12);
  const doodle = box(0.18, 0.003, 0.12, 0x1b1a1f, 1);
  doodle.rotation.y = 0.35;
  put(couch, doodle, 0.4, 0.582, 0.1);
  const pencil = cyl(0.008, 0.008, 0.18, 0xffc531, 8);
  pencil.rotation.z = Math.PI / 2;
  pencil.rotation.y = 0.9;
  put(couch, pencil, 0.42, 0.59, 0.12);
  put(couch, box(0.24, 0.05, 0.62, 0x3b82f6, 0.95), 0.88, 0.67, 0);
  [0.15, -0.15].forEach((z) => put(couch, box(0.245, 0.052, 0.06, 0xffffff, 0.95), 0.88, 0.67, z));
  [-0.06, 0.06].forEach((dx) => {
    const lens = cyl(0.04, 0.04, 0.025, 0x00e0c6, 18);
    lens.rotation.x = Math.PI / 2;
    put(couch, lens, 0.75 + dx, 0.715, 0.3);
  });
  const cushion = box(0.4, 0.36, 0.12, 0xff2e88, 0.95);
  cushion.rotation.set(-0.25, 0, 0.12);
  put(couch, cushion, -0.62, 0.68, -0.15);
  const katana = new THREE.Group();
  katana.position.set(-1.02, 0, 0.25);
  katana.rotation.z = -0.28;
  couch.add(katana);
  put(katana, box(0.025, 0.72, 0.01, 0xd9dde3, 0.2, 0.8), 0, 0.52, 0);
  put(katana, box(0.08, 0.02, 0.05, 0xffc531, 0.4, 0.6), 0, 0.16, 0);
  put(katana, box(0.03, 0.2, 0.03, 0x7a1e2a, 0.8), 0, 0.05, 0);
  const pan = new THREE.Group();
  pan.position.set(1.05, 0, 0.55);
  couch.add(pan);
  put(pan, cyl(0.15, 0.13, 0.04, 0x2b2b2f, 32, 0.5), 0, 0.02, 0);
  put(pan, box(0.22, 0.02, 0.035, 0x5e4433, 0.7), 0.26, 0.03, 0);

  const dumbbell = new THREE.Group();
  dumbbell.position.set(-1.0, 0.07, 1.2);
  dumbbell.rotation.y = 0.6;
  scene.add(dumbbell);
  const bar = cyl(0.018, 0.018, 0.34, 0x9aa0a6, 12, 0.3);
  bar.rotation.z = Math.PI / 2;
  put(dumbbell, bar, 0, 0, 0);
  [-0.15, 0.15].forEach((x) => {
    const plate = cyl(0.07, 0.07, 0.05, 0x1b1a1f, 20, 0.6);
    plate.rotation.z = Math.PI / 2;
    put(dumbbell, plate, x, 0, 0);
  });

  /* floor lamp: toggles day / night */
  const lamp = group('lamp', -3.05, 0, 0.6);
  put(lamp, cyl(0.15, 0.17, 0.035, 0x2b2b2f, 28, 0.5), 0, 0.018, 0);
  put(lamp, cyl(0.013, 0.013, 1.5, 0x2b2b2f, 10, 0.4), 0, 0.77, 0);
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0xf1e6d2, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffc98a, emissiveIntensity: 0 });
  const shadeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.26, 32, 1, true), shadeMat);
  shadeMesh.castShadow = true;
  shadeMesh.userData.keepEmissive = true;
  put(lamp, shadeMesh, 0, 1.55, 0);
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff4dc, emissive: 0xffd9a0, emissiveIntensity: 0 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), bulbMat);
  bulb.userData.keepEmissive = true;
  put(lamp, bulb, 0, 1.5, 0);
  const lampLight = new THREE.PointLight(0xffc98a, 0, 7, 1.6);
  lampLight.position.set(0, 1.45, 0);
  lamp.add(lampLight);

  /* phone */
  const phone = group('phone', 1.3, 0, 1.2);
  put(phone, cyl(0.3, 0.3, 0.04, 0x7a5a42), 0, 0.56, 0);
  put(phone, cyl(0.04, 0.04, 0.54, 0x5e4433, 12), 0, 0.28, 0);
  put(phone, cyl(0.18, 0.18, 0.02, 0x5e4433), 0, 0.01, 0);
  put(phone, box(0.28, 0.1, 0.22, 0xc8302f, 0.45), 0, 0.63, 0);
  const dial = cyl(0.07, 0.07, 0.015, 0xefe6d6);
  dial.rotation.x = -0.5;
  put(phone, dial, 0, 0.69, 0.07);
  const handset = cyl(0.035, 0.035, 0.32, 0xa82422);
  handset.rotation.z = Math.PI / 2;
  put(phone, handset, 0, 0.73, -0.04);
  [-0.16, 0.16].forEach((x) => put(phone, box(0.08, 0.06, 0.09, 0xa82422, 0.45), x, 0.72, -0.04));

  /* tall plant */
  put(scene, cyl(0.22, 0.18, 0.42, 0x8e8b93), -1.5, 0.21, -1.25);
  for (let i = 0; i < 7; i++) {
    const leaf = ball(0.16, i % 2 ? 0x6f9a5b : 0x7aa866);
    leaf.scale.set(0.5, 1.7, 0.5);
    leaf.rotation.z = (i - 3) * 0.32;
    leaf.rotation.x = ((i % 3) - 1) * 0.25;
    put(scene, leaf, -1.5 + (i - 3) * 0.05, 0.75, -1.25);
  }

  couch.updateMatrixWorld(true);
  const napSpot = couch.localToWorld(new THREE.Vector3(-0.4, 0.56, 0.06));
  const napHeading = couch.rotation.y + Math.PI / 2;

  const setArcade = (state) => {
    const { map } = arcadeScreen.material;
    drawArcade(map.image.getContext('2d'), map.image.width, map.image.height, pixel, state);
    map.needsUpdate = true;
  };

  return { marquee, marqueeGlow, arcade: { stick, buttons, setArcade }, lamp: { light: lampLight, shade: shadeMat, bulb: bulbMat }, napSpot, napHeading };
}
