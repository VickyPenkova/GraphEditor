FROM openjdk:8-jdk-alpine
COPY /target/graph-editor-0.0.1-SNAPSHOT.jar graph-editor-0.0.1-SNAPSHOT.jar
COPY "/src/main/resources" "/src/main/resources/"
EXPOSE 8000
ENTRYPOINT ["java","-jar","graph-editor-0.0.1-SNAPSHOT.jar"]
