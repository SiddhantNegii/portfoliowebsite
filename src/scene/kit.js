import * as THREE from 'three';

export function createKit(scene) {
  const groups = {};

  const mat = (color, rough = 0.75, metal = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  const shade = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  const box = (w, h, d, color, rough, metal) => shade(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough, metal)));
  const cyl = (rt, rb, h, color, seg = 28, rough) => shade(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, rough)));
  const ball = (r, color, rough) => shade(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(color, rough)));
  const put = (parent, mesh, x, y, z) => {
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  const screen = (w, h, draw) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.round((1024 * h) / w);
    draw(canvas.getContext('2d'), canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  };

  const group = (key, x, y, z, ry = 0, options = {}) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = ry;
    g.userData = { key, baseY: y, lift: 0, hoverAt: 0, ...options };
    groups[key] = g;
    scene.add(g);
    return g;
  };

  const mono = (px, weight = 600) => `${weight} ${px}px "JetBrains Mono", Menlo, monospace`;
  const pixel = (px) => `${px}px "Press Start 2P", "JetBrains Mono", monospace`;
  const display = (px) => `800 ${px}px "Bricolage Grotesque", sans-serif`;

  return { THREE, groups, mat, box, cyl, ball, put, screen, group, fonts: { mono, pixel, display } };
}
