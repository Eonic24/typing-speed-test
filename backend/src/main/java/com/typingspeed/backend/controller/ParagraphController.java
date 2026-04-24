package com.typingspeed.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.typingspeed.backend.entity.Paragraph;
import com.typingspeed.backend.repository.ParagraphRepository;

@RestController
@RequestMapping("/api/paragraphs")
public class ParagraphController {

    private final ParagraphRepository paragraphRepository;

    public ParagraphController(ParagraphRepository paragraphRepository) {
        this.paragraphRepository = paragraphRepository;
    }

    @GetMapping
    public List<Paragraph> getAllParagraphs() {
        return paragraphRepository.findAll();
    }

    @GetMapping("/random")
    public Paragraph getRandomParagraph() {
        return paragraphRepository.findRandomParagraph();
    }

    @PostMapping
    public Paragraph createParagraph(@RequestBody Paragraph paragraph) {
        return paragraphRepository.save(paragraph);
    }
}