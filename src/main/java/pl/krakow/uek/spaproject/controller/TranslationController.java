package pl.krakow.uek.spaproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.krakow.uek.spaproject.model.TranslationData;
import pl.krakow.uek.spaproject.repositories.TranslationsRepository;

import java.net.URI;

@RestController
public class TranslationController {
    private TranslationsRepository translationsRepository;

    @Autowired
    public TranslationController(TranslationsRepository translationsRepository) {
        this.translationsRepository = translationsRepository;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/translations/{username}", produces = {"application/json; charset=UTF-8"})
    public String getTranslations(@PathVariable String username) {
        return translationsRepository.findByUsername(username).getTranslationsSerializedJSON();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/translations", consumes = "application/json")
    public ResponseEntity<?> add(@RequestBody TranslationData translationData) {
        this.translationsRepository.save(translationData);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/").build().toUri();

        return ResponseEntity.created(location).build();
    }
}
