package com.typingspeed.backend.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.typingspeed.backend.entity.Challenge;
import com.typingspeed.backend.entity.Paragraph;
import com.typingspeed.backend.repository.ChallengeRepository;
import com.typingspeed.backend.repository.ParagraphRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ChallengeRepository challengeRepository;
    private final ParagraphRepository paragraphRepository;

    public DataSeeder(ChallengeRepository challengeRepository, ParagraphRepository paragraphRepository) {
        this.challengeRepository = challengeRepository;
        this.paragraphRepository = paragraphRepository;
    }

    @Override
    public void run(String... args) {
        if (paragraphRepository.count() > 0) {
            return;
        }

        Challenge challenge = new Challenge();
        challenge.setTitle("Easy Challenge");
        challenge.setDifficulty("Easy");
        challenge.setDuration(60);

        Challenge savedChallenge = challengeRepository.save(challenge);

        List<String> texts = List.of(
            "The quick brown fox jumps over the lazy dog.",
            "Typing speed improves with daily practice and proper focus.",
            "Programming teaches you how to solve problems step by step.",
            "Databases store information so applications can remember user activity.",
            "Spring Boot connects the backend logic with the database easily.",
            "A good typing test should measure both speed and accuracy.",
            "Clean code is easier to read debug and maintain.",
            "The internet connects millions of people through websites and applications.",
            "Cybersecurity protects systems from attacks and unauthorized access.",
            "Students can improve productivity by managing time and staying consistent.",
            "Java is widely used for building secure and scalable backend systems.",
            "A keyboard becomes faster to use when your fingers learn the correct rhythm.",
            "Web applications usually have a frontend backend and database layer.",
            "Errors are part of development and debugging helps us understand the system.",
            "Practice builds confidence and confidence improves performance.",
            "Software projects become easier when the structure is clear.",
            "APIs allow the frontend and backend to communicate with each other.",
            "MySQL is useful for storing users results paragraphs and challenges.",
            "Typing accuracy matters because fast typing with many mistakes is not useful.",
            "A full stack project shows how different technologies work together."
        );

        for (String text : texts) {
            Paragraph paragraph = new Paragraph();
            paragraph.setContent(text);
            paragraph.setChallenge(savedChallenge);
            paragraphRepository.save(paragraph);
        }
    }
}
