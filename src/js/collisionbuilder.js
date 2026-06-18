// export class CollisionMapGenerator {
//   static async generateCollisionsFromImage(imagePath, targetWidth, targetHeight, darkThreshold = 10) {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = targetWidth;
//         canvas.height = targetHeight;

//         const ctx = canvas.getContext('2d');
//         ctx.imageSmoothingEnabled = false;
//         ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         const collisions = [];

//         // Define your grid size based on your asset layout (e.g., 20x20 or 40x40 pixel blocks)
//         const TILE_SIZE = 40; 

//         for (let y = 0; y < targetHeight; y += TILE_SIZE) {
//           for (let x = 0; x < targetWidth; x += TILE_SIZE) {
            
//             // Sample the center pixel of this grid tile
//             const centerX = Math.min(x + Math.floor(TILE_SIZE / 2), targetWidth - 1);
//             const centerY = Math.min(y + Math.floor(TILE_SIZE / 2), targetHeight - 1);
//             const pixelIndex = (centerY * targetWidth + centerX) * 4;

//             const r = data[pixelIndex];
//             const g = data[pixelIndex + 1];
//             const b = data[pixelIndex + 2];
//             const brightness = (r + g + b) / 3;

//             // If the tile is BRIGHT (wall texture), make it a solid block
//             if (brightness >= darkThreshold) {
//               collisions.push({
//                 x: x,
//                 y: y,
//                 width: TILE_SIZE,
//                 height: TILE_SIZE
//               });
//             }
//           }
//         }

//         resolve(collisions);
//       };

//       img.src = imagePath;
//     });
//   }



//   static floodFill(startPixel, width, height, data, visited, threshold) {
//     let minX = width, maxX = 0, minY = height, maxY = 0
//     const queue = [startPixel]
//     visited.add(startPixel)

//     while (queue.length > 0) {
//       const pixel = queue.shift()
//       const x = pixel % width
//       const y = Math.floor(pixel / width)

//       minX = Math.min(minX, x)
//       maxX = Math.max(maxX, x)
//       minY = Math.min(minY, y)
//       maxY = Math.max(maxY, y)

//       // Check neighbors
//       for (let dx = -1; dx <= 1; dx++) {
//         for (let dy = -1; dy <= 1; dy++) {
//           const nx = x + dx
//           const ny = y + dy
//           if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//             const neighbor = ny * width + nx
//             if (!visited.has(neighbor)) {
//               const i = neighbor * 4
//               const r = data[i]
//               const g = data[i + 1]
//               const b = data[i + 2]
//               if ((r + g + b) / 3 >= threshold) {
//                 visited.add(neighbor)
//                 queue.push(neighbor)
//               }
//             }
//           }
//         }
//       }
//     }

//     return {
//       x: minX,
//       y: minY,
//       width: maxX - minX + 1,
//       height: maxY - minY + 1
//     }
//   }

//   static mergeRectangles(rects) {
//     // Remove very small noise rects
//     return rects.filter(r => r.width > 5 && r.height > 5)
//   }
// }





import { Actor, Vector, CollisionType } from "excalibur"

export class MazeCollisionBuilder {
  static async fromImage(imagePath, width, height, options = {}) {
    const {
      wallColors = [{ r: 0, g: 0, b: 0 }],
      tolerance = 10,
      minRegionSize = 4,
      scale = 1
    } = options

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(img, 0, 0, width, height)

        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data

        const visited = new Set()
        const rects = []

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index = y * width + x
            if (visited.has(index)) continue

            const pixelIndex = index * 4
            const r = data[pixelIndex]
            const g = data[pixelIndex + 1]
            const b = data[pixelIndex + 2]
            const a = data[pixelIndex + 3]

            if (a === 0) {
              visited.add(index)
              continue
            }

            if (!this.matchesAnyColor(r, g, b, wallColors, tolerance)) {
              visited.add(index)
              continue
            }

            const rect = this.floodFill(
              x,
              y,
              width,
              height,
              data,
              visited,
              wallColors,
              tolerance
            )

            if (rect.width >= minRegionSize && rect.height >= minRegionSize) {
              rects.push({
                x: rect.x * scale,
                y: rect.y * scale,
                width: rect.width * scale,
                height: rect.height * scale
              })
            }
          }
        }

        resolve(rects)
      }

      img.src = imagePath
    })
  }

  static fromActors(scene, options = {}) {
    const {
      ignore = () => false,
      padding = 0,
      collisionType = CollisionType.Fixed
    } = options

    const actors = scene.actors ?? scene.children ?? []
    const collisionActors = []

    for (const actor of actors) {
      if (!actor) continue
      if (ignore(actor)) continue
      if (!actor.width || !actor.height) continue

      const anchorX = actor.anchor?.x ?? 0.5
      const anchorY = actor.anchor?.y ?? 0.5

      const collisionActor = new Actor({
        x: actor.pos.x - actor.width * anchorX,
        y: actor.pos.y - actor.height * anchorY,
        width: actor.width + padding * 2,
        height: actor.height + padding * 2,
        collisionType
      })

      collisionActors.push(collisionActor)
    }

    return collisionActors
  }

static createCollisionActors(rects) {
  return rects.map((rect) => {
    return new Actor({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      anchor: Vector.Zero,
      collisionType: CollisionType.Fixed
    })
  })
}

  static matchesAnyColor(r, g, b, colors, tolerance) {
    for (const color of colors) {
      const dr = Math.abs(r - color.r)
      const dg = Math.abs(g - color.g)
      const db = Math.abs(b - color.b)

      if (dr <= tolerance && dg <= tolerance && db <= tolerance) {
        return true
      }
    }

    return false
  }

  static floodFill(startX, startY, width, height, data, visited, wallColors, tolerance) {
    const queue = [[startX, startY]]
    const startIndex = startY * width + startX
    visited.add(startIndex)

    let minX = startX
    let maxX = startX
    let minY = startY
    let maxY = startY

    while (queue.length > 0) {
      const [x, y] = queue.shift()

      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)

      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ]

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue

        const neighborIndex = ny * width + nx
        if (visited.has(neighborIndex)) continue

        const pixelIndex = neighborIndex * 4
        const r = data[pixelIndex]
        const g = data[pixelIndex + 1]
        const b = data[pixelIndex + 2]
        const a = data[pixelIndex + 3]

        visited.add(neighborIndex)

        if (a === 0) continue
        if (!this.matchesAnyColor(r, g, b, wallColors, tolerance)) continue

        queue.push([nx, ny])
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    }
  }
}