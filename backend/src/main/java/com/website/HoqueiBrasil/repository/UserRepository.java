package com.website.HoqueiBrasil.repository;

import com.website.HoqueiBrasil.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}