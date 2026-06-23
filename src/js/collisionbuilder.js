import { Actor, Vector, CollisionType } from "excalibur"

export class MazeTileCollisionBuilder {
  static async fromImage(imagePath, width, height, options = {}) {
    const {
      tileSize = 16,
      scale = 1,
      treatBlackAsCollision = true,
      treatGreenAsCollision = true,
      blackIsSolid = false,
      greenIsSolid = true
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

        const merged = this.mergeRectangles(tiles, 90)

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
        name: 'path',
        isRayCastable: true,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        anchor: Vector.Zero,
        collisionType: rect.isReal ? CollisionType.Fixed : CollisionType.PreventCollision
      })
      actor.isReal = rect.isReal
      return actor
    })
  }

  static sampleTile(data, imageWidth, imageHeight, startX, startY, tileSize) {
    let wallPixels = 0   // teal/groen: G dominant
    let blackPixels = 0  // pikzwart
    let validPixels = 0

    const endX = Math.min(startX + tileSize, imageWidth)
    const endY = Math.min(startY + tileSize, imageHeight)

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * imageWidth + x) * 4
        if (data[index + 3] === 0) continue

        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]

        // TEAL/GROEN muur: G is de dominante kleur, wint duidelijk van R
        // Gebaseerd op gemeten waarden: R=37-47, G=80-128, B=83-121
        // G wint altijd van R met marge van 20+, en B is nooit veel hoger dan G
        if (g > r + 20 && g > 55 && b < r + 80) {
          wallPixels++
        }
        // PIKZWART: alle kanalen <= 35
        else if (r <= 35 && g <= 35 && b <= 35) {
          blackPixels++
        }

        validPixels++
      }
    }

    return { wallPixels, blackPixels, validPixels }
  }

  // Echte muur: teal/groen tegel
  static isWallTile(stats) {
    if (stats.validPixels === 0) return false
    return stats.wallPixels > stats.validPixels * 0.25
  }

  // Neppe muur: pikzwart, niet groen
  static isBlackTile(stats) {
    if (stats.validPixels === 0) return false
    if (stats.wallPixels > stats.validPixels * 0.1) return false // groen heeft voorrang
    return stats.blackPixels > stats.validPixels * 0.5
  }
}