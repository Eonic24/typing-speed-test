package com.typingspeed.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.typingspeed.backend.entity.Challenge;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
}