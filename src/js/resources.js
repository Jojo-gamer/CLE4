import { ImageSource, Sound, Resource, Loader, SpriteSheet } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    SackUp: new ImageSource('/images/entities/player/moving/sack-walking-backturn-600x1000px.png'),
    SackHorizontal: new ImageSource('/images/entities/player/moving/sack-walking-horizontal-600x1000px.png'),
    SackDown: new ImageSource('/images/entities/player/moving/sack-walking-down600x1000px.png'),
    WallTiles: new ImageSource('/images/wall-assets-128x128.png'),
    CafTile: new ImageSource('./images/cafetaria-tiles.png'),
    Doors: new ImageSource('./images/door-assets-v2-128x128.png'),
    WingTile: new ImageSource('./images/wing-tiles-128x128.png'),
    Table: new ImageSource('./images/entities/props/table-horizontal-500x500px.png'),
    TableVertical: new ImageSource('/images/entities/props/table-vertical-500x500px.png'),
    TableHorizontal: new ImageSource('/images/entities/props/table-horizontal-500x500px.png'),
    Key: new ImageSource('./images/entities/utils/key.png'),
    BarkSound: new Sound('/images/entities/sounds/minecraft-dog-bark.mp3'),
    DogFront: new ImageSource('./images/entities/dog/dog-front-128x128.png'),
    DogBack: new ImageSource('./images/entities/dog/dog-back-128x128.png'),
    DogSide: new ImageSource('./images/entities/dog/dog-side-128x128.png'),
    KnightFront: new ImageSource('./images/entities/enemy/knight/knight-piece-640x640.png'),
    KnightSide: new ImageSource('./images/entities/enemy/knight/knight-side-640x640.png'),
    KnightBack: new ImageSource('./images/entities/enemy/knight/knight-back-640x640.png'),
    FullHeart: new ImageSource('/images/entities/UI/fullheart.png'),
    EmptyHeart: new ImageSource('/images/entities/UI/emptyheart.png'),
    OutOfBoundsSound: new Sound('/images/entities/sounds/outofbounds.mp3'),
    WallVertical: new ImageSource('/images/wall-vertical.png'),
    MazeWall: new ImageSource('/images/wall-tiles-128x128.png'),
    EastHallMap: new ImageSource('/images/east-hall.map.jpg'),
    Afgrond: new ImageSource('/images/afgrond.png'),
    EastHallWay: new ImageSource('/images/East-maze.png'),
    Reception: new ImageSource('./images/reception-map.png'),
    EastHallMap: new ImageSource('/images/East-hall-map.png'),
    floorTile: new ImageSource('/images/floortile.png'),
    Rubble: new ImageSource('./images/rubble.png'),
    Crowbar: new ImageSource('./images/entities/utils/crowbar.png'),
    GameOver: new ImageSource('./images/gameover.png')
}

export const cafWalls = SpriteSheet.fromImageSource({
    image: Resources.WallTiles,
    grid: {
        spriteWidth: 128,
        spriteHeight: 128,
        columns: 6,
        rows: 1,
    }
})

export const doors = SpriteSheet.fromImageSource({
    image: Resources.Doors,
    grid: {
        spriteWidth: 128,
        spriteHeight: 128,
        columns: 9,
        rows: 1,
    }
})

const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }