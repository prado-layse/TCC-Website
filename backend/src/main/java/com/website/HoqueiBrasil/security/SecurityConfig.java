package com.website.HoqueiBrasil.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Desabilita CSRF (não recomendado em produção sem atenção)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/**").authenticated()  // Requer autenticação para essas rotas
                .anyRequest().permitAll()  // Permite todas as outras requisições
            )
            .httpBasic();  // Usar autenticação básica

        return http.build();
    }
}
