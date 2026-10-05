import * as migration_20260925_070050_initial from './20260925_070050_initial';

export const migrations = [
  {
    up: migration_20260925_070050_initial.up,
    down: migration_20260925_070050_initial.down,
    name: '20260925_070050_initial'
  },
];
