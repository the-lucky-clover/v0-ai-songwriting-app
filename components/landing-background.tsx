"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  life: number
  maxLife: number
}

interface Wave {
  phase: number
  amplitude: number
  frequency: number
  speed: number
  hue: number
}

export function LandingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const wavesRef = useRef<Wave[]>([])
  const timeRef = useRef(0)
  const frameRef = useRef(0)

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        hue: Math.random() * 360,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
      })
    }
    particlesRef.current = particles

    const waves: Wave[] = []
    for (let i = 0; i < 8; i++) {
      waves.push({
        phase: (i * Math.PI) / 4,
        amplitude: 50 + Math.random() * 100,
        frequency: 0.002 + Math.random() * 0.003,
        speed: 0.02 + Math.random() * 0.03,
        hue: (i * 45) % 360,
      })
    }
    wavesRef.current = waves
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)

    const drawHypnoticBackground = (t: number) => {
      const { width, height } = canvas

      // Deep space gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.3 + Math.sin(t * 0.0003) * 100,
        height * 0.3 + Math.cos(t * 0.0004) * 100,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height),
      )
      bgGrad.addColorStop(0, `hsl(${(t * 0.01) % 360}, 80%, 8%)`)
      bgGrad.addColorStop(0.3, `hsl(${(t * 0.01 + 30) % 360}, 70%, 5%)`)
      bgGrad.addColorStop(0.6, `hsl(${(t * 0.01 + 60) % 360}, 60%, 3%)`)
      bgGrad.addColorStop(1, "#000005")
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)
    }

    const drawPsychedelicWaves = (t: number) => {
      const { width, height } = canvas

      wavesRef.current.forEach((wave, index) => {
        ctx.beginPath()
        ctx.moveTo(0, height / 2)

        for (let x = 0; x <= width; x += 3) {
          const y =
            height / 2 +
            Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + t * wave.speed * 1.5) * (wave.amplitude * 0.3) +
            Math.cos(x * wave.frequency * 0.5 + t * wave.speed * 0.7) * (wave.amplitude * 0.5)

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        const hue = (wave.hue + t * 0.02) % 360
        const grad = ctx.createLinearGradient(0, height / 2 - wave.amplitude, 0, height / 2 + wave.amplitude)
        grad.addColorStop(0, `hsla(${hue}, 100%, 60%, 0)`)
        grad.addColorStop(0.5, `hsla(${hue}, 100%, 60%, ${0.15 - index * 0.015})`)
        grad.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.stroke()

        // Glow effect
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.8)`
        ctx.shadowBlur = 20
        ctx.stroke()
        ctx.shadowBlur = 0
      })
    }

    const drawOrbitalRings = (t: number) => {
      const { width, height } = canvas
      const cx = width / 2 + Math.sin(t * 0.0002) * 50
      const cy = height / 2 + Math.cos(t * 0.0003) * 50

      for (let i = 0; i < 12; i++) {
        const radius = 100 + i * 40
        const rotation = t * 0.0005 * (i % 2 === 0 ? 1 : -1) + (i * Math.PI) / 6
        const hue = (i * 30 + t * 0.02) % 360

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation)
        ctx.scale(1, 0.3)

        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${0.3 - i * 0.02})`
        ctx.lineWidth = 1.5
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.8)`
        ctx.shadowBlur = 15
        ctx.stroke()
        ctx.shadowBlur = 0

        ctx.restore()
      }
    }

    const drawNeuralNetwork = (t: number) => {
      const { width, height } = canvas
      const nodes: { x: number; y: number; connections: number[] }[] = []
      const gridSize = 120

      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          const offsetX = Math.sin(t * 0.001 + x * 0.01) * 20
          const offsetY = Math.cos(t * 0.001 + y * 0.01) * 20
          nodes.push({ x: x + offsetX, y: y + offsetY, connections: [] })
        }
      }

      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i >= j) return
          const dist = Math.hypot(node.x - other.x, node.y - other.y)
          if (dist < gridSize * 1.5) {
            const alpha = (1 - dist / (gridSize * 1.5)) * 0.15
            const hue = (t * 0.01 + dist * 0.1) % 360

            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      nodes.forEach((node, i) => {
        const hue = (i * 20 + t * 0.02) % 360
        const pulse = Math.sin(t * 0.003 + i) * 0.5 + 0.5

        ctx.beginPath()
        ctx.arc(node.x, node.y, 3 + pulse * 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${0.5 + pulse * 0.3})`
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 1)`
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const drawParticles = (t: number) => {
      const { width, height } = canvas
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particlesRef.current.forEach((p) => {
        // Mouse attraction
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200
          p.vx += (dx / dist) * force * 0.3
          p.vy += (dy / dist) * force * 0.3
        }

        // Update position
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.life++
        p.hue = (p.hue + 0.5) % 360

        // Wrap around
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Reset if dead
        if (p.life > p.maxLife) {
          p.life = 0
          p.x = Math.random() * width
          p.y = Math.random() * height
        }

        // Draw
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 + alpha * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.8})`
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 1)`
        ctx.shadowBlur = 15
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const drawVortex = (t: number) => {
      const { width, height } = canvas
      const cx = width / 2
      const cy = height / 2

      for (let i = 0; i < 200; i++) {
        const angle = (i / 200) * Math.PI * 12 + t * 0.001
        const radius = 50 + (i / 200) * 300
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius * 0.6
        const hue = (i * 1.8 + t * 0.02) % 360
        const size = 2 + (i / 200) * 3

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.6 - (i / 200) * 0.4})`
        ctx.fill()
      }
    }

    const drawAuroraStreaks = (t: number) => {
      const { width, height } = canvas

      for (let i = 0; i < 5; i++) {
        const yBase = height * 0.2 + i * (height * 0.15)
        const hue = (i * 60 + t * 0.01) % 360

        ctx.beginPath()
        ctx.moveTo(0, yBase)

        for (let x = 0; x <= width; x += 10) {
          const y = yBase + Math.sin(x * 0.005 + t * 0.002 + i) * 50 + Math.sin(x * 0.01 + t * 0.001) * 25
          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        const grad = ctx.createLinearGradient(0, yBase - 50, 0, yBase + 150)
        grad.addColorStop(0, `hsla(${hue}, 100%, 60%, 0)`)
        grad.addColorStop(0.3, `hsla(${hue}, 80%, 50%, 0.05)`)
        grad.addColorStop(0.7, `hsla(${(hue + 30) % 360}, 80%, 40%, 0.03)`)
        grad.addColorStop(1, `hsla(${(hue + 60) % 360}, 70%, 30%, 0)`)

        ctx.fillStyle = grad
        ctx.fill()
      }
    }

    const animate = () => {
      timeRef.current += 16
      const t = timeRef.current

      drawHypnoticBackground(t)
      drawAuroraStreaks(t)
      drawNeuralNetwork(t)
      drawOrbitalRings(t)
      drawPsychedelicWaves(t)
      drawVortex(t)
      drawParticles(t)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(frameRef.current)
    }
  }, [initParticles])

  return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" style={{ background: "#000005" }} />
}
