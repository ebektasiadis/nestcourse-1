import { DataSource, DataSourceOptions } from 'typeorm';

export let dataSourceOptions: DataSourceOptions;

dataSourceOptions = {
  migrations: ['migrations/*.js'],
  synchronize: false,
} as DataSourceOptions;

if (process.env.NODE_ENVIRONMENT === 'development') {
  dataSourceOptions = Object.assign(dataSourceOptions, {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.js'],
  });
}

if (process.env.NODE_ENVIRONMENT === 'test') {
  dataSourceOptions = Object.assign(dataSourceOptions, {
    type: 'sqlite',
    database: 'testdb.sqlite',
    entities: ['**/*.entity.ts'],
  });
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
