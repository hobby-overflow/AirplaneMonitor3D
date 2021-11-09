declare module '*/config.json' {
    interface Config {
        access_url: {
            simulate: string
            realtime: string
        }
        mode: {
            map: boolean
            simulation: boolean
        }
        map: {
            centerLat: number
            centerLon: number
            position: {
                x: number
                z: number
            }
            scale: number
            api_id: string
        }
        view: {
            pixelDensity: number
            lineWidth: number
        }
    }
    
    const value: Config;
    export = value;
}