package org.kie.submarine.tooling;

import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

public class GitHubCredentials {

    public static final String GH_USERNAME = "xxxx";
    public static final String GH_PASSWORD = "sss";

    private UsernamePasswordCredentialsProvider credentialsProvider = null;

    public GitHubCredentials() {
        credentialsProvider = new UsernamePasswordCredentialsProvider(GH_USERNAME, GH_PASSWORD);
    }

    public CredentialsProvider getCredentials() {
        return credentialsProvider;
    }
}
