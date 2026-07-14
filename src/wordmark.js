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

  sphereInstances.push({ meridians: instanceMeridians, speed })
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
    for (const meridian of instance.meridians) {
      const progress = (time * instance.speed + meridian.phase) % 1
      const position = progress * 2 - 1
      const controlX = center.x + position * 56
      meridian.path.setAttribute('d', meridianPath(controlX))
      meridian.path.style.opacity = (edgeFade(position) * 0.64).toFixed(2)
    }
  }

  requestAnimationFrame(animateSphere)
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

try {
  window.sessionStorage.setItem('vwb-site-seen', 'true')

  if (window.sessionStorage.getItem('vwb-blink-enter') === 'true' && !prefersReduced) {
    window.sessionStorage.removeItem('vwb-blink-enter')
    transitionActive = true
    blinkTransition.classList.add('is-opening')

    window.setTimeout(() => {
      blinkTransition.classList.remove('is-opening')
      transitionActive = false
    }, 460)
  }
} catch {
  // Navigation still works when session storage is unavailable.
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

  window.setTimeout(() => {
    try {
      window.sessionStorage.setItem('vwb-blink-enter', 'true')
    } catch {
      // Continue without the opening half of the transition.
    }
    window.location.assign(url)
  }, 430)
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

const timelineStream = document.querySelector('[data-timeline-stream]')

if (timelineStream) {
  const timelineEntries = Array.from(timelineStream.querySelectorAll('[data-timeline-entry]'))
  const timelineProgress = timelineStream.querySelector('[data-timeline-progress]')
  const timelineLinks = Array.from(document.querySelectorAll('[data-timeline-link]'))
  const timelineYears = Array.from(document.querySelectorAll('[data-timeline-nav-year]'))
  const timelineGlobeCard = document.querySelector('[data-timeline-globe-card]')
  const timelineGlobePins = Array.from(document.querySelectorAll('[data-timeline-globe-pin]'))
  const timelineGlobeLocation = document.querySelector('[data-timeline-globe-location]')
  let activeTimelineEntry = null
  let timelineFrame = null

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

    for (const year of timelineYears) {
      year.classList.toggle('is-active', year.dataset.timelineNavYear === entry.dataset.timelineYear)
    }

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
  updateTimelineProgress()
}

for (const explorer of document.querySelectorAll('[data-ambassador-explorer]')) {
  const countries = Array.from(explorer.querySelectorAll('[data-ambassador-country]'))
  const pins = Array.from(explorer.querySelectorAll('[data-ambassador-pin]'))
  const detailCountry = explorer.querySelector('[data-ambassador-detail-country]')
  const detailCopy = explorer.querySelector('[data-ambassador-detail-copy]')

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

    if (detailCountry) detailCountry.textContent = country.querySelector('span')?.textContent || ''
    if (detailCopy) detailCopy.textContent = country.querySelector('small')?.textContent || ''
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
    if (submitButton) submitButton.hidden = currentStep !== steps.length - 1
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
