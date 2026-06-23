import { Actor, Vector, CollisionType } from "excalibur"

export class MazeTileCollisionBuilder {
  /**
   * Laad een collision map en genereer hitbox-rechthoeken.
   *
   * BELANGRIJK: geef de NATIVE resolutie van de PNG mee als width/height,
   * en gebruik 'scale' om naar wereldcoördinaten te vertalen.
   *
   * Voorbeeld voor een 256x1024 map in een 1440x5760 wereld:
   *   fromImage("/images/East-maze.png", 256, 1024, { tileSize: 4, scale: 5.625, ... })
   *
   * Kleurconventie (gemeten):
   *   Teal/groen muur  → R=40 G=80 B=80  (G>=R+20 AND B>=R+20)
   *   Blauwe vloer     → R=40 G=48 B=104 (B dominant) → wordt genegeerd
   *   Pikzwart nep     → R=0  G=0  B=0
   */
  static async fromImage(imagePath, width, height, options = {}) {
    const {
      tileSize = 4,
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
          // Canvas op native resolutie — geen opschaling, geen pixel-bleeding
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("MazeTileCollisionBuilder: could not get 2D canvas context"))
            return
          }

          // Teken op native grootte (1:1), imageSmoothingEnabled doet er dan niet toe
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(img, 0, 0, width, height)

          const imageData = ctx.getImageData(0, 0, width, height)
          const data = imageData.data

          const cols = Math.ceil(width  / tileSize)
          const rows = Math.ceil(height / tileSize)

          // Bouw 2D grid op native resolutie
          const grid = []
          for (let row = 0; row < rows; row++) {
            grid.push([])
            for (let col = 0; col < cols; col++) {
              const x = col * tileSize
              const y = row * tileSize
              const stats = this.sampleTile(data, width, height, x, y, tileSize)

              const isWall  = this.isWallTile(stats)
              const isBlack = this.isBlackTile(stats)

              if (isWall && treatGreenAsCollision) {
                grid[row].push(greenIsSolid ? 'real' : 'fake')
              } else if (isBlack && treatBlackAsCollision) {
                grid[row].push(blackIsSolid ? 'real' : 'fake')
              } else {
                grid[row].push(null)
              }
            }
          }

          // Greedy rectangle merging per type
          const rects = []

          for (const type of ['real', 'fake']) {
            const used = Array.from({ length: rows }, () => new Array(cols).fill(false))

            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                if (used[row][col] || grid[row][col] !== type) continue

                // Zo ver mogelijk naar rechts
                let maxCol = col
                while (maxCol + 1 < cols && grid[row][maxCol + 1] === type && !used[row][maxCol + 1]) {
                  maxCol++
                }

                // Zo ver mogelijk naar beneden (volledige breedte moet vrij zijn)
                let maxRow = row
                outer: while (maxRow + 1 < rows) {
                  for (let c = col; c <= maxCol; c++) {
                    if (grid[maxRow + 1][c] !== type || used[maxRow + 1][c]) break outer
                  }
                  maxRow++
                }

                // Markeer als gebruikt
                for (let r = row; r <= maxRow; r++) {
                  for (let c = col; c <= maxCol; c++) {
                    used[r][c] = true
                  }
                }

                // Vertaal naar wereldcoördinaten via scale
                rects.push({
                  x:      col  * tileSize * scale,
                  y:      row  * tileSize * scale,
                  width:  (maxCol - col + 1) * tileSize * scale,
                  height: (maxRow - row + 1) * tileSize * scale,
                  isReal: type === 'real'
                })
              }
            }
          }

          resolve(rects)
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
      const actor = new Actor({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        anchor: Vector.Zero,
        collisionType: rect.isReal ? CollisionType.Fixed : CollisionType.Passive
      })
      actor.isReal = rect.isReal
      return actor
    })
  }

  static sampleTile(data, imageWidth, imageHeight, startX, startY, tileSize) {
    let wallPixels  = 0
    let blackPixels = 0
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

        // TEAL MUUR: G en B winnen allebei duidelijk van R
        // Gemeten: R=40,G=80,B=80 | R=32,G=112,B=120 | R=40,G=128,B=104
        if (g >= r + 20 && b >= r + 20) {
          wallPixels++
        }
        // PIKZWART: alle kanalen <= 10
        else if (r <= 10 && g <= 10 && b <= 10) {
          blackPixels++
        }

        validPixels++
      }
    }

    return { wallPixels, blackPixels, validPixels }
  }

  // Op native resolutie geen bleeding → drempel hoog voor precisie
  static isWallTile(stats) {
    if (stats.validPixels === 0) return false
    return stats.wallPixels > stats.validPixels * 0.25
  }

  static isBlackTile(stats) {
    if (stats.validPixels === 0) return false
    if (stats.wallPixels > stats.validPixels * 0.05) return false
    return stats.blackPixels > stats.validPixels * 0.40
  }
}