# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the target folder to the container
# Note: Ensure the JAR name matches what was generated in your target folder
COPY target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]