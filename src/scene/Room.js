import * as THREE from 'three';
import { createKit } from './kit.js';
import { buildRoom, VIEWS } from './objects.js';
import { Cat } from './cat.js';
import { sound } from '../sound.js';

const DAY = { bg: new THREE.Color(0xdcdbe0), sky: 2.7, sun: 2.5, sunColor: new THREE.Color(0xffffff), lamp: 0, shadow: 0.16 };
const NIGHT = { bg: new THREE.Color(0x1d1b26), sky: 0.35, sun: 0.35, sunColor: new THREE.Color(0x8b9cff), lamp: 9, shadow: 0.32 };
const GLOW = new THREE.Color(0xfff2b0);
const HOME = new THREE.Vector3(0, 0.8, 0);
const HOLD_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.6);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export class Room {
  constructor(container, { night = false, onHover, onSelect, onLamp, onArcade }) {
    this.container = container;
    this.callbacks = { onHover, onSelect, onLamp, onArcade };
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.prepend(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    scene.background = DAY.bg.clone();
    scene.fog = new THREE.Fog(DAY.bg.clone(), 18, 32);
    this.scene = scene;
    this.camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 100);

    this.sky = new THREE.HemisphereLight(0xffffff, 0xb6b3bd, DAY.sky);
    scene.add(this.sky);
    this.sun = new THREE.DirectionalLight(0xffffff, DAY.sun);
    this.sun.position.set(5, 9, 6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    Object.assign(this.sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 32 });
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.02;
    scene.add(this.sun);

    this.floorMat = new THREE.ShadowMaterial({ opacity: DAY.shadow });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), this.floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const kit = createKit(scene);
    this.groups = kit.groups;
    this.parts = buildRoom(scene, kit);
    this.cat = new Cat(kit, this.parts.napSpot, this.parts.napHeading);
    this.down = new THREE.Raycaster();
    this.cat.surfaceAt = (x, z) => this.surfaceAt(x, z);

    this.target = HOME.clone();
    this.orbit = { theta: 0.7, phi: 1.02, radius: 12.5 };
    this.tween = null;
    this.stickKick = 0;
    this.presses = [0, 0, 0];
    this.nextButton = 0;
    this.shift = new THREE.Vector2();
    this.focused = null;
    this.hovered = null;
    this.drag = null;
    this.night = night ? 1 : 0;
    this.nightTarget = this.night;
    this.ray = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clock = new THREE.Clock();

    this.bindPointer();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.applyNight();
    this.placeCamera();
    renderer.setAnimationLoop(() => this.frame());
  }

  orbitPosition(around = this.target) {
    const { theta, phi, radius } = this.orbit;
    return new THREE.Vector3(
      around.x + radius * Math.sin(phi) * Math.sin(theta),
      around.y + radius * Math.cos(phi),
      around.z + radius * Math.sin(phi) * Math.cos(theta),
    );
  }

  placeCamera() {
    this.camera.position.copy(this.orbitPosition());
    this.camera.lookAt(this.target);
  }

  flyTo(position, look, shift, done) {
    this.tween = {
      p0: this.camera.position.clone(), l0: this.target.clone(), s0: this.shift.clone(),
      p1: position, l1: look, s1: shift,
      t0: performance.now(), dur: this.reduceMotion ? 1 : 1100, done,
    };
  }

  drawerShift() {
    const { clientWidth: w, clientHeight: h } = this.container;
    return w > 640 ? new THREE.Vector2(Math.min(480, w) / 2, 0) : new THREE.Vector2(0, h * 0.36);
  }

  applyShift() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (this.shift.lengthSq() < 0.25) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, this.shift.x, this.shift.y, w, h);
  }

  focus(key) {
    const view = VIEWS[key];
    if (!view) return;
    this.focused = key;
    this.callbacks.onHover?.(null);
    sound.play('open');
    const look = new THREE.Vector3(...view.target);
    const from = new THREE.Vector3(...view.from);
    from.multiplyScalar(this.camera.aspect < 1 ? 1.9 : 1.3);
    this.flyTo(look.clone().add(from), look, this.drawerShift(), () => this.callbacks.onSelect?.(key));
  }

  release() {
    if (!this.focused) return;
    this.focused = null;
    sound.play('close');
    this.flyTo(this.orbitPosition(HOME), HOME.clone(), new THREE.Vector2());
  }

  setNight(on) {
    this.nightTarget = on ? 1 : 0;
    if (this.reduceMotion) this.night = this.nightTarget;
  }

  hit(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.ray.setFromCamera(this.pointer, this.camera);
    return this.ray.intersectObjects(Object.values(this.groups), true)[0]?.object;
  }

  pick(event) {
    let object = this.hit(event);
    while (object && !object.userData.key) object = object.parent;
    return object?.userData.key ?? null;
  }

  control(event) {
    let object = this.hit(event);
    while (object && !object.userData.control && !object.userData.key) object = object.parent;
    return object?.userData.control ?? null;
  }

  surfaceAt(x, z) {
    this.down.set(new THREE.Vector3(x, 5, z), new THREE.Vector3(0, -1, 0));
    const hit = this.down.intersectObjects(this.scene.children, true).find((h) => {
      if (h.object.isSprite || !h.object.isMesh) return false;
      for (let o = h.object; o; o = o.parent) if (o === this.cat.root) return false;
      return true;
    });
    return Math.max(0, hit?.point.y ?? 0);
  }

  holdPoint(event) {
    this.hit(event);
    const top = this.ray.intersectObjects(this.scene.children, true).find((h) => {
      if (h.object.isSprite || !h.object.isMesh || !h.face) return false;
      for (let o = h.object; o; o = o.parent) if (o === this.cat.root) return false;
      return true;
    });
    const inward = top && top.face.normal.clone().transformDirection(top.object.matrixWorld).multiplyScalar(-0.05);
    const point = top ? top.point.clone().add(inward) : this.ray.ray.intersectPlane(HOLD_PLANE, new THREE.Vector3());
    if (!point) return null;
    point.x = THREE.MathUtils.clamp(point.x, -3.2, 3.2);
    point.z = THREE.MathUtils.clamp(point.z, -1.6, 2.4);
    point.y = this.surfaceAt(point.x, point.z) + 0.45;
    return point;
  }

  setArcade(state) {
    this.parts.arcade.setArcade(state);
  }

  arcadeInput(type) {
    if (type === 'up' || type === 'down') this.stickKick = type === 'down' ? 0.45 : -0.45;
    else if (type === 'back') this.stickKick = -0.3;
    else {
      this.presses[this.nextButton] = 1;
      this.nextButton = (this.nextButton + 1) % this.presses.length;
    }
  }

  bindPointer() {
    const canvas = this.renderer.domElement;
    canvas.style.cursor = 'grab';
    this.listeners = {
      pointerdown: (e) => {
        canvas.setPointerCapture(e.pointerId);
        if (!this.focused && !this.tween && this.pick(e) === 'cat') {
          this.catDrag = { x: e.clientX, y: e.clientY, held: false };
          return;
        }
        this.drag = { x: e.clientX, y: e.clientY, moved: false };
      },
      pointermove: (e) => {
        if (this.catDrag) {
          const point = this.holdPoint(e);
          if (!this.catDrag.held && point && Math.abs(e.clientX - this.catDrag.x) + Math.abs(e.clientY - this.catDrag.y) > 6) {
            this.catDrag.held = true;
            this.cat.grab(point);
            this.hovered = null;
            this.callbacks.onHover?.(null);
          }
          if (this.catDrag.held && point) this.cat.holdAt(point);
          canvas.style.cursor = 'grabbing';
          return;
        }
        const busy = this.focused || this.tween;
        if (this.drag && !busy) {
          const dx = e.clientX - this.drag.x;
          const dy = e.clientY - this.drag.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) this.drag.moved = true;
          this.orbit.theta = THREE.MathUtils.clamp(this.orbit.theta - dx * 0.005, -0.4, 1.5);
          this.orbit.phi = THREE.MathUtils.clamp(this.orbit.phi - dy * 0.003, 0.8, 1.22);
          this.drag.x = e.clientX;
          this.drag.y = e.clientY;
          this.placeCamera();
        }
        if (this.focused === 'arcade' && !this.tween && e.pointerType !== 'touch') {
          canvas.style.cursor = this.control(e) ? 'pointer' : 'default';
          return;
        }
        if (busy || e.pointerType === 'touch') return;
        const key = this.pick(e);
        if (key !== this.hovered) {
          this.hovered = key;
          if (key) {
            this.groups[key].userData.hoverAt = performance.now();
            sound.play('hover');
          }
        }
        canvas.style.cursor = key ? 'pointer' : this.drag ? 'grabbing' : 'grab';
        this.callbacks.onHover?.(key, e.clientX, e.clientY);
      },
      pointerup: (e) => {
        if (this.catDrag) {
          if (this.catDrag.held) this.cat.drop();
          else this.cat.pet();
          this.catDrag = null;
          canvas.style.cursor = 'grab';
          return;
        }
        const dragged = this.drag?.moved;
        this.drag = null;
        if (this.focused === 'arcade' && !this.tween && !dragged) {
          const type = this.control(e);
          if (type) this.callbacks.onArcade?.(type);
          return;
        }
        if (dragged || this.focused || this.tween) return;
        const key = this.pick(e);
        if (key === 'lamp') this.callbacks.onLamp?.();
        else if (key) this.focus(key);
      },
      pointercancel: () => {
        if (this.catDrag?.held) this.cat.drop();
        this.catDrag = null;
        this.drag = null;
      },
      pointerleave: () => {
        this.hovered = null;
        this.callbacks.onHover?.(null);
      },
    };
    Object.entries(this.listeners).forEach(([type, fn]) => canvas.addEventListener(type, fn));
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.orbit.radius = w / h < 1 ? 19 : 12.5;
    this.camera.updateProjectionMatrix();
    if (this.focused && !this.tween) this.shift.copy(this.drawerShift());
    this.applyShift();
    if (!this.focused && !this.tween) this.placeCamera();
  }

  applyNight() {
    const n = this.night;
    const { bg, sky, sun, sunColor, lamp, shadow } = DAY;
    this.scene.background.copy(bg).lerp(NIGHT.bg, n);
    this.scene.fog.color.copy(this.scene.background);
    this.sky.intensity = THREE.MathUtils.lerp(sky, NIGHT.sky, n);
    this.sun.intensity = THREE.MathUtils.lerp(sun, NIGHT.sun, n);
    this.sun.color.copy(sunColor).lerp(NIGHT.sunColor, n);
    this.floorMat.opacity = THREE.MathUtils.lerp(shadow, NIGHT.shadow, n);
    this.parts.lamp.light.intensity = THREE.MathUtils.lerp(lamp, NIGHT.lamp, n);
    this.parts.lamp.shade.emissiveIntensity = n * 0.9;
    this.parts.lamp.bulb.emissiveIntensity = n * 2.5;
    this.cat.night = n;
  }

  frame() {
    const now = performance.now();
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    if (this.tween) {
      const t = Math.min(1, (now - this.tween.t0) / this.tween.dur);
      const k = ease(t);
      this.camera.position.lerpVectors(this.tween.p0, this.tween.p1, k);
      this.target.lerpVectors(this.tween.l0, this.tween.l1, k);
      this.shift.lerpVectors(this.tween.s0, this.tween.s1, k);
      this.applyShift();
      this.camera.lookAt(this.target);
      if (t === 1) {
        const { done } = this.tween;
        this.tween = null;
    this.stickKick = 0;
    this.presses = [0, 0, 0];
    this.nextButton = 0;
    this.shift = new THREE.Vector2();
        done?.();
      }
    }

    if (this.night !== this.nightTarget) {
      const step = dt * 2.2;
      this.night = Math.abs(this.nightTarget - this.night) < step ? this.nightTarget : this.night + Math.sign(this.nightTarget - this.night) * step;
      this.applyNight();
    }

    Object.values(this.groups).forEach((g) => {
      const { key, baseY, hoverAt, noLift } = g.userData;
      const on = key === this.hovered && !this.focused;
      if (!noLift) {
        g.userData.lift += ((on || key === this.focused ? 0.06 : 0) - g.userData.lift) * 0.18;
        g.position.y = baseY + g.userData.lift;
      }
      const since = (now - hoverAt) / 1000;
      const flash = on && since < 0.7 && !this.reduceMotion ? (Math.sin(since * 40) > 0 ? 0.55 : 0.05) : on ? 0.16 : 0;
      g.traverse((m) => {
        if (!m.isMesh || !m.material.emissive || m.userData.keepEmissive) return;
        m.material.emissive.copy(GLOW);
        m.material.emissiveIntensity = flash;
      });
    });

    const arcadeOn = this.hovered === 'arcade' || this.focused === 'arcade';
    this.parts.marquee.material.color.setScalar(arcadeOn && !this.reduceMotion ? (Math.sin(now / 60) > 0 ? 1 : 0.55) : 0.92 + Math.sin(now / 900) * 0.06);
    this.parts.marqueeGlow.material.opacity = (arcadeOn ? 0.55 : 0.25) + this.night * 0.4;

    const { stick, buttons } = this.parts.arcade;
    this.stickKick *= Math.exp(-dt * 7);
    stick.rotation.x = this.stickKick;
    buttons.forEach((b, i) => {
      this.presses[i] *= Math.exp(-dt * 10);
      b.position.y = b.userData.baseY - this.presses[i] * 0.014;
    });

    this.cat.update(dt, time);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    Object.entries(this.listeners).forEach(([type, fn]) => this.renderer.domElement.removeEventListener(type, fn));
    this.scene.traverse((o) => {
      if (!o.isMesh && !o.isSprite) return;
      o.geometry?.dispose();
      [].concat(o.material).forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
