 let store = {
    photos: '',
    info: '',
    rover: 'curiosity',
}


// add markup to the page
const root = document.getElementById('root')

const changeEventHandler = (event) => {
    selectedRover = document.getElementById("rover")
    
}

// update store with newly fetched photos / info
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

// update root with data from the store
const render = async (root, state) => {
    root.innerHTML = App(state, roverInfo, roverPhotos)
}


//higher order function, takes 2 callbacks
const App = (state, renderRoverInfo, renderRoverPhotos) => {
    
    const obj = Immutable.Map({
        photos: state.photos,
        info: state.info
    })

    return `
        <header></header>
        <main>
            <h1 style = "text-align:center"> Welcome to the Mars-Dashboard! </h1>
            <div align = "center">
                <h3> To see latest rover data, select the Mars rover: </h3>
                <select id = "rovers" onchange = "selectRover()" >
                    <option value = "curiosity" ${roverSelected("curiosity")}> curiosity </option>
                    <option value = "opportunity" ${roverSelected("opportunity")}> opportunity </option>
                    <option value = "spirit" ${roverSelected("spirit")}> spirit </option>
                </select>
                <p>
                    Latest Information for the rover: ${store.rover}
                </p>
                
                ${renderRoverInfo(obj.get("info"))}
                ${renderRoverPhotos(obj.get("photos"), returnPhoto)}
                
            </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS


const selectRover = () => {
    var rover = document.getElementById("rovers").value;

    store.rover = rover;

    getInfo(store)
    getPhotos(store)

}

const roverSelected = (rover) => {
    if (rover === store.rover) {
        return "selected"
    } else {
        return null;
    } 
}

//higher order function, takes in 1 callback
const roverPhotos = (storeData, cb) => {
    if (!storeData) {
        getPhotos(store)
        
    } else {
        var pictures = storeData.data.photos;
    return `
    <div class="image-grid">
        ${pictures.map(photo => cb(photo.img_src)).join(" ")}
    </div>`
}
}

const returnPhoto = (photo) => {
    return `<img class="grid-image" src=${photo} height = 300px width = 300px/>`
}

const roverInfo = (storeInfo) => {
    if (!storeInfo) {
        getInfo(store);
    } else {
        return `
         <p style = "text-align:center"> Landing date: ${storeInfo.info.photo_manifest.landing_date} <p/>
         <p style = "text-align:center"> Launch date: ${storeInfo.info.photo_manifest.launch_date} <p/>
         <p style = "text-align:center"> Rover status: ${storeInfo.info.photo_manifest.status} <p/>
         <p style = "text-align:center"> The most recent photos were taken on: ${storeInfo.info.photo_manifest.max_date} <p/> 
         <p style = "text-align:center"> The most recent photos : <p/>
         `
    }
}

// ------------------------------------------------------  API CALLS



const getPhotos = async (state) => {
    fetch(`http://localhost:3000/photos?rover=${state.rover}`)
        .then(res => res.json())
        .then(photos => updateStore(state, { photos }))
}

const getInfo = async (state) => {   
    fetch(`http://localhost:3000/info?rover=${state.rover}`)
    .then(res => res.json())    
    .then(info => updateStore(state, { info }))
}


