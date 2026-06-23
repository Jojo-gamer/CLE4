import { Actor, Vector, CollisionType } from "excalibur"

export class MazeWallCollisionBuilder {
  
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
          
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("MazeTileCollisionBuilder: could not get 2D canvas context"))
            return
          }

          
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(img, 0, 0, width, height)

          const imageData = ctx.getImageData(0, 0, width, height)
          const data = imageData.data

          const cols = Math.ceil(width  / tileSize)
          const rows = Math.ceil(height / tileSize)

          
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

          
          const rects = []

          for (const type of ['real', 'fake']) {
            const used = Array.from({ length: rows }, () => new Array(cols).fill(false))

            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                if (used[row][col] || grid[row][col] !== type) continue

                
                let maxCol = col
                while (maxCol + 1 < cols && grid[row][maxCol + 1] === type && !used[row][maxCol + 1]) {
                  maxCol++
                }

                
                let maxRow = row
                outer: while (maxRow + 1 < rows) {
                  for (let c = col; c <= maxCol; c++) {
                    if (grid[maxRow + 1][c] !== type || used[maxRow + 1][c]) break outer
                  }
                  maxRow++
                }

                
                for (let r = row; r <= maxRow; r++) {
                  for (let c = col; c <= maxCol; c++) {
                    used[r][c] = true
                  }
                }

                
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
        collisionType: CollisionType.Fixed
      })
      

      actor.isReal = rect.isReal 
      
      return actor
    })
  }






//   static createCollisionActors(rects) {
//     return rects.map((rect) => {
//       const actor = new Actor({
//         x: rect.x,
//         y: rect.y,
//         width: rect.width,
//         height: rect.height,
//         anchor: Vector.Zero,
//         collisionType: rect.isReal ? CollisionType.Fixed : CollisionType.Passive
//       })
//       actor.isReal = rect.isReal
//       return actor
//     })
//   }

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

       
        if (g >= r + 20 && b >= r + 20) {
          wallPixels++
        }
        
        else if (r <= 10 && g <= 10 && b <= 10) {
          blackPixels++
        }

        validPixels++
      }
    }

    return { wallPixels, blackPixels, validPixels }
  }

  
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