document.getElementById('closeBtn').addEventListener('click', () => {
  window.close()
})

const canvas  = document.getElementById('c')
const ctx     = canvas.getContext('2d')
const display = document.getElementById('display')
const btn     = document.getElementById('btn')

const RAYS      = 60
const CX        = 170
const CY        = 148
const R_INNER   = 118
const R_OUTER   = 134
const RAY_W     = 3
const ARC_START = Math.PI
const ARC_SPAN  = Math.PI

let totalSecs    = 0
let remaining    = 0
let running      = false
let interval     = null
let inputMinutes = 5
let inputChanged = false

function progressColor(p) {
  const hue = Math.round((1 - p) * 120)
  const sat = 90
  const lig = p < 0.5 ? 45 : 42
  return `hsl(${hue},${sat}%,${lig}%)`
}

function draw(progress) {
  ctx.clearRect(0, 0, 340, 240)
  const elapsed  = 1 - progress
  const litCount = Math.round(elapsed * RAYS)

  for (let i = 0; i < RAYS; i++) {
    const angle = ARC_START + (i / (RAYS - 1)) * ARC_SPAN
    const lit   = i < litCount
    const x1 = CX + Math.cos(angle) * R_INNER
    const y1 = CY + Math.sin(angle) * R_INNER
    const x2 = CX + Math.cos(angle) * R_OUTER
    const y2 = CY + Math.sin(angle) * R_OUTER

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth   = RAY_W
    ctx.lineCap     = 'round'
    ctx.strokeStyle = lit ? progressColor(elapsed) : '#3a3a3a'
    ctx.stroke()
  }
}

function updateDisplay(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  display.value = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
}

function onDone() {
  running = false
  clearInterval(interval)
  draw(0)
  display.value       = '00:00'
  display.style.color = '#22c55e'
  btn.textContent     = 'сбросить'
  btn.className       = 'done'
  display.disabled    = true
  beep()
}

function beep() {
  try {
    const ctx2 = new AudioContext()
    const osc  = ctx2.createOscillator()
    const gain = ctx2.createGain()
    osc.connect(gain)
    gain.connect(ctx2.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx2.currentTime)
    gain.gain.setValueAtTime(0.4, ctx2.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 1.2)
    osc.start(ctx2.currentTime)
    osc.stop(ctx2.currentTime + 1.2)
  } catch(e) {}
}

function resetIdle() {
  clearInterval(interval)
  running             = false
  inputChanged        = false
  remaining           = 0
  totalSecs           = 0
  display.disabled    = false
  display.value       = String(inputMinutes).padStart(2, '0') + ':00'
  display.style.color = '#f0f0f0'
  btn.textContent     = 'старт'
  btn.className       = ''
  draw(1)
}

btn.addEventListener('click', () => {
  if (btn.textContent === 'сбросить') { resetIdle(); return }

  if (!running) {
    if (!inputChanged && remaining > 0 && totalSecs > 0) {
      // resume
    } else {
      inputMinutes = Math.max(1, Math.min(99, parseInt(display.value) || 1))
      totalSecs    = inputMinutes * 60
      remaining    = totalSecs
      inputChanged = false
    }
    running          = true
    display.disabled = true
    btn.textContent  = 'стоп'
    btn.className    = 'running'
    updateDisplay(remaining)
    draw(remaining / totalSecs)

    interval = setInterval(() => {
      remaining--
      if (remaining <= 0) { onDone(); return }
      updateDisplay(remaining)
      draw(remaining / totalSecs)
    }, 1000)
  } else {
    clearInterval(interval)
    running          = false
    btn.textContent  = 'старт'
    btn.className    = ''
    display.disabled = false
  }
})

display.addEventListener('input', () => {
  let v = parseInt(display.value)
  if (isNaN(v) || v < 1) v = 1
  if (v > 99) v = 99
  inputMinutes = v
  inputChanged = true
  remaining    = 0
  draw(1)
})

display.addEventListener('blur', () => {
  if (!running) {
    let v = parseInt(display.value)
    if (isNaN(v) || v < 1) v = 1
    if (v > 99) v = 99
    inputMinutes   = v
    display.value  = String(v).padStart(2, '0') + ':00'
  }
})

display.value = String(inputMinutes).padStart(2, '0') + ':00'
draw(1)
