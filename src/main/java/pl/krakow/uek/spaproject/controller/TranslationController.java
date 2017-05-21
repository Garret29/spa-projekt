package pl.krakow.uek.spaproject.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    @RequestMapping(method = RequestMethod.GET, value = "/translations/{id}", produces = {"application/json; charset=UTF-8"})
    public String getTranslations(@PathVariable long id, @RequestParam(name = "pass", defaultValue = "") String password) throws Exception {
        if (!translationsRepository.findById(id).getPassword().equals(password)) {
            throw new Exception("Wrong password!");
        }
        return translationsRepository.findById(id).getTranslationsSerializedJSON();
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST, value = "/translations", consumes = {"application/json; charset=UTF-8"})
    public ResponseEntity<?> add(@RequestBody String serializedData) {
        JSONObject jsonObject = new JSONObject(serializedData);
        TranslationData translationData;

        if (!jsonObject.has("id")){
            translationData = new TranslationData(jsonObject.getString("password"), jsonObject.getString("serializedJSON").replaceAll(" ", ""));
        } else {
            translationData = new TranslationData(jsonObject.getLong("id") ,jsonObject.getString("password"), jsonObject.getString("serializedJSON").replaceAll(" ", ""));
        }
        this.translationsRepository.save(translationData);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/" + translationData.getId()).build().toUri();

        return ResponseEntity.created(location).build();
    }
}
