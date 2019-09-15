export interface Config {
    environment: string,
    app: {
        host: string,
        port: string
    },
    api: {
        host: string,
        port: string,
        jwtSecret: string
    },
    db: {
        host: string,
        user: string,
        password: string,
        database: string
    }
}