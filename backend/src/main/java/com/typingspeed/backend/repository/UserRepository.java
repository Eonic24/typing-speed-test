package com.typingspeed.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.typingspeed.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}