(function (window) {
  'use strict';

  if (typeof THREE === 'undefined') return;

  var MODEL_URL = 'assets/robots/source/Shelly.fbx';
  var TEX_BASE = 'assets/robots/textures/';
  var cachedRoot = null;
  var cachedAnimations = [];
  var loadQueue = [];
  var isLoading = false;

  function applyFallbackMaterial(root) {
    root.traverse(function (child) {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = new THREE.MeshStandardMaterial({
        color: 0x8a95a8,
        metalness: 0.55,
        roughness: 0.42
      });
    });
  }

  function applyPBRMaterials(root) {
    applyFallbackMaterial(root);

    var loader = new THREE.TextureLoader();
    var textures = [
      { key: 'map', file: '1001_Base_color.png', srgb: true },
      { key: 'metalnessMap', file: '1001_Metallic.png' },
      { key: 'roughnessMap', file: '1001_Roughness.png' },
      { key: 'emissiveMap', file: '1001_Emissive.png', srgb: true, emissive: true }
    ];

    textures.forEach(function (entry) {
      loader.load(
        TEX_BASE + entry.file,
        function (tex) {
          if (entry.srgb && THREE.sRGBEncoding) {
            tex.encoding = THREE.sRGBEncoding;
          }
          root.traverse(function (child) {
            if (!child.isMesh || !child.material) return;
            child.material[entry.key] = tex;
            if (entry.emissive) {
              child.material.emissive = new THREE.Color(0xffffff);
              child.material.emissiveIntensity = 0.35;
            }
            if (entry.key === 'metalnessMap') child.material.metalness = 1;
            if (entry.key === 'roughnessMap') child.material.roughness = 1;
            child.material.needsUpdate = true;
          });
        },
        undefined,
        function (err) {
          console.warn('Texture failed:', entry.file, err);
        }
      );
    });
  }

  function normalizeModel(object, targetHeight) {
    var box = new THREE.Box3().setFromObject(object);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());

    object.position.sub(center);
    object.position.y += size.y * 0.5;

    var maxDim = Math.max(size.x, size.y, size.z) || 1;
    var scale = (targetHeight || 2) / maxDim;
    object.scale.setScalar(scale);

    return { size: size, scale: scale };
  }

  function setLoadingState(container, loading) {
    if (!container) return;
    container.classList.toggle('is-loading', loading);
    container.classList.toggle('is-loaded', !loading);
  }

  function hideLoader(container) {
    setLoadingState(container, false);
    var loaderEl = container.querySelector('.robot-preview-loader');
    if (!loaderEl && container.parentElement) {
      loaderEl = container.parentElement.querySelector('.robot-preview-loader');
    }
    if (loaderEl) loaderEl.classList.add('is-hidden');
  }

  function loadShelly(onReady, onError) {
    if (cachedRoot) {
      onReady(cachedRoot);
      return;
    }

    loadQueue.push({ onReady: onReady, onError: onError });
    if (isLoading) return;
    isLoading = true;

    if (typeof THREE.FBXLoader === 'undefined') {
      isLoading = false;
      var missingLoader = new Error('FBXLoader not available');
      loadQueue.forEach(function (item) {
        if (item.onError) item.onError(missingLoader);
      });
      loadQueue = [];
      return;
    }

    var fbxLoader = new THREE.FBXLoader();
    fbxLoader.load(
      MODEL_URL,
      function (object) {
        applyPBRMaterials(object);
        normalizeModel(object, 2.2);
        cachedRoot = object;
        cachedAnimations = object.animations ? object.animations.slice() : [];
        isLoading = false;

        var queue = loadQueue.slice();
        loadQueue = [];
        queue.forEach(function (item) {
          item.onReady(cachedRoot);
        });
      },
      undefined,
      function (err) {
        isLoading = false;
        loadQueue.forEach(function (item) {
          if (item.onError) item.onError(err);
        });
        loadQueue = [];
        console.error('Failed to load Shelly.fbx', err);
      }
    );
  }

  function cloneModel(source) {
    if (typeof THREE.SkeletonUtils !== 'undefined' && THREE.SkeletonUtils.clone) {
      return THREE.SkeletonUtils.clone(source);
    }
    return source.clone(true);
  }

  function createLights(scene, accent) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    var key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    scene.add(key);

    var fill = new THREE.DirectionalLight(0x8899ff, 0.45);
    fill.position.set(-5, 3, 2);
    scene.add(fill);

    var rim = new THREE.PointLight(accent || 0xe80368, 1.8, 24);
    rim.position.set(-3, 4, -3);
    scene.add(rim);

    var rim2 = new THREE.PointLight(0x00f0ff, 1.2, 20);
    rim2.position.set(3, 2, 4);
    scene.add(rim2);
  }

  function createViewer(container, options) {
    options = options || {};
    var mode = options.mode || 'hero';
    var accent = options.accent || 0xe80368;

    setLoadingState(container, true);

    var scene = new THREE.Scene();
    var width = container.clientWidth || 400;
    var height = container.clientHeight || (mode === 'hero' ? window.innerHeight : 280);

    var camera = new THREE.PerspectiveCamera(mode === 'hero' ? 42 : 38, width / height, 0.1, 100);
    camera.position.set(0, 1.35, mode === 'card' ? 3.8 : 5.2);
    camera.lookAt(0, 1.1, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.className = 'robot-webgl-canvas';
    container.appendChild(renderer.domElement);

    createLights(scene, accent);

    if (mode === 'hero') {
      var grid = new THREE.GridHelper(8, 24, accent, 0x333355);
      grid.position.y = 0.01;
      grid.material.opacity = 0.22;
      grid.material.transparent = true;
      scene.add(grid);

      var floor = new THREE.Mesh(
        new THREE.CircleGeometry(4, 64),
        new THREE.MeshStandardMaterial({
          color: 0x111528,
          metalness: 0.85,
          roughness: 0.45,
          transparent: true,
          opacity: 0.55
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    var robotGroup = new THREE.Group();
    scene.add(robotGroup);

    var mixer = null;
    var clock = new THREE.Clock();
    var mouseX = 0;
    var mouseY = 0;
    var running = true;
    var phaseOffset = options.phaseOffset || 0;
    var modelReady = false;

    function onPointerMove(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    if (mode === 'hero') {
      document.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerdown', onPointerMove, { passive: true });
    }

    loadShelly(
      function (source) {
        var model = cloneModel(source);
        if (mode === 'card') {
          model.scale.multiplyScalar(0.85);
        }
        robotGroup.add(model);
        modelReady = true;

        var clips = (model.animations && model.animations.length)
          ? model.animations
          : cachedAnimations;
        if (clips.length && (mode === 'hero' || mode === 'strip')) {
          mixer = new THREE.AnimationMixer(model);
          clips.forEach(function (clip) {
            mixer.clipAction(clip).play();
          });
        }

        hideLoader(container);
      },
      function () {
        setLoadingState(container, false);
        container.classList.add('is-error');
      }
    );

    function resize() {
      var w = container.clientWidth || width;
      var h = container.clientHeight || height;
      if (mode === 'hero') h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);

      var delta = clock.getDelta();
      var t = clock.elapsedTime + phaseOffset;
      if (mixer) mixer.update(delta);

      if (modelReady) {
        robotGroup.position.y = Math.sin(t * 1.4) * (mode === 'card' ? 0.04 : 0.07);

        if (mode === 'hero') {
          robotGroup.rotation.y = Math.sin(t * 0.45) * 0.18 + mouseX * 0.35;
          robotGroup.rotation.x = mouseY * 0.06;
          camera.position.x = mouseX * 0.35;
          camera.position.y = 1.35 + mouseY * 0.15;
          camera.lookAt(0, 1.05, 0);
        } else if (mode === 'strip') {
          robotGroup.rotation.y = t * 0.55;
        } else {
          robotGroup.rotation.y = t * 0.75;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    return {
      destroy: function () {
        running = false;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerdown', onPointerMove);
        window.removeEventListener('resize', resize);
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }

  window.MehwarRobotics = {
    loadShelly: loadShelly,
    initHero: function (selector) {
      var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) return null;
      return createViewer(el, { mode: 'hero' });
    },
    initStrip: function (selector) {
      var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) return null;
      return createViewer(el, { mode: 'strip' });
    },
    initPreviews: function (selector) {
      var nodes = document.querySelectorAll(selector);
      var viewers = [];
      nodes.forEach(function (node, index) {
        viewers.push(createViewer(node, { mode: 'card', phaseOffset: index * 1.7 }));
      });
      return viewers;
    }
  };
})(window);
