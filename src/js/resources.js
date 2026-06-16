import { ImageSource, Sound, Resource, Loader, SpriteSheet } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    SackUp: new ImageSource('/images/entities/player/moving/sack-walking-backturn-600x1000px.png'),
    SackHorizontal: new ImageSource('/images/entities/player/moving/sack-walking-horizontal-600x1000px.png'),
    SackDown: new ImageSource('/images/entities/player/moving/sack-walking-down600x1000px.png'),
    Tiles: new ImageSource('/images/tileTest.png')
}

export const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Tiles,
            grid: {
                spriteWidth: 32,
                spriteHeight: 32,
                columns: 8,
                rows: 8,
            }
        })

const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }