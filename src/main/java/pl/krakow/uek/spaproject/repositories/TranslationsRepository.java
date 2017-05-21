package pl.krakow.uek.spaproject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.krakow.uek.spaproject.model.TranslationData;

public interface TranslationsRepository extends JpaRepository<TranslationData, Long> {
    TranslationData findById(Long id);
}
