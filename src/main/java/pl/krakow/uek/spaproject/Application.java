package pl.krakow.uek.spaproject;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import pl.krakow.uek.spaproject.model.TranslationData;
import pl.krakow.uek.spaproject.repositories.TranslationsRepository;

import java.io.*;
import java.util.Arrays;
import java.util.Properties;
import java.util.Scanner;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        final JSch jsch = new JSch();
        Session session = null;
        try {
            session = jsch.getSession("username", "@host", 22);

            session.setPassword("password");

            final Properties config = new Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);

            session.connect();
            session.setPortForwardingL(5433, "db host", 5432);
        } catch (JSchException e) {
            e.printStackTrace();
        }
        SpringApplication.run(Application.class, args);
    }

}