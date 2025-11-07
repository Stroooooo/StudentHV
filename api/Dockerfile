FROM gradle:8.5-jdk21 AS build
WORKDIR /app
COPY ./ ./
RUN rm -rf .gradle build
RUN chmod +x ./gradlew
EXPOSE 8080
ENTRYPOINT ["./gradlew", "bootRun"] 