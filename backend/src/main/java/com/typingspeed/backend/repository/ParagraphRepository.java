package com.typingspeed.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.typingspeed.backend.entity.Paragraph;

public interface ParagraphRepository extends JpaRepository<Paragraph, Long> {

    List<Paragraph> findByChallengeId(Long challengeId);

    @Query(value = "SELECT * FROM paragraphs ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Paragraph findRandomParagraph();
}