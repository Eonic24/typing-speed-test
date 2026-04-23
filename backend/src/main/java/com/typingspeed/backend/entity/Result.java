package com.typingspeed.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @ManyToOne
    @JoinColumn(name = "paragraph_id", nullable = false)
    private Paragraph paragraph;

    @Column(nullable = false)
    private Double wpm;

    @Column(nullable = false)
    private Double accuracy;

    @Column(nullable = false)
    private Integer mistakes;

    @Column(nullable = false)
    private Integer timeTaken;

    @Column(nullable = false)
    private LocalDateTime testDate;

    public Result() {
    }

    public Result(Long id, User user, Challenge challenge, Paragraph paragraph, Double wpm,
                  Double accuracy, Integer mistakes, Integer timeTaken, LocalDateTime testDate) {
        this.id = id;
        this.user = user;
        this.challenge = challenge;
        this.paragraph = paragraph;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.mistakes = mistakes;
        this.timeTaken = timeTaken;
        this.testDate = testDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Challenge getChallenge() {
        return challenge;
    }

    public void setChallenge(Challenge challenge) {
        this.challenge = challenge;
    }

    public Paragraph getParagraph() {
        return paragraph;
    }

    public void setParagraph(Paragraph paragraph) {
        this.paragraph = paragraph;
    }

    public Double getWpm() {
        return wpm;
    }

    public void setWpm(Double wpm) {
        this.wpm = wpm;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Integer getMistakes() {
        return mistakes;
    }

    public void setMistakes(Integer mistakes) {
        this.mistakes = mistakes;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public LocalDateTime getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDateTime testDate) {
        this.testDate = testDate;
    }
}