type Config = {
    access_url: {
        realtime: string,
        simulate: string
    },
    mode: {
        map: boolean,
        simulation: boolean
    },
    map: {
        centerLat: number,
        centerLon: number,
        position: {
            x: number,
            y: number
        },
        scale: number,
        api_id: string,
    },
    view: {
        pixelDensity: number,
        lineWidth: number
    }
}