import { Actor, Vector, CollisionType } from "excalibur";

export class MazeTileCollisionBuilder {
  static async fromImage(imagePath, width, height, options = {}) {
    const {
      tileSize = 16,
      tolerance = 15,
      scale = 1,
      treatBlackAsCollision = true,
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(
              new Error(
                "MazeTileCollisionBuilder: could not get 2D canvas context",
              ),
            );
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          const tiles = [];

          for (let y = 0; y < height; y += tileSize) {
            for (let x = 0; x < width; x += tileSize) {
              const tile = this.sampleTile(data, width, height, x, y, tileSize);
              const isBlack = this.isBlackTile(tile, tolerance);

              if (
                (treatBlackAsCollision && isBlack) ||
                (!treatBlackAsCollision && !isBlack)
              ) {
                tiles.push({
                  x,
                  y,
                  width: Math.min(tileSize, width - x),
                  height: Math.min(tileSize, height - y),
                });
              }
            }
          }

          const merged = this.mergeRectangles(tiles, 90);

          resolve(
            merged.map((rect) => ({
              x: rect.x * scale,
              y: rect.y * scale,
              width: rect.width * scale,
              height: rect.height * scale,
            })),
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(
          new Error(
            `MazeTileCollisionBuilder: failed to load image ${imagePath}`,
          ),
        );
      };

      img.src = imagePath;
    });
  }

  static createCollisionActors(rects, xMin = 0, xMax = Infinity) {
    // Deduplicate identical rectangles
    const unique = rects.filter(
      (rect, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            r.x === rect.x &&
            r.y === rect.y &&
            r.width === rect.width &&
            r.height === rect.height,
        ),
    );

    // Filter by x range
    const filtered = unique.filter((rect) => rect.x > xMin && rect.x < xMax);

    return filtered.map((rect) => {
      const actor = new Actor({
        name: "path",
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        anchor: Vector.Zero,
        collisionType: CollisionType.Passive,
      });
      actor.isRayCastable = true;
      return actor;
    });
  }

  static sampleTile(
    data,
    imageWidth,
    imageHeight,
    startX,
    startY,
    tileSize,
    tolerance,
  ) {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    const endX = Math.min(startX + tileSize, imageWidth);
    const endY = Math.min(startY + tileSize, imageHeight);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * imageWidth + x) * 4;
        const a = data[index + 3];
        if (a === 0) continue;

        totalR += data[index];
        totalG += data[index + 1];
        totalB += data[index + 2];
        count++;
      }
    }

    if (count === 0) {
      return { r: 255, g: 255, b: 255, count: 0 };
    }

    return {
      r: totalR / count,
      g: totalG / count,
      b: totalB / count,
      count,
    };
  }

  static isBlackTile(color, tolerance) {
    return color.r <= tolerance && color.g <= tolerance && color.b <= tolerance;
  }

  static mergeRectangles(rects, maxSize = 100) {
    const horizontal = this.mergeHorizontalRuns(rects, maxSize);
    return this.mergeVerticalRuns(horizontal, maxSize);
  }

  static mergeHorizontalRuns(rects, maxWidth = 100) {
    const sorted = [...rects].sort((a, b) => a.y - b.y || a.x - b.x);
    const merged = [];

    for (const rect of sorted) {
      const last = merged[merged.length - 1];

      const touchesLast =
        last &&
        last.y === rect.y &&
        last.height === rect.height &&
        last.x + last.width === rect.x;

      const wouldStayWithinLimit = last && last.width + rect.width <= maxWidth;

      if (touchesLast && wouldStayWithinLimit) {
        last.width += rect.width;
      } else {
        merged.push({ ...rect });
      }
    }

    return merged;
  }

  static mergeVerticalRuns(rects, maxHeight = 100) {
    const sorted = [...rects].sort((a, b) => a.x - b.x || a.y - b.y);
    const merged = [];

    for (const rect of sorted) {
      const last = merged[merged.length - 1];

      const touchesLast =
        last &&
        last.x === rect.x &&
        last.width === rect.width &&
        last.y + last.height === rect.y;

      const wouldStayWithinLimit =
        last && last.height + rect.height <= maxHeight;

      if (touchesLast && wouldStayWithinLimit) {
        last.height += rect.height;
      } else {
        merged.push({ ...rect });
      }
    }

    return merged;
  }
}
