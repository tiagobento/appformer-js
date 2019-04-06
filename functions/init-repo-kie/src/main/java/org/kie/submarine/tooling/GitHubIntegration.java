package org.kie.submarine.tooling;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.eclipse.jgit.api.Git;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;

public class GitHubIntegration {

    private final GitHubCredentials credentials;

    public GitHubIntegration(final GitHubCredentials credentials) {
        this.credentials = credentials;
    }

    public String createPR(final String _path,
                           final String type) {
        System.out.println("TYPE: " + type);
        final String path = _path.replaceAll("https://github.com/", "")
                .replaceAll("https://www.github.com/", "");
        try {
            final GitHub github = GitHub.connect(GitHubCredentials.GH_USERNAME, GitHubCredentials.GH_PASSWORD);
            final GHRepository fork = github.getRepository(path).fork();
            fork.renameTo(UUID.randomUUID().toString());

            final File tempDir = tempDir(fork.getName());
            final Git git = Git.cloneRepository()
                    .setCredentialsProvider(credentials.getCredentials())
                    .setURI(fork.getHttpTransportUrl())
                    .setDirectory(tempDir)
                    .call();
            System.err.println("path: " + tempDir.toString());
            File resource = getResource("/" + type);
            fileWrite(tempDir, resource, resource);
            git.add().addFilepattern(".").call();
            git.commit().setMessage("KIE Init").call();
            git.push().setCredentialsProvider(credentials.getCredentials()).call();
            final String prNumber = github.getRepository(path).createPullRequest("PR from Submarine Function", GitHubCredentials.GH_USERNAME + ":master", "master", "Some description").getIssueUrl().toString();
            return prNumber;
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    private void fileWrite(File tempDir, File root, File folder) throws IOException {
        Pair<File, File[]> files = getResourceFolderFiles(folder);
        for (File f : files.getValue()) {
            final Path relativePath = root.toPath().relativize(f.toPath());
            if (f.isDirectory()) {
                try {
                    Files.createDirectory(tempDir.toPath().resolve(relativePath));
                } catch (FileAlreadyExistsException ex) {
                }
                fileWrite(tempDir, root, f);
            } else {
                Files.write(tempDir.toPath().resolve(relativePath), IOUtils.toByteArray(new FileInputStream(f)));
            }
        }
    }

    private File tempDir(String reponame) throws IOException {
        return Files.createTempDirectory(new File(System.getProperty("java.io.tmpdir")).toPath(), "temp").resolve(reponame).toFile();
    }

    private static Pair<File, File[]> getResourceFolderFiles(File folder) {
        return Pair.of(folder, folder.listFiles());
    }

    private static File getResource(String folder) {
        System.out.println("folder: " + folder);
        final URL url = GitHubIntegration.class.getResource(folder);
        System.out.println("URL:" + url);
        final String path = url.getPath();
        return new File(path);
    }
}
