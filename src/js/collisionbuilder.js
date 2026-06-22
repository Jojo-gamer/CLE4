// import { Actor, Vector, CollisionType } from "excalibur"

// export class MazeCollisionBuilder {
//   static async fromImage(imagePath, width, height, options = {}) {
//     const {
//       wallColors = [{ r: 0, g: 0, b: 0 }],
//       tolerance = 10,
//       minRegionSize = 4,
//       scale = 1
//     } = options

//     return new Promise((resolve) => {
//       const img = new Image()
//       img.onload = () => {
//         const canvas = document.createElement("canvas")
//         canvas.width = width
//         canvas.height = height

//         const ctx = canvas.getContext("2d")
//         ctx.imageSmoothingEnabled = false
//         ctx.drawImage(img, 0, 0, width, height)

//         const imageData = ctx.getImageData(0, 0, width, height)
//         const data = imageData.data

//         const visited = new Set()
//         const rects = []

//         for (let y = 0; y < height; y++) {
//           for (let x = 0; x < width; x++) {
//             const index = y * width + x
//             if (visited.has(index)) continue

//             const pixelIndex = index * 4
//             const r = data[pixelIndex]
//             const g = data[pixelIndex + 1]
//             const b = data[pixelIndex + 2]
//             const a = data[pixelIndex + 3]

//             if (a === 0) {
//               visited.add(index)
//               continue
//             }

//             if (this.isBlack(r, g, b, tolerance)) {
//               visited.add(index)
//               continue
//             }

//             const rect = this.floodFill(
//               x,
//               y,
//               width,
//               height,
//               data,
//               visited,
//               wallColors,
//               tolerance
//             )

//             if (rect.width >= minRegionSize && rect.height >= minRegionSize) {
//               rects.push({
//                 x: rect.x * scale,
//                 y: rect.y * scale,
//                 width: rect.width * scale,
//                 height: rect.height * scale
//               })
//             }
//           }
//         }

//         resolve(rects)
//       }

//       img.src = imagePath
//     })
//   }

//   static fromActors(scene, options = {}) {
//     const {
//       ignore = () => false,
//       padding = 0,
//       collisionType = CollisionType.Fixed
//     } = options

//     const actors = scene.actors ?? scene.children ?? []
//     const collisionActors = []

//     for (const actor of actors) {
//       if (!actor) continue
//       if (ignore(actor)) continue
//       if (!actor.width || !actor.height) continue

//       const anchorX = actor.anchor?.x ?? 0.5
//       const anchorY = actor.anchor?.y ?? 0.5

//       const collisionActor = new Actor({
//         x: actor.pos.x - actor.width * anchorX,
//         y: actor.pos.y - actor.height * anchorY,
//         width: actor.width + padding * 2,
//         height: actor.height + padding * 2,
//         collisionType
//       })

//       collisionActors.push(collisionActor)
//     }

//     return collisionActors
//   }

// static createCollisionActors(rects) {
//   return rects.map((rect) => {
//     return new Actor({
//       x: rect.x,
//       y: rect.y,
//       width: rect.width,
//       height: rect.height,
//       anchor: Vector.Zero,
//       collisionType: CollisionType.Fixed
//     })
//   })
// }

//   static isBlack(r, g, b, tolerance = 10) {
//   return r <= tolerance && g <= tolerance && b <= tolerance
// }

//   static matchesAnyColor(r, g, b, colors, tolerance) {
//     for (const color of colors) {
//       const dr = Math.abs(r - color.r)
//       const dg = Math.abs(g - color.g)
//       const db = Math.abs(b - color.b)

//       if (dr <= tolerance && dg <= tolerance && db <= tolerance) {
//         return true
//       }
//     }

//     return false
//   }

//   static floodFill(startX, startY, width, height, data, visited, wallColors, tolerance) {
//     const queue = [[startX, startY]]
//     const startIndex = startY * width + startX
//     visited.add(startIndex)

//     let minX = startX
//     let maxX = startX
//     let minY = startY
//     let maxY = startY

//     while (queue.length > 0) {
//       const [x, y] = queue.shift()

//       minX = Math.min(minX, x)
//       maxX = Math.max(maxX, x)
//       minY = Math.min(minY, y)
//       maxY = Math.max(maxY, y)

//       const neighbors = [
//         [x + 1, y],
//         [x - 1, y],
//         [x, y + 1],
//         [x, y - 1]
//       ]

//       for (const [nx, ny] of neighbors) {
//         if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue

//         const neighborIndex = ny * width + nx
//         if (visited.has(neighborIndex)) continue

//         const pixelIndex = neighborIndex * 4
//         const r = data[pixelIndex]
//         const g = data[pixelIndex + 1]
//         const b = data[pixelIndex + 2]
//         const a = data[pixelIndex + 3]

//         visited.add(neighborIndex)

//         if (a === 0) continue
//         if (this(r, g, b, tolerance)) continue

//         queue.push([nx, ny])
//       }
//     }

//     return {
//       x: minX,
//       y: minY,
//       width: maxX - minX + 1,
//       height: maxY - minY + 1
//     }
//   }
// }

import { Actor, Vector, CollisionType } from "excalibur"

export class MazeTileCollisionBuilder {
  static async fromImage(imagePath, width, height, options = {}) {
  const {
    tileSize = 16,
    tolerance = 15,
    scale = 1,
    treatBlackAsCollision = true
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("MazeTileCollisionBuilder: could not get 2D canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data

        const tiles = []

        for (let y = 0; y < height; y += tileSize) {
          for (let x = 0; x < width; x += tileSize) {
            const tile = this.sampleTile(data, width, height, x, y, tileSize)
            const isBlack = this.isBlackTile(tile, tolerance)

            if ((treatBlackAsCollision && isBlack) || (!treatBlackAsCollision && !isBlack)) {
              tiles.push({
                x,
                y,
                width: Math.min(tileSize, width - x),
                height: Math.min(tileSize, height - y)
              })
            }
          }
        }

        const merged = this.mergeRectangles(tiles, 80)

        resolve(
          merged.map((rect) => ({
            x: rect.x * scale,
            y: rect.y * scale,
            width: rect.width * scale,
            height: rect.height * scale
          }))
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error(`MazeTileCollisionBuilder: failed to load image ${imagePath}`))
    }

    img.src = imagePath
  })
}

  static createCollisionActors(rects) {
    return rects.map((rect) => {
      return new Actor({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        anchor: Vector.Zero,
        collisionType: CollisionType.Passive
      })
    })
  }

  static sampleTile(data, imageWidth, imageHeight, startX, startY, tileSize, tolerance) {
    let totalR = 0
    let totalG = 0
    let totalB = 0
    let count = 0

    const endX = Math.min(startX + tileSize, imageWidth)
    const endY = Math.min(startY + tileSize, imageHeight)

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * imageWidth + x) * 4
        const a = data[index + 3]
        if (a === 0) continue

        totalR += data[index]
        totalG += data[index + 1]
        totalB += data[index + 2]
        count++
      }
    }

    if (count === 0) {
      return { r: 255, g: 255, b: 255, count: 0 }
    }

    return {
      r: totalR / count,
      g: totalG / count,
      b: totalB / count,
      count
    }
  }

  static isBlackTile(color, tolerance) {
    return (
      color.r <= tolerance &&
      color.g <= tolerance &&
      color.b <= tolerance
    )
  }

static mergeRectangles(rects, maxSize = 100) {
  const horizontal = this.mergeHorizontalRuns(rects, maxSize)
  return this.mergeVerticalRuns(horizontal, maxSize)
}

static mergeHorizontalRuns(rects, maxWidth = 100) {
  const sorted = [...rects].sort((a, b) => a.y - b.y || a.x - b.x)
  const merged = []

  for (const rect of sorted) {
    const last = merged[merged.length - 1]

    const touchesLast =
      last &&
      last.y === rect.y &&
      last.height === rect.height &&
      last.x + last.width === rect.x

    const wouldStayWithinLimit = last && last.width + rect.width <= maxWidth

    if (touchesLast && wouldStayWithinLimit) {
      last.width += rect.width
    } else {
      merged.push({ ...rect })
    }
  }

  return merged
}

static mergeVerticalRuns(rects, maxHeight = 100) {
  const sorted = [...rects].sort((a, b) => a.x - b.x || a.y - b.y)
  const merged = []

  for (const rect of sorted) {
    const last = merged[merged.length - 1]

    const touchesLast =
      last &&
      last.x === rect.x &&
      last.width === rect.width &&
      last.y + last.height === rect.y

    const wouldStayWithinLimit = last && last.height + rect.height <= maxHeight

    if (touchesLast && wouldStayWithinLimit) {
      last.height += rect.height
    } else {
      merged.push({ ...rect })
    }
  }

  return merged
}
}