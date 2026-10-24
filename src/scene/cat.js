import * as THREE from 'three';
import { sound } from '../sound.js';

const BLACK = 0x18171c;
const WHITE = 0xf4f2ee;
const SPEED = 0.42;
const NAP_SECONDS = 9;
const TAIL = 16;

const floor = (x, z) => new THREE.Vector3(x, 0, z);
const ROUTE = [floor(0.8, 1.4), floor(1.0, 0.6), floor(2.0, 0.5), floor(1.0, 0.6), floor(0.8, 1.4), floor(-0.3, 1.6), floor(-1.75, 2.1), 'nap', floor(-1.75, 2.1), floor(-0.3, 1.6)];

function spriteTexture(draw) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  draw(canvas.getContext('2d'));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
const HEART = spriteTexture((x) => {
  x.fillStyle = '#ff2e88';
  x.beginPath();
  x.moveTo(32, 54);
  x.bezierCurveTo(4, 34, 10, 8, 32, 22);
  x.bezierCurveTo(54, 8, 60, 34, 32, 54);
  x.fill();
});
const ZZZ = spriteTexture((x) => {
  x.fillStyle = '#55525e';
  x.font = '800 44px "JetBrains Mono", monospace';
  x.textAlign = 'center';
  x.fillText('z', 32, 46);
});

export class Cat {
  constructor(kit, napSpot, napHeading) {
    const { box, cyl, ball, put, group } = kit;
    this.napSpot = napSpot;
    this.napHeading = napHeading;
    this.root = group('cat', ROUTE[0].x, 0, ROUTE[0].z, 0, { noLift: true });
    this.scene = this.root.parent;
    this.body = new THREE.Group();
    this.root.add(this.body);

    const torso = ball(0.12, BLACK, 0.85);
    torso.scale.set(0.9, 0.85, 1.6);
    put(this.body, torso, 0, 0.17, 0);
    const chest = ball(0.09, WHITE, 0.85);
    chest.scale.set(0.8, 0.95, 0.6);
    put(this.body, chest, 0, 0.16, 0.13);

    this.head = new THREE.Group();
    this.head.position.set(0, 0.29, 0.2);
    this.body.add(this.head);
    put(this.head, ball(0.095, BLACK, 0.85), 0, 0, 0);
    const muzzle = ball(0.05, WHITE, 0.85);
    muzzle.scale.set(1, 0.72, 0.8);
    put(this.head, muzzle, 0, -0.03, 0.075);
    const blaze = ball(0.03, WHITE, 0.85);
    blaze.scale.set(0.45, 1.3, 0.4);
    put(this.head, blaze, 0, 0.02, 0.083);
    put(this.head, ball(0.012, 0xf29bb0, 0.6), 0, -0.012, 0.11);
    [-1, 1].forEach((side) => {
      const ear = cyl(0, 0.04, 0.075, BLACK, 4, 0.85);
      ear.rotation.z = -side * 0.3;
      put(this.head, ear, side * 0.055, 0.085, -0.01);
      const inner = cyl(0, 0.022, 0.045, 0xf29bb0, 4, 0.8);
      inner.rotation.z = -side * 0.3;
      put(this.head, inner, side * 0.05, 0.08, 0.008);
    });
    this.eyeMat = new THREE.MeshStandardMaterial({ color: 0xc8e64b, roughness: 0.3, emissive: 0xd8ff5a, emissiveIntensity: 0 });
    [-1, 1].forEach((side) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), this.eyeMat);
      eye.userData.keepEmissive = true;
      put(this.head, eye, side * 0.036, 0.012, 0.082);
    });

    this.legs = [];
    [[-0.06, 0.11], [0.06, 0.11], [-0.06, -0.11], [0.06, -0.11]].forEach(([x, z], i) => {
      const leg = new THREE.Group();
      leg.position.set(x, 0.13, z);
      put(leg, cyl(0.022, 0.022, 0.09, BLACK, 10, 0.85), 0, -0.04, 0);
      put(leg, cyl(0.023, 0.025, 0.045, WHITE, 10, 0.85), 0, -0.105, 0);
      leg.userData.phase = i === 0 || i === 3 ? 0 : Math.PI;
      this.body.add(leg);
      this.legs.push(leg);
    });

    this.tail = [];
    for (let k = 0; k < TAIL; k++) {
      const segment = ball(0.024 - k * 0.0006, BLACK, 0.85);
      this.body.add(segment);
      this.tail.push(segment);
    }

    this.particles = [];
    this.index = 1;
    this.mode = 'pause';
    this.timer = 1.2;
    this.heading = 0;
    this.night = 0;
    this.lastZ = 0;
    this.squash = 0;
    this.nextMeow = 10 + Math.random() * 10;
    this.snores = 0;
    this.holdTarget = new THREE.Vector3();
    this.surfaceAt = () => 0;
  }

  pet() {
    if (['jump', 'purr', 'held', 'fall'].includes(this.mode)) return;
    this.resume = { mode: this.mode, timer: this.timer };
    this.mode = 'purr';
    this.timer = 2.4;
    sound.play('pet');
    for (let i = 0; i < 4; i++) setTimeout(() => this.emit(HEART, 0.09), i * 220);
  }

  emit(texture, size) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.scale.setScalar(size);
    const p = this.root.position;
    sprite.position.set(p.x + (Math.random() - 0.5) * 0.12, p.y + 0.42, p.z + (Math.random() - 0.5) * 0.12);
    this.scene.add(sprite);
    this.particles.push({ sprite, life: 1.4 });
  }

  jumpTo(target, landing) {
    this.mode = 'jump';
    this.jump = { from: this.root.position.clone(), to: target.clone(), t: 0, landing };
  }

  advance() {
    this.index = (this.index + 1) % ROUTE.length;
  }

  nearestStop() {
    const { x, z } = this.root.position;
    let best = 0;
    ROUTE.forEach((p, i) => {
      if (p !== 'nap' && Math.hypot(p.x - x, p.z - z) < Math.hypot(ROUTE[best].x - x, ROUTE[best].z - z)) best = i;
    });
    return best;
  }

  grab(point) {
    this.mode = 'held';
    this.resume = null;
    this.holdTarget.copy(point);
    sound.play('pickup');
  }

  holdAt(point) {
    this.holdTarget.copy(point);
  }

  drop() {
    if (this.mode !== 'held') return;
    this.mode = 'fall';
    this.vy = 0;
    this.groundY = this.surfaceAt(this.holdTarget.x, this.holdTarget.z);
  }

  update(dt, time) {
    const pos = this.root.position;
    let walking = false;

    switch (this.mode) {
      case 'walk': {
        const target = ROUTE[this.index];
        const dx = target.x - pos.x;
        const dz = target.z - pos.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.03) {
          this.advance();
          this.mode = 'pause';
          this.timer = 0.8 + Math.random() * 1.6;
        } else {
          const step = Math.min(dist, SPEED * dt);
          pos.x += (dx / dist) * step;
          pos.z += (dz / dist) * step;
          this.heading = Math.atan2(dx, dz);
          walking = true;
        }
        break;
      }
      case 'pause':
        this.timer -= dt;
        if (this.timer <= 0) {
          const next = ROUTE[this.index];
          if (next === 'nap') this.jumpTo(this.napSpot, 'nap');
          else this.mode = 'walk';
        }
        break;
      case 'jump': {
        const j = this.jump;
        j.t = Math.min(1, j.t + dt / 0.55);
        pos.lerpVectors(j.from, j.to, j.t);
        pos.y += Math.sin(j.t * Math.PI) * 0.35;
        this.heading = Math.atan2(j.to.x - j.from.x, j.to.z - j.from.z);
        if (j.t === 1) {
          if (j.landing === 'nap') {
            this.mode = 'nap';
            this.timer = NAP_SECONDS;
            this.heading = this.napHeading;
            sound.play('yawn');
          } else {
            this.advance();
            this.mode = 'pause';
            this.timer = 1;
          }
        }
        break;
      }
      case 'nap':
        this.timer -= dt;
        if (time - this.lastZ > 1.3) {
          this.lastZ = time;
          this.emit(ZZZ, 0.08);
          if (this.snores++ % 2) sound.play('snore');
        }
        if (this.timer <= 0) {
          this.advance();
          this.jumpTo(ROUTE[this.index], 'floor');
        }
        break;
      case 'purr':
        this.timer -= dt;
        if (this.timer <= 0) Object.assign(this, this.resume);
        break;
      case 'held':
        this.root.rotation.z += (THREE.MathUtils.clamp((this.holdTarget.x - pos.x) * 4, -0.5, 0.5) - this.root.rotation.z) * Math.min(1, dt * 10);
        pos.lerp(this.holdTarget, Math.min(1, dt * 14));
        break;
      case 'fall':
        this.vy -= 9.8 * dt;
        pos.y += this.vy * dt;
        pos.x += (this.holdTarget.x - pos.x) * Math.min(1, dt * 14);
        pos.z += (this.holdTarget.z - pos.z) * Math.min(1, dt * 14);
        if (pos.y <= this.groundY) {
          pos.set(this.holdTarget.x, this.groundY, this.holdTarget.z);
          this.squash = 1;
          sound.play('drop');
          setTimeout(() => sound.play('landed'), 260);
          if (this.groundY > 0.08) {
            this.mode = 'perch';
            this.timer = 2.5 + Math.random() * 2;
          } else {
            this.index = this.nearestStop();
            this.mode = 'pause';
            this.timer = 1.2;
          }
        }
        break;
      case 'perch':
        this.timer -= dt;
        if (this.timer <= 0) {
          this.index = this.nearestStop();
          this.jumpTo(ROUTE[this.index], 'floor');
        }
        break;
      default:
        break;
    }

    const napping = this.mode === 'nap' || (this.mode === 'purr' && this.resume?.mode === 'nap');
    if (['walk', 'pause', 'perch'].includes(this.mode)) {
      this.nextMeow -= dt;
      if (this.nextMeow <= 0) {
        this.nextMeow = 18 + Math.random() * 22;
        sound.play('meow');
      }
    }
    const held = this.mode === 'held';
    this.squash *= Math.exp(-dt * 6);
    this.body.rotation.x += ((held ? -1.15 : 0) - this.body.rotation.x) * Math.min(1, dt * 10);
    if (!held) this.root.rotation.z *= Math.exp(-dt * 8);
    let turn = this.heading - this.root.rotation.y;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    this.root.rotation.y += turn * Math.min(1, dt * 8);

    this.body.scale.y += ((napping ? 0.62 : 1) - this.squash * 0.4 - this.body.scale.y) * Math.min(1, dt * 12);
    this.body.scale.x += ((napping ? 1.15 : 1) - this.body.scale.x) * Math.min(1, dt * 6);
    this.body.position.y = walking ? Math.abs(Math.sin(time * 10)) * 0.012 : 0;
    this.head.rotation.x = held ? 0.9 : napping ? 0.5 : this.mode === 'purr' ? -0.25 : Math.sin(time * 0.7) * 0.06;
    this.legs.forEach((leg) => {
      leg.visible = !napping;
      leg.rotation.x = walking ? Math.sin(time * 11 + leg.userData.phase) * 0.55 : held ? Math.sin(time * 16 + leg.userData.phase) * 0.5 : 0;
    });

    const wag = this.mode === 'purr' ? 7 : held ? 9 : walking ? 4 : 2;
    this.tail.forEach((segment, k) => {
      const t = k / (TAIL - 1);
      const sway = Math.sin(time * wag - t * 2.5) * t * 0.05;
      if (napping) {
        const a = t * 2.6;
        segment.position.set(Math.sin(a) * 0.16 + sway * 0.3, 0.07, -0.05 - Math.cos(a) * 0.16);
      } else {
        segment.position.set(sway, 0.19 + Math.sin(t * Math.PI * 0.5) * 0.22, -0.17 - Math.sin(t * Math.PI) * 0.06 + t * 0.02);
      }
    });

    this.eyeMat.emissiveIntensity = napping ? 0 : this.night * 1.4;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.sprite.position.y += dt * 0.32;
      p.sprite.position.x += Math.sin(time * 4 + i) * dt * 0.05;
      p.sprite.material.opacity = Math.min(1, p.life);
      if (p.life <= 0) {
        this.scene.remove(p.sprite);
        p.sprite.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }
}
