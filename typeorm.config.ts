import { DataSource, DataSourceOptions } from 'typeorm';

export let dataSourceOptions: DataSourceOptions;

if (process.env.NODE_ENVIRONMENT === 'development') {
  dataSourceOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.js'],
    synchronize: true,
  };
}

if (process.env.NODE_ENVIRONMENT === 'test') {
  dataSourceOptions = {
    type: 'sqlite',
    database: 'testdb.sqlite',
    entities: ['**/*.entity.ts'],
    synchronize: true,
  };
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
