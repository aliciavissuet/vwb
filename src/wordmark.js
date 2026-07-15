const svgNS = 'http://www.w3.org/2000/svg'
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const center = { x: 60, y: 60 }
const radius = 45
const meridians = [
  { phase: 0 },
  { phase: 1 / 7 },
  { phase: 2 / 7 },
  { phase: 3 / 7 },
  { phase: 4 / 7 },
  { phase: 5 / 7 },
  { phase: 6 / 7 },
]
const latitudes = [
  { startX: 24, y: 37, controlY: 32, endX: 96 },
  { startX: 19, y: 49, controlY: 46, endX: 101 },
  { startX: 17, y: 60, controlY: 60, endX: 103 },
  { startX: 19, y: 71, controlY: 74, endX: 101 },
  { startX: 24, y: 83, controlY: 88, endX: 96 },
]
const sphereInstances = []

function createCircle() {
  const circle = document.createElementNS(svgNS, 'circle')
  circle.setAttribute('class', 'sphere-outline')
  circle.setAttribute('cx', center.x)
  circle.setAttribute('cy', center.y)
  circle.setAttribute('r', radius)
  return circle
}

function createPath() {
  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('class', 'sphere-line')
  return path
}

function initSphere(svg) {
  const grid = svg.querySelector('[data-sphere-grid]')
  if (!grid) return

  grid.replaceChildren()
  const instanceMeridians = meridians.map((meridian) => ({ ...meridian }))
  const speed = Number(svg.dataset.sphereSpeed || 0.115)

  const latitudePaths = latitudes.map((latitude) => {
    const path = createPath()
    path.classList.add('sphere-latitude')
    path.setAttribute('d', latitudePath(latitude))
    grid.append(path)
    return { path, latitude }
  })

  for (const meridian of instanceMeridians) {
    const path = createPath()
    path.classList.add('sphere-meridian')
    path.setAttribute('d', meridianPath(center.x))
    path.style.opacity = '0.58'
    grid.append(path)
    meridian.path = path
  }

  for (const { path } of latitudePaths) {
    grid.append(path)
  }

  grid.append(createCircle())

  const initialOffset = Number(svg.dataset.sphereOffset || 0)
  const instance = {
    meridians: instanceMeridians,
    speed,
    offset: initialOffset,
    targetOffset: initialOffset,
    interactive: svg.dataset.sphereMode === 'interactive',
  }

  svg.sphereInstance = instance
  sphereInstances.push(instance)
  renderSphereInstance(instance, 0)
}

function meridianPath(controlX) {
  const rounded = controlX.toFixed(2)
  const upperY = Math.abs(controlX - center.x) > 38 ? 36 : 33
  const lowerY = Math.abs(controlX - center.x) > 38 ? 84 : 87
  return `M60 16C${rounded} ${upperY} ${rounded} ${lowerY} 60 104`
}

function latitudePath(latitude, offset = 0) {
  if (latitude.y === 60) {
    return `M${latitude.startX} ${latitude.y + offset}H${latitude.endX}`
  }

  const y = latitude.y + offset
  const controlY = latitude.controlY + offset * 1.7
  return `M${latitude.startX} ${y.toFixed(2)}C42 ${controlY.toFixed(2)} 78 ${controlY.toFixed(2)} ${latitude.endX} ${y.toFixed(2)}`
}

function edgeFade(position) {
  const leftFade = smoothstep(-1, -0.82, position)
  const rightFade = 1 - smoothstep(0.82, 1, position)
  return Math.min(leftFade, rightFade)
}

function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function animateSphere(now) {
  const time = now / 1000

  for (const instance of sphereInstances) {
    renderSphereInstance(instance, time)
  }

  requestAnimationFrame(animateSphere)
}

function renderSphereInstance(instance, time) {
  if (instance.interactive) {
    const distance = instance.targetOffset - instance.offset
    instance.offset = prefersReduced ? instance.targetOffset : instance.offset + distance * 0.085
  }

  const rotation = instance.interactive ? instance.offset : time * instance.speed

  for (const meridian of instance.meridians) {
    const rawProgress = rotation + meridian.phase
    const progress = ((rawProgress % 1) + 1) % 1
    const position = progress * 2 - 1
    const controlX = center.x + position * 56
    meridian.path.setAttribute('d', meridianPath(controlX))
    meridian.path.style.opacity = (edgeFade(position) * 0.64).toFixed(2)
  }
}

for (const globe of document.querySelectorAll('[data-sphere-globe]')) {
  initSphere(globe)
}

if (sphereInstances.length && !prefersReduced) {
  requestAnimationFrame(animateSphere)
}

function centerLogoRows() {
  const svg = document.querySelector('.logo-svg')
  if (!svg) return

  const targetCenter = svg.viewBox.baseVal.x + svg.viewBox.baseVal.width / 2
  const opticalOffsets = new Map([
    ['logo-line-without', 18],
  ])
  const rows = svg.querySelectorAll('.logo-line-vision, .logo-line-without, .logo-line-borders')

  for (const row of rows) {
    row.removeAttribute('transform')
    const box = row.getBBox()
    const rowCenter = box.x + box.width / 2
    const offset = Array.from(row.classList).reduce((value, className) => value + (opticalOffsets.get(className) || 0), 0)
    row.setAttribute('transform', `translate(${(targetCenter - rowCenter + offset).toFixed(2)} 0)`)
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

function ensureBlinkTransition() {
  const existingTransition = document.querySelector('.blink-transition')
  if (existingTransition) return existingTransition

  const transition = document.createElement('div')
  transition.className = 'blink-transition'
  transition.setAttribute('aria-hidden', 'true')

  const topLid = document.createElement('div')
  topLid.className = 'blink-lid blink-lid-top'
  const bottomLid = document.createElement('div')
  bottomLid.className = 'blink-lid blink-lid-bottom'

  transition.append(topLid, bottomLid)
  document.body.append(transition)
  return transition
}

const blinkTransition = ensureBlinkTransition()
const siteHeader = document.querySelector('.site-header')
const menuToggle = document.querySelector('.menu-toggle')
const introLoader = document.querySelector('.intro-loader')
let transitionActive = false

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return
  transitionActive = false
  blinkTransition.classList.remove('is-active', 'is-closing', 'is-opening')
  document.documentElement.classList.remove('page-entering')
})

if (
  introLoader &&
  (document.documentElement.classList.contains('show-intro') ||
    document.body.classList.contains('show-intro'))
) {
  window.setTimeout(() => {
    document.documentElement.classList.remove('show-intro')
    document.body.classList.remove('show-intro')
  }, 4750)
}

const isBlinkEntering = document.documentElement.classList.contains('page-entering')

try {
  window.sessionStorage.setItem('vwb-site-seen', 'true')
  if (!isBlinkEntering) window.sessionStorage.removeItem('vwb-blink-enter')
} catch {
  // Navigation still works when session storage is unavailable.
}

if (isBlinkEntering) {
  transitionActive = true
  blinkTransition.classList.add('is-opening')

  let hasRevealedIncomingPage = false
  const revealIncomingPage = () => {
    if (hasRevealedIncomingPage) return
    hasRevealedIncomingPage = true
    blinkTransition.classList.remove('is-opening')
    document.documentElement.classList.remove('page-entering')
    transitionActive = false
    try {
      window.sessionStorage.removeItem('vwb-blink-enter')
    } catch {
      // The page can still reveal when storage is unavailable.
    }
  }

  blinkTransition.querySelector('.blink-lid-top')?.addEventListener('animationend', revealIncomingPage, { once: true })
  window.setTimeout(revealIncomingPage, 700)
}

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

function navigateWithBlink(url) {
  if (!blinkTransition || prefersReduced || transitionActive) {
    window.location.assign(url)
    return
  }

  transitionActive = true
  blinkTransition.classList.add('is-closing')

  try {
    window.sessionStorage.setItem('vwb-blink-enter', 'true')
  } catch {
    // The close-only transition still prevents the outgoing page from flashing.
  }

  let hasNavigated = false
  const finishNavigation = () => {
    if (hasNavigated) return
    hasNavigated = true
    window.location.assign(url)
  }

  const topLid = blinkTransition.querySelector('.blink-lid-top')
  topLid?.addEventListener('animationend', finishNavigation, { once: true })
  window.setTimeout(finishNavigation, 650)
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

for (const link of document.querySelectorAll('a[href]')) {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href')
    if (
      !href ||
      href.startsWith('#') ||
      link.hasAttribute('download') ||
      link.target === '_blank' ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return

    if (url.pathname === '/' && !url.searchParams.has('skipIntro')) {
      url.searchParams.set('skipIntro', '1')
    }

    if (url.href === window.location.href) return

    event.preventDefault()
    setMenuOpen(false)
    navigateWithBlink(url.href)
  })
}

const lineTargets = document.querySelectorAll(
  '.bidirectional-model, .process-cycle, .mission-principle, .mission-narrative, .mission-field-image, .content-grid article, .publication-list article, .founder-bio, .founder-quote-bubble, .association-block, .press-list article, .news-card, .news-link-grid article, .research-list article',
)

if (lineTargets.length) {
  if (prefersReduced || !('IntersectionObserver' in window)) {
    for (const target of lineTargets) {
      target.classList.add('is-line-visible')
    }
  } else {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          entry.target.classList.add('is-line-visible')
          lineObserver.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -14% 0px', threshold: 0.26 },
    )

    for (const target of lineTargets) {
      lineObserver.observe(target)
    }
  }
}

for (const processCycle of document.querySelectorAll('.process-cycle')) {
  const steps = Array.from(processCycle.querySelectorAll('[data-cycle-step]'))
  const visualSteps = Array.from(processCycle.querySelectorAll('[data-cycle-visual-step]'))
  const details = Array.from(processCycle.querySelectorAll('[data-cycle-detail]'))

  const setActiveCycleStep = (stepName) => {
    for (const step of steps) {
      step.setAttribute('aria-pressed', String(step.dataset.cycleStep === stepName))
    }

    for (const detail of details) {
      detail.classList.toggle('is-cycle-active', detail.dataset.cycleDetail === stepName)
    }

    for (const visualStep of visualSteps) {
      visualStep.classList.toggle('is-cycle-active', visualStep.dataset.cycleVisualStep === stepName)
    }
  }

  for (const step of steps) {
    const activate = () => setActiveCycleStep(step.dataset.cycleStep)
    step.addEventListener('mouseenter', activate)
    step.addEventListener('focus', activate)
    step.addEventListener('click', activate)
  }

  for (const visualStep of visualSteps) {
    const activate = () => setActiveCycleStep(visualStep.dataset.cycleVisualStep)
    visualStep.addEventListener('mouseenter', activate)
    visualStep.addEventListener('click', activate)
  }

  processCycle.querySelector('.cycle-wheel')?.addEventListener('mouseleave', () => {
    if (!processCycle.matches(':focus-within')) setActiveCycleStep(null)
  })

  processCycle.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!processCycle.matches(':focus-within')) setActiveCycleStep(null)
    })
  })
}

for (const storyRail of document.querySelectorAll('[data-infinite-story-rail]')) {
  const originalCards = Array.from(storyRail.children)
  if (originalCards.length < 2) continue

  const cloneCard = (card) => {
    const clone = card.cloneNode(true)
    clone.dataset.infiniteClone = ''
    clone.setAttribute('aria-hidden', 'true')
    clone.inert = true
    for (const focusable of clone.querySelectorAll('a, button, input, select, textarea, [tabindex]')) {
      focusable.setAttribute('tabindex', '-1')
    }
    return clone
  }

  const leadingCards = originalCards.map(cloneCard)
  const trailingCards = originalCards.map(cloneCard)
  storyRail.prepend(...leadingCards)
  storyRail.append(...trailingCards)

  let cycleWidth = 0
  let middleStart = 0
  let resizeFrame = null

  const measureStoryRail = () => {
    const paddingStart = Number.parseFloat(window.getComputedStyle(storyRail).paddingInlineStart) || 0
    middleStart = originalCards[0].offsetLeft - paddingStart
    cycleWidth = originalCards[0].offsetLeft - leadingCards[0].offsetLeft
    storyRail.scrollLeft = middleStart
  }

  const keepStoryRailInfinite = () => {
    if (!cycleWidth) return
    const distanceFromMiddle = storyRail.scrollLeft - middleStart

    if (distanceFromMiddle < cycleWidth * -0.55) {
      storyRail.scrollLeft += cycleWidth
    } else if (distanceFromMiddle > cycleWidth * 0.55) {
      storyRail.scrollLeft -= cycleWidth
    }
  }

  storyRail.addEventListener('scroll', keepStoryRailInfinite, { passive: true })
  window.addEventListener('resize', () => {
    if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame)
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null
      measureStoryRail()
    })
  })

  window.requestAnimationFrame(measureStoryRail)
  window.addEventListener('load', measureStoryRail, { once: true })
}

const timelineStream = document.querySelector('[data-timeline-stream]')

if (timelineStream) {
  const timelineEntries = Array.from(timelineStream.querySelectorAll('[data-timeline-entry]'))
  const timelineProgress = timelineStream.querySelector('[data-timeline-progress]')
  const timelineLinks = Array.from(document.querySelectorAll('[data-timeline-link]'))
  const timelinePhaseLinks = Array.from(document.querySelectorAll('[data-timeline-phase-link]'))
  const timelineYears = Array.from(document.querySelectorAll('[data-timeline-nav-year]'))
  const timelineNavigator = document.querySelector('.timeline-navigator')
  const timelineGlobeCard = document.querySelector('[data-timeline-globe-card]')
  const timelineGlobePins = Array.from(document.querySelectorAll('[data-timeline-globe-pin]'))
  const timelineGlobeLocation = document.querySelector('[data-timeline-globe-location]')
  let activeTimelineEntry = null
  let timelineFrame = null
  let timelineNavigatorManualUntil = 0

  const isDesktopTimelineNavigator = () => window.matchMedia('(min-width: 821px)').matches

  const followActiveTimelineYear = (activeYear) => {
    if (!timelineNavigator || !activeYear || !isDesktopTimelineNavigator()) return
    if (window.performance.now() < timelineNavigatorManualUntil) return

    const navigatorRect = timelineNavigator.getBoundingClientRect()
    const yearRect = activeYear.getBoundingClientRect()
    const targetTop =
      timelineNavigator.scrollTop +
      yearRect.top -
      navigatorRect.top -
      (timelineNavigator.clientHeight - activeYear.offsetHeight) / 2
    timelineNavigator.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
  }

  const setActiveTimelineEntry = (entry) => {
    if (!entry || entry === activeTimelineEntry) return
    activeTimelineEntry = entry

    for (const item of timelineEntries) {
      item.classList.toggle('is-timeline-active', item === entry)
    }

    for (const link of timelineLinks) {
      const isActive = link.dataset.timelineLink === entry.id
      link.classList.toggle('is-active', isActive)
      if (isActive) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    }

    const activePhase = entry.closest('.timeline-phase')?.id
    for (const link of timelinePhaseLinks) {
      const isActive = link.dataset.timelinePhaseLink === activePhase
      link.classList.toggle('is-current', isActive)
      link.closest('.timeline-nav-group')?.classList.toggle('is-current', isActive)
      if (isActive) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }

    let activeYear = null
    for (const year of timelineYears) {
      const representedYears = (year.dataset.timelineNavYear || '').split('|')
      const isActive = year.dataset.timelineNavPhase === activePhase && representedYears.includes(entry.dataset.timelineYear)
      year.classList.toggle('is-active', isActive)
      if (isActive) activeYear = year
    }

    followActiveTimelineYear(activeYear)

    for (const pin of timelineGlobePins) {
      pin.classList.toggle('is-active', pin.dataset.timelineGlobePin === entry.dataset.timelinePin)
    }

    if (timelineGlobeLocation) {
      timelineGlobeLocation.textContent = entry.dataset.timelineLocation || ''
    }

    if (timelineGlobeCard && !prefersReduced) {
      timelineGlobeCard.classList.remove('is-changing-location')
      void timelineGlobeCard.offsetWidth
      timelineGlobeCard.classList.add('is-changing-location')
    }
  }

  const updateTimelineProgress = () => {
    timelineFrame = null
    if (!timelineProgress) return

    const rect = timelineStream.getBoundingClientRect()
    const viewportMarker = window.innerHeight * 0.48
    const progress = Math.min(1, Math.max(0, (viewportMarker - rect.top) / rect.height))
    timelineProgress.style.transform = `scaleY(${progress.toFixed(4)})`
  }

  const queueTimelineProgress = () => {
    if (timelineFrame !== null) return
    timelineFrame = window.requestAnimationFrame(updateTimelineProgress)
  }

  setActiveTimelineEntry(timelineEntries[0])

  if (prefersReduced || !('IntersectionObserver' in window)) {
    for (const entry of timelineEntries) entry.classList.add('is-timeline-visible')
    setActiveTimelineEntry(timelineEntries[0])
  } else {
    const revealTimelineEntry = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-timeline-visible')
          revealTimelineEntry.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    const trackTimelineEntry = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]) setActiveTimelineEntry(visibleEntries[0].target)
      },
      { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.1, 0.35, 0.65] },
    )

    for (const entry of timelineEntries) {
      revealTimelineEntry.observe(entry)
      trackTimelineEntry.observe(entry)
    }
  }

  window.addEventListener('scroll', queueTimelineProgress, { passive: true })
  window.addEventListener('resize', queueTimelineProgress)
  timelineNavigator?.addEventListener('wheel', () => {
    timelineNavigatorManualUntil = window.performance.now() + 1400
  }, { passive: true })
  timelineNavigator?.addEventListener('pointerdown', () => {
    timelineNavigatorManualUntil = window.performance.now() + 1400
  }, { passive: true })
  updateTimelineProgress()
}

for (const explorer of document.querySelectorAll('[data-ambassador-explorer]')) {
  const countries = Array.from(explorer.querySelectorAll('[data-ambassador-country]'))
  const pins = Array.from(explorer.querySelectorAll('[data-ambassador-pin]'))
  const detailCountry = explorer.querySelector('[data-ambassador-detail-country]')
  const detailCopy = explorer.querySelector('[data-ambassador-detail-copy]')
  const visual = explorer.querySelector('[data-ambassador-visual]')
  const photoCode = explorer.querySelector('[data-ambassador-photo-code]')
  const photoPlaceholder = explorer.querySelector('.ambassador-photo-placeholder')
  const locationPhoto = explorer.querySelector('[data-ambassador-photo]')
  const photoStatus = explorer.querySelector('.ambassador-photo-status')
  const globe = explorer.querySelector('[data-sphere-mode="interactive"]')
  const globeMarker = explorer.querySelector('[data-ambassador-globe-marker]')
  const globeHalo = explorer.querySelector('[data-ambassador-globe-halo]')
  const globeLabel = explorer.querySelector('[data-ambassador-globe-label]')

  const setActiveCountry = (countryName) => {
    const country = countries.find((item) => item.dataset.ambassadorCountry === countryName)
    if (!country) return

    for (const item of countries) {
      const isActive = item === country
      item.classList.toggle('is-active', isActive)
      item.setAttribute('aria-pressed', String(isActive))
    }

    for (const pin of pins) {
      pin.classList.toggle('is-active', pin.dataset.ambassadorPin === countryName)
    }

    const countryLabel = country.querySelector('span')?.textContent || ''

    if (detailCountry) detailCountry.textContent = countryLabel
    if (detailCopy) detailCopy.textContent = country.querySelector('small')?.textContent || ''
    if (visual) visual.dataset.country = countryName
    if (photoCode) photoCode.textContent = country.dataset.photoCode || ''
    if (globeLabel) globeLabel.textContent = countryLabel

    const photoSrc = country.dataset.photo || ''
    const photoAlt = country.dataset.photoAlt || ''
    if (locationPhoto) {
      locationPhoto.hidden = !photoSrc
      if (photoSrc) locationPhoto.src = photoSrc
      else locationPhoto.removeAttribute('src')
      locationPhoto.alt = photoAlt
    }
    photoPlaceholder?.classList.toggle('has-location-photo', Boolean(photoSrc))
    if (photoStatus) photoStatus.hidden = Boolean(photoSrc)

    const sphereInstance = globe?.sphereInstance
    if (sphereInstance) {
      const targetTurn = Number(country.dataset.globeTurn || 0)
      sphereInstance.targetOffset = targetTurn + Math.round(sphereInstance.offset - targetTurn)
      if (prefersReduced) renderSphereInstance(sphereInstance, 0)
    }

    const markerY = Number(country.dataset.globeY || 60)
    const previousY = Number(globeMarker?.getAttribute('cy') || markerY)

    for (const marker of [globeMarker, globeHalo]) {
      if (!marker) continue
      marker.setAttribute('cy', String(markerY))
      if (!prefersReduced && marker.animate) {
        marker.animate(
          [
            { transform: `translateY(${previousY - markerY}px) scale(0.78)`, opacity: 0.4 },
            { transform: 'translateY(0) scale(1)', opacity: 1 },
          ],
          { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        )
      }
    }

    if (visual && !prefersReduced) {
      visual.classList.remove('is-globe-turning')
      void visual.offsetWidth
      visual.classList.add('is-globe-turning')
    }

    if (photoPlaceholder) {
      photoPlaceholder.setAttribute(
        'aria-label',
        photoSrc ? `${photoAlt}. Interactive globe focused on ${countryLabel || countryName}.` : `Interactive globe focused on ${countryLabel || countryName}; location photo forthcoming`,
      )
    }
  }

  for (const country of countries) {
    country.addEventListener('click', () => setActiveCountry(country.dataset.ambassadorCountry))
    country.addEventListener('mouseenter', () => setActiveCountry(country.dataset.ambassadorCountry))
    country.addEventListener('focus', () => setActiveCountry(country.dataset.ambassadorCountry))
  }

  for (const pin of pins) {
    pin.addEventListener('click', () => setActiveCountry(pin.dataset.ambassadorPin))
    pin.addEventListener('focus', () => setActiveCountry(pin.dataset.ambassadorPin))
  }

  const initialCountry = countries.find((country) => country.classList.contains('is-active'))
  if (initialCountry) setActiveCountry(initialCountry.dataset.ambassadorCountry)
}

const SPONSOR_TAX_LANGUAGE_ENABLED = false

for (const taxLanguage of document.querySelectorAll('[data-sponsor-tax-language]')) {
  taxLanguage.hidden = !SPONSOR_TAX_LANGUAGE_ENABLED
}

for (const sponsorFlow of document.querySelectorAll('[data-sponsor-flow]')) {
  const steps = Array.from(sponsorFlow.querySelectorAll('[data-sponsor-step]'))
  const progressItems = Array.from(sponsorFlow.querySelectorAll('[data-sponsor-progress]'))
  const backButton = sponsorFlow.querySelector('[data-sponsor-back]')
  const nextButton = sponsorFlow.querySelector('[data-sponsor-next]')
  const submitButton = sponsorFlow.querySelector('[data-sponsor-submit]')
  const status = sponsorFlow.querySelector('[data-sponsor-status]')
  const form = sponsorFlow.querySelector('form')
  let currentStep = 0

  const showSponsorStep = (stepIndex) => {
    currentStep = Math.min(steps.length - 1, Math.max(0, stepIndex))

    for (const [index, step] of steps.entries()) {
      const isActive = index === currentStep
      step.hidden = !isActive
      step.classList.toggle('is-active', isActive)
    }

    for (const [index, progress] of progressItems.entries()) {
      progress.classList.toggle('is-active', index === currentStep)
      progress.classList.toggle('is-complete', index < currentStep)
    }

    if (backButton) backButton.hidden = currentStep === 0
    if (nextButton) nextButton.hidden = currentStep === steps.length - 1
    if (submitButton) {
      const isFinalStep = currentStep === steps.length - 1
      submitButton.hidden = !isFinalStep
      submitButton.disabled = !isFinalStep
    }
    if (status) status.textContent = ''
    steps[currentStep]?.querySelector('legend')?.focus?.()
  }

  const validateCurrentSponsorStep = () => {
    const fields = Array.from(steps[currentStep]?.querySelectorAll('input, textarea, select') || [])
    const invalidField = fields.find((field) => !field.checkValidity())

    if (!invalidField) return true
    invalidField.reportValidity()
    if (status) status.textContent = 'Please complete the required fields before continuing.'
    return false
  }

  nextButton?.addEventListener('click', () => {
    if (validateCurrentSponsorStep()) showSponsorStep(currentStep + 1)
  })

  backButton?.addEventListener('click', () => showSponsorStep(currentStep - 1))
  form?.addEventListener('submit', (event) => {
    if (currentStep === steps.length - 1) return
    event.preventDefault()
    if (status) status.textContent = 'Please complete all four steps before sending your inquiry.'
  })
  showSponsorStep(0)
}

for (const image of document.querySelectorAll('.logo-grid img, .media-logo-cloud img')) {
  const parent = image.parentElement
  const label = image.getAttribute('alt')

  if (!parent || !label) continue

  const showFallback = () => {
    if (parent.closest('.path-logo-grid')) {
      parent.hidden = true
      return
    }

    parent.classList.add('logo-failed')

    if (parent.querySelector('.logo-fallback-text')) return

    const fallback = document.createElement('span')
    fallback.className = 'logo-fallback-text'
    fallback.textContent = label
    parent.append(fallback)
  }

  image.addEventListener('error', showFallback)

  window.setTimeout(() => {
    if (!image.complete || image.naturalWidth === 0) {
      showFallback()
    }
  }, 3000)
}
