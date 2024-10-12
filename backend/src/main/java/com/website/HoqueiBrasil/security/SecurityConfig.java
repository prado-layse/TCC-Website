package com.website.HoqueiBrasil.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @SuppressWarnings({ "removal", "deprecation" })
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Desabilita CSRF (use com cuidado)
            .authorizeRequests(auth -> auth
                .requestMatchers("/api/users/**").authenticated() // Requer autenticação
                .anyRequest().permitAll() // Permite outras requisições
            )
            .httpBasic(); // Autenticação básica

        return http.build();
    }
}

