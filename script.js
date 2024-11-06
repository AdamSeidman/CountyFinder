const API_KEY = '672ab43ac89ae315617730tvmd47215'

let accuracy = 0

const getCoords = () => {
    if (!navigator.geolocation) return
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(pos => {
            if (pos) resolve(pos.coords)
            else reject()
        }, () => resolve())
    })
}

const getApiString = async () => {
    let coords = await getCoords()
    accuracy = coords.accuracy
    if (coords === undefined) return
    return `${atob('aHR0cHM6Ly9nZW9jb2RlLm1hcHMuY28vcmV2ZXJzZT8=')}lat=${coords.latitude}&lon=${coords.longitude}${atob('JmFwaV9rZXk9NjcyYWI0M2FjODlhZTMxNTYxNzczMHR2bWQ0NzIxNQ==')}`
}

const getPositionData = () => {
    const failed = { json: () => '' }
    return new Promise((resolve, reject) => {
        getApiString()
            .then(str => str? fetch(str) : failed)
            .then(resp => resp.json())
            .then(json => resolve(json))
    })
}

getPositionData().then(data => {
    console.log(data)
    if (data === undefined || data.address === undefined || Object.keys(data.address).length < 1) {
        document.getElementById('ansWrapper').innerHTML = "<h2>API Error</h2>"
    }
    else {
        document.getElementById('accuracy').innerHTML = accuracy
        if (data.address.country_code != 'us') {
            document.getElementById('posWrapper').innerHTML = "<h2>You are not in the US?</h2>"
        }
        else {
            document.getElementById('city').innerHTML = data.address.town
            document.getElementById('state').innerHTML = data.address.state
            document.getElementById('county').innerHTML = data.address.county
        }
    }
})
