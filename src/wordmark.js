const svgNS = 'http://www.w3.org/2000/svg'
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const center = { x: 60, y: 60 }
const radius = 47
const meridians = [-165, -135, -105, -75, -45, -15, 15, 45, 75, 105, 135, 165]
const latitudes = [-70, -52, -34, -16, 0, 16, 34, 52, 70]

function createPath() {
  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('class', 'sphere-line')
  return path
}

function globePoint(lonDeg, latDeg, rotation) {
  const lon = (((lonDeg + rotation + 540) % 360) - 180) * Math.PI / 180
  const lat = latDeg * Math.PI / 180
  const x3 = Math.cos(lat) * Math.sin(lon)
  const y3 = Math.sin(lat)
  const z3 = Math.cos(lat) * Math.cos(lon)
  const perspective = 0.84 + z3 * 0.16

  return {
    visible: z3 >= -0.08,
    x: center.x + x3 * radius * perspective,
    y: center.y - y3 * radius * perspective,
  }
}

function linePath(points) {
  let d = ''
  let drawing = false

  for (const point of points) {
    if (!point.visible) {
      drawing = false
      continue
    }

    d += `${drawing ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    drawing = true
  }

  return d
}

function initSphere(svg) {
  const grid = svg.querySelector('[data-sphere-grid]')
  grid.replaceChildren()
  const paths = []

  for (const lon of meridians) {
    const path = createPath()
    grid.append(path)
    paths.push({ kind: 'meridian', lon, path })
  }

  for (const lat of latitudes) {
    const path = createPath()
    grid.append(path)
    paths.push({ kind: 'latitude', lat, path })
  }

  function render(now) {
    const rotation = prefersReduced ? 18 : now / 1000 * 82

    for (const item of paths) {
      const points = []

      if (item.kind === 'meridian') {
        for (let lat = -82; lat <= 82; lat += 4) {
          points.push(globePoint(item.lon, lat, rotation))
        }
      } else {
        for (let lon = -180; lon <= 180; lon += 4) {
          points.push(globePoint(lon, item.lat, rotation))
        }
      }

      item.path.setAttribute('d', linePath(points))
    }

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

for (const globe of document.querySelectorAll('[data-sphere-globe]')) {
  initSphere(globe)
}
