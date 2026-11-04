import * as migration_20260925_070050_initial from './20260925_070050_initial';
import * as migration_20261030_095422_add_services_page from './20261030_095422_add_services_page';
import * as migration_20261102_060125_add_lab_impact from './20261102_060125_add_lab_impact';

export const migrations = [
  {
    up: migration_20260925_070050_initial.up,
    down: migration_20260925_070050_initial.down,
    name: '20260925_070050_initial',
  },
  {
    up: migration_20261030_095422_add_services_page.up,
    down: migration_20261030_095422_add_services_page.down,
    name: '20261030_095422_add_services_page',
  },
  {
    up: migration_20261102_060125_add_lab_impact.up,
    down: migration_20261102_060125_add_lab_impact.down,
    name: '20261102_060125_add_lab_impact'
  },
];
