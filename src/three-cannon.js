import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import cannon from 'cannon'
window.CANNON = cannon
const { CannonPhysics } = require('three/examples/jsm/physics/CannonPhysics')

let camera, scene, renderer
let physics, position

init()
animate()

function init() {
  physics = new CannonPhysics()
  position = new THREE.Vector3()

  //

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  )
  camera.position.set(-1, 1, 2)
  camera.lookAt(0, 0, 0)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x666666)

  const light = new THREE.HemisphereLight()
  light.intensity = 0.35
  scene.add(light)

  const light1 = new THREE.DirectionalLight()
  light1.position.set(5, 5, 5)
  light1.castShadow = true
  light1.shadow.camera.zoom = 2
  scene.add(light1)

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    new THREE.ShadowMaterial({ color: 0x111111 }),
  )
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)
  physics.addMesh(plane)

  /*
				function getSize() {
					return Math.random() * 0.1 + 0.05;
				}
				*/

  const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
  const material = new THREE.MeshLambertMaterial(/* { vertexColors: true } */)
  const mesh = new THREE.InstancedMesh(geometry, material, 200)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)

  const matrix = new THREE.Matrix4()

  for (let i = 0; i < mesh.count; i++) {
    matrix.setPosition(
      Math.random() - 0.5,
      Math.random() * 2,
      Math.random() - 0.5,
    )
    mesh.setMatrixAt(i, matrix)
  }

  /*
				var instanceColors = [];
				for ( var i = 0; i < mesh.count; i ++ ) {
					instanceColors.push( Math.random(), Math.random(), Math.random() );
				}
				mesh.geometry.setAttribute( 'instanceColor', new THREE.InstancedBufferAttribute( new Float32Array( instanceColors ), 3 ) );
				*/

  physics.addMesh(mesh, 1)

  //

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.outputEncoding = THREE.sRGBEncoding
  document.body.appendChild(renderer.domElement)

  //

  const controls = new OrbitControls(camera, renderer.domElement)
  console.log({ controls })
}

function animate() {
  requestAnimationFrame(animate)

  const mesh = scene.children[3]
  const index = Math.floor(Math.random() * mesh.count)

  position.set(0, Math.random() * 2, 0)
  physics.setMeshPosition(mesh, position, index)

  renderer.render(scene, camera)
}
