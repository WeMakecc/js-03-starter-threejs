import Stats from 'stats.js'
import { getGPUTier } from 'detect-gpu'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// see here: https://threejs.org/docs/#manual/en/introduction/Import-via-modules
console.log({ OrbitControls })

let sceneInstance = null

class MainScene {
  renderer = null
  stats = null
  camera = null
  scene = null
  constrols = null

  mesh = null

  constructor(canvas) {
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    const aspectRatio = window.innerWidth / window.innerHeight
    this.camera = new THREE.PerspectiveCamera(70, aspectRatio, 1, 1000)
    this.camera.position.z = 400

    this.scene = new THREE.Scene()

    this.mesh = initMesh()
    this.scene.add(this.mesh)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      canvas,
    })
    this.renderer.setClearColor(new THREE.Color('#333'))
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    const gpu = getGPUTier({ glContext: this.renderer.getContext() })
    console.log('💻 gpu:', {
      name: gpu.type,
      tier: Number(gpu.tier.slice(-1)),
      isMobile: gpu.tier.toLowerCase().includes('mobile'),
    })

    this.animate()
  }

  animate = () => {
    requestAnimationFrame(this.animate)

    this.mesh.rotation.x += 0.005
    this.mesh.rotation.y += 0.01

    this.renderer.render(this.scene, this.camera)
  }
}

export function sceneThree(canvas) {
  sceneInstance = new MainScene(canvas)
  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize() {
  sceneInstance.camera.aspect = window.innerWidth / window.innerHeight
  sceneInstance.camera.updateProjectionMatrix()
  sceneInstance.renderer.setSize(window.innerWidth, window.innerHeight)
}

function initMesh() {
  const texture = new THREE.TextureLoader().load('crate.gif')
  const geometry = new THREE.BoxBufferGeometry(200, 200, 200)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  })
  return new THREE.Mesh(geometry, material)
}
