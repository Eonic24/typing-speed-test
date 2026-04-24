package com.typingspeed.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.typingspeed.backend.entity.Result;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByUserId(Long userId);
}