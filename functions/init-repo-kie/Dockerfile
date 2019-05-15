FROM openjdk:8-alpine

RUN apk add maven

EXPOSE 8080

WORKDIR /usr/local/app/packages/functions/init-repo-kie

CMD ["./mvnw", "compile", "quarkus:dev"]