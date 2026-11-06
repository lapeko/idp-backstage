/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);

// techdocs plugin
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes plugin
backend.add(import('@backstage/plugin-kubernetes-backend'));

// user settings plugin
backend.add(import('@backstage/plugin-user-settings-backend'));

// notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

// mcp actions plugin
backend.add(import('@backstage/plugin-mcp-actions-backend'));

// user defined plugins

// github catalog provider
backend.add(import('@backstage/plugin-catalog-backend-module-github'));

// authentication github provider
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { stringifyEntityRef } from '@backstage/catalog-model';

const customAuth = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.github means that this must be "github".
          providerId: 'github',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver(info, ctx) {
              const { profile: { displayName } } = info;

              // Profiles are not always guaranteed to have an email address.
              // You can also find more provider-specific information in `info.result`.
              // It typically contains a `fullProfile` object as well as ID and/or access
              // tokens that you can use for additional lookups.
              if (!displayName) {
                throw new Error('User profile contained no displayName');
              }

              // This helper function handles sign-in by looking up a user in the catalog.
              // The lookup can be done either by reference, annotations, or custom filters.
              //
              // The helper also issues a token for the user, using the standard group
              // membership logic to determine the ownership references of the user.
              //
              // There are a number of other methods on the ctx, feel free to explore them!

              const userEntry = stringifyEntityRef({
                kind: "User",
                name: displayName,
                namespace: "default"
              })

              return ctx.issueToken({
                claims: {
                  sub: userEntry,
                  ent: [userEntry],
                },
              });
            }
          }),
        });
      },
    });
  },
});

backend.add(customAuth);

backend.start();

