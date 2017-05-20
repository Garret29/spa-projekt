package pl.krakow.uek.spaproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import pl.krakow.uek.spaproject.model.TranslationData;
import pl.krakow.uek.spaproject.repositories.TranslationsRepository;

import java.io.*;
import java.util.Arrays;
import java.util.Scanner;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner init(TranslationsRepository translationsRepository) {

        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("resources.json");
        StringBuilder stringBuilder = new StringBuilder();
        Scanner scanner = new Scanner(inputStream);

        while (scanner.hasNextLine()) {
            stringBuilder.append(scanner.nextLine());
        }

        String json = stringBuilder.toString();
        return (evt) -> Arrays.asList(
                "garret29,danbraj".split(","))
                .forEach(
                        a -> {
                            translationsRepository.save(new TranslationData(a, json));
                        });
    }
}