package org.kie.submarine.tooling;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

import org.eclipse.jgit.api.Git;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;

public class GitHubIntegration {

    private static final String GH_USERNAME = "user";
    private static final String GH_PASSWORD = "token";

    private final GitHubCredentials credentials;

    public GitHubIntegration(final GitHubCredentials credentials) {
        this.credentials = credentials;
    }

    public String createPR(final String path) {
        try {
            final GitHub github = GitHub.connect(GH_USERNAME, GH_PASSWORD);
            final GHRepository fork = github.getRepository(path).fork();
            fork.renameTo(UUID.randomUUID().toString());

            final File tempDir = tempDir(fork.getName());
            final Git git = Git.cloneRepository()
                    .setCredentialsProvider(credentials.getCredentials())
                    .setURI(fork.getHttpTransportUrl())
                    .setDirectory(tempDir)
                    .call();
            System.err.println("path: " + tempDir.toString());
            Files.write(tempDir.toPath().resolve("test.txt"), "test".getBytes());
            git.add().addFilepattern("test.txt").call();
            git.commit().setMessage("test").call();
            git.push().setCredentialsProvider(credentials.getCredentials()).call();
            return github.getRepository(path).createPullRequest("PR from Submarine Function", GH_USERNAME + ":master", "master", "Some description").getIssueUrl().toString();
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    private File tempDir(String reponame) throws IOException {
        return Files.createTempDirectory(new File(System.getProperty("java.io.tmpdir")).toPath(), "temp").resolve(reponame).toFile();
    }
}
