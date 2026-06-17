export class CollisionMapGenerator {
  static async generateCollisionsFromImage(imagePath, darkThreshold = 50) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        const visited = new Set()
        const collisions = []

        // Scan pixels for dark areas
        for (let i = 0; i < data.length; i += 4) {
          const pixelIndex = i / 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // If pixel is dark (black area), find its bounding box
          if ((r + g + b) / 3 < darkThreshold && !visited.has(pixelIndex)) {
            const bbox = this.floodFill(pixelIndex, canvas.width, canvas.height, data, visited, darkThreshold)
            if (bbox) {
              collisions.push(bbox)
            }
          }
        }

        // Merge overlapping rectangles
        const merged = this.mergeRectangles(collisions)
        resolve(merged)
      }
      img.src = imagePath
    })
  }

  static floodFill(startPixel, width, height, data, visited, threshold) {
    let minX = width, maxX = 0, minY = height, maxY = 0
    const queue = [startPixel]
    visited.add(startPixel)

    while (queue.length > 0) {
      const pixel = queue.shift()
      const x = pixel % width
      const y = Math.floor(pixel / width)

      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)

      // Check neighbors
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx
          const ny = y + dy
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighbor = ny * width + nx
            if (!visited.has(neighbor)) {
              const i = neighbor * 4
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              if ((r + g + b) / 3 < threshold) {
                visited.add(neighbor)
                queue.push(neighbor)
              }
            }
          }
        }
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    }
  }

  static mergeRectangles(rects) {
    // Remove very small noise rects
    return rects.filter(r => r.width > 5 && r.height > 5)
  }
}