package com.api.api.services;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.api.api.helpers.ActiveDirectory;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {
    private final ActiveDirectory directory;
    
    public AuthService(ActiveDirectory ad) { 
        this.directory = ad;
    }
    
    public Map<String, String> login(String username, String password) {
        return directory.authenticate(username, password);
    }

    public Map<String, String> verify(String token) {
        return directory.verifyJWT(token);
    }

    public Map<String, String> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwt-token", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        
        response.addCookie(jwtCookie);
        
        return Map.of("message", "Logged out successfully");
    }
}
