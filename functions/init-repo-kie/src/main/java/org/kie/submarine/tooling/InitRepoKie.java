package org.kie.submarine.tooling;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

@Path("/init")
public class InitRepoKie {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String init(@QueryParam("path") final String path,
                       @QueryParam("type") final String type) {
        final GitHubCredentials credentials = new GitHubCredentials();
        final GitHubIntegration integration = new GitHubIntegration(credentials);
        return integration.createPR(path, type);
    }
}