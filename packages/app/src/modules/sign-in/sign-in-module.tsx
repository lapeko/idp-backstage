import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

const signInPage = SignInPageBlueprint.make({
    params: {
        loader: async () => props =>
        (
            <SignInPage
                {...props}
                title='Select a sign-in method'
                align='center'
                provider={{
                    id: 'github-auth-provider',
                    title: 'GitHub',
                    message: 'Sign in using GitHub',
                    apiRef: githubAuthApiRef,
                }}
            />
        ),
    },
});

export const signInModule = createFrontendModule({
    pluginId: 'app',
    extensions: [signInPage],
})