const svgNS = 'http://www.w3.org/2000/svg'
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const center = { x: 60, y: 60 }
const radius = 47
const meridians = [-165, -135, -105, -75, -45, -15, 15, 45, 75, 105, 135, 165]
const latitudes = [-62, -40, -20, 0, 20, 40, 62]
const meridianVisibilityFloor = -0.08
const latitudeVisibilityFloor = 0.18

function createPath() {
  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('class', 'sphere-line')
  return path
}

function globePoint(lonDeg, latDeg, rotation, visibilityFloor = meridianVisibilityFloor) {
  const lon = (((lonDeg + rotation + 540) % 360) - 180) * Math.PI / 180
  const lat = latDeg * Math.PI / 180
  const x3 = Math.cos(lat) * Math.sin(lon)
  const y3 = Math.sin(lat)
  const z3 = Math.cos(lat) * Math.cos(lon)
  const perspective = 0.84 + z3 * 0.16

  return {
    visible: z3 >= visibilityFloor,
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
          points.push(globePoint(lon, item.lat, rotation, latitudeVisibilityFloor))
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

function centerLogoRows() {
  const svg = document.querySelector('.logo-svg')
  if (!svg) return

  const targetCenter = svg.viewBox.baseVal.x + svg.viewBox.baseVal.width / 2
  const rows = svg.querySelectorAll('.logo-line-vision, .logo-line-without, .logo-line-borders')

  for (const row of rows) {
    row.removeAttribute('transform')
    const box = row.getBBox()
    const rowCenter = box.x + box.width / 2
    row.setAttribute('transform', `translate(${(targetCenter - rowCenter).toFixed(2)} 0)`)
  }
}

function alignGlobeToBordersText() {
  const svg = document.querySelector('.logo-svg')
  const globe = document.querySelector('.logo-globe')
  const borders = document.querySelector('.logo-line-borders')
  if (!svg || !globe || !borders) return

  const borderTexts = borders.querySelectorAll('text')
  if (borderTexts.length < 2) return

  if (!globe.dataset.baseTransform) {
    globe.dataset.baseTransform = globe.getAttribute('transform') || ''
  }

  globe.setAttribute('transform', globe.dataset.baseTransform)

  const svgRect = svg.getBoundingClientRect()
  const textRects = Array.from(borderTexts, (text) => text.getBoundingClientRect())
  const textTop = Math.min(...textRects.map((rect) => rect.top))
  const textBottom = Math.max(...textRects.map((rect) => rect.bottom))
  const textCenter = textTop + (textBottom - textTop) / 2
  const globeRect = globe.getBoundingClientRect()
  const globeCenter = globeRect.top + globeRect.height / 2
  const svgUnitsPerPixel = svg.viewBox.baseVal.height / svgRect.height
  const dy = (textCenter - globeCenter) * svgUnitsPerPixel
  const match = globe.dataset.baseTransform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)\s+scale\(([-\d.]+)\)/)

  if (!match) return

  const [, x, y, scale] = match
  globe.setAttribute('transform', `translate(${x} ${(Number(y) + dy).toFixed(2)}) scale(${scale})`)
}

requestAnimationFrame(() => {
  alignGlobeToBordersText()
  centerLogoRows()
  window.setTimeout(() => {
    alignGlobeToBordersText()
    centerLogoRows()
  }, 120)
})

window.addEventListener('resize', () => {
  alignGlobeToBordersText()
  centerLogoRows()
})

const blinkTransition = document.querySelector('.blink-transition')
const siteHeader = document.querySelector('.site-header')
const menuToggle = document.querySelector('.menu-toggle')
let transitionActive = false

function setMenuOpen(isOpen) {
  if (!siteHeader || !menuToggle) return

  siteHeader.classList.toggle('is-menu-open', isOpen)
  menuToggle.setAttribute('aria-expanded', String(isOpen))
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation')
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true')
})

function scrollWithBlink(target) {
  if (!blinkTransition || prefersReduced || transitionActive) {
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
    return
  }

  transitionActive = true
  blinkTransition.classList.add('is-active')

  window.setTimeout(() => {
    target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, 360)

  window.setTimeout(() => {
    blinkTransition.classList.remove('is-active')
    transitionActive = false
  }, 820)
}

for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href')
    if (!id || id === '#') return

    const target = document.querySelector(id)
    if (!target) return

    event.preventDefault()
    history.pushState(null, '', id)
    setMenuOpen(false)
    scrollWithBlink(target)
  })
}
