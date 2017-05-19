package pl.krakow.uek.spaproject.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class TranslationData {

    @Id
    private String username;

    @Lob
    @Column
    private String translationsSerializedJSON;

    public TranslationData() { //Jpa only
    }

    public TranslationData(String username) {
        this.username = username;
    }

    public TranslationData(String username, String translationsSerializedJSON) {
        this.username = username;
        this.translationsSerializedJSON = translationsSerializedJSON;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setTranslationsSerializedJSON(String translationsSerializedJSON) {
        this.translationsSerializedJSON = translationsSerializedJSON;
    }

    public String getUsername() {
        return username;
    }

    public String getTranslationsSerializedJSON() {
        return translationsSerializedJSON;
    }
}
