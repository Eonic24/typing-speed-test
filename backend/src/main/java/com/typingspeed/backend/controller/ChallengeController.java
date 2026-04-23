package com.typingspeed.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.typingspeed.backend.entity.Challenge;
import com.typingspeed.backend.repository.ChallengeRepository;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeRepository challengeRepository;

    public ChallengeController(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    @PostMapping
    public Challenge createChallenge(@RequestBody Challenge challenge) {
        return challengeRepository.save(challenge);
    }
}