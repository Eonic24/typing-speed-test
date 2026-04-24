package com.typingspeed.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.typingspeed.backend.entity.Result;
import com.typingspeed.backend.repository.ResultRepository;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultRepository resultRepository;

    public ResultController(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @GetMapping
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    @PostMapping
    public Result createResult(@RequestBody Result result) {
        return resultRepository.save(result);
    }

    @GetMapping("/user/{userId}")
    public List<Result> getResultsByUserId(@PathVariable Long userId) {
        return resultRepository.findByUserId(userId);
    }
}