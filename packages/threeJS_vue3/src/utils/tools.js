import * as THREE from 'three'
const threeTools = {}
/**
 *
 * @param {Event} clickEvent
 * @returns {THREE.Vector2} {x, y}
 */
threeTools.transformClick = clickEvent => {
  const { offsetX, offsetY, target } = clickEvent
  const width = target.clientWidth
  const height = target.clientHeight
  const result = {
    x: (offsetX / width) * 2 - 1,
    y: -(offsetY / height) * 2 + 1
  }
  return new THREE.Vector2(result.x, result.y)
}
threeTools.rectAreaLightHelper = planeLight => {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide
    })
  )
  mesh.scale.x = planeLight.width
  mesh.scale.y = planeLight.height
  planeLight.add(mesh)
}
export default threeTools
