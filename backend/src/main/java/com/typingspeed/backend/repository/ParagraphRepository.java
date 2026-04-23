package com.typingspeed.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.typingspeed.backend.entity.Paragraph;

public interface ParagraphRepository extends JpaRepository<Paragraph, Long> {
    List<Paragraph> findByChallengeId(Long challengeId);
}