import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Pr0v@sdeT1",
    database: "bexams",
    entities: [
        "src/app/models/*.ts"
    ],
    migrations: [
        "src/migrations/*.ts"
    ],
    synchronize: true
});