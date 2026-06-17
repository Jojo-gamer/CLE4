import { ImageSource, Sound, Resource, Loader } from 'excalibur'
import { TableHorizontal } from './tablehorizontal'

// voeg hier jouw eigen resources toe
const Resources = {
    SackUp: new ImageSource('/images/entities/player/moving/sack-walking-backturn-600x1000px.png'),
    SackHorizontal: new ImageSource('/images/entities/player/moving/sack-walking-horizontal-600x1000px.png'),
    SackDown: new ImageSource('/images/entities/player/moving/sack-walking-down600x1000px.png'),
    Tiles: new ImageSource('/images/tileset.png'),
    TableVertical: new ImageSource('/images/entities/props/table-vertical-500x500px.png'),
    TableHorizontal: new ImageSource('/images/entities/props/table-horizontal-500x500px.png'),
}


const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }