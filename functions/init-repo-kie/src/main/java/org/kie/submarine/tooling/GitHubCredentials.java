package org.kie.submarine.tooling;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

public class GitHubCredentials {

    private UsernamePasswordCredentialsProvider credentialsProvider = null;
    private String space = null;

    public GitHubCredentials() {
        final String username = "user";
        final String password = "token";

        credentialsProvider = new UsernamePasswordCredentialsProvider(username, password);
    }

    public CredentialsProvider getCredentials() {
        return credentialsProvider;
    }

    public String getSpace() {
        return space;
    }
}
