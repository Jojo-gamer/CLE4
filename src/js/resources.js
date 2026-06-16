import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    SackUp: new ImageSource('/images/entities/player/moving/sack-walking-backturn-600x1000px.png'),
    SackHorizontal: new ImageSource('/images/entities/player/moving/sack-walking-horizontal-600x1000px.png'),
    SackDown: new ImageSource('/images/entities/player/moving/sack-walking-down600x1000px.png'),
    Tiles: new ImageSource('/images/tileset.png')
}


const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }