import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import orgPlugin from '@backstage/plugin-org/alpha';
import catalogGraphPlugin from '@backstage/plugin-catalog-graph/alpha';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';
import { signInModule } from './modules/sign-in';



export default createApp({
  features: [
    catalogPlugin,
    orgPlugin,
    catalogGraphPlugin,
    navModule,
    homeModule,
    signInModule
  ],
});
