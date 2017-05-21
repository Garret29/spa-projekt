package pl.krakow.uek.spaproject.model;

import javax.persistence.*;

@Entity
public class TranslationData {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private String password;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String translationsSerializedJSON;

    public TranslationData() { //Jpa only
    }

    public TranslationData(String password, String translationsSerializedJSON) {
        this.password = password;
        this.translationsSerializedJSON = translationsSerializedJSON;
    }

    public TranslationData(String translationsSerializedJSON) {
        this.translationsSerializedJSON = translationsSerializedJSON;
    }

    public void setTranslationsSerializedJSON(String translationsSerializedJSON) {
        this.translationsSerializedJSON = translationsSerializedJSON;
    }

    public String getTranslationsSerializedJSON() {
        return translationsSerializedJSON;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
