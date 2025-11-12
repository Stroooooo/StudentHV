package com.api.api.controllers;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.api.api.dto.AuthDTO;
import com.api.api.services.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
@ResponseBody
@RequestMapping(value = "/api/v1/auth")
public class AuthController {
    private final AuthService service;
    
    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/authenticate")
    public Map<String, String> auth(
        @RequestBody AuthDTO authBody,
        HttpServletResponse response
    ) {
        Map<String, String> data = service.login(
            authBody.getUsername(), 
            authBody.getPassword()
        );
        
        if (data == null || !data.containsKey("cookie")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return Map.of("error", "Authentication failed");
        }
        
        Cookie jwtCookie = new Cookie("jwt-token", data.get("cookie"));
        jwtCookie.setHttpOnly(true); 
        jwtCookie.setSecure(false); 
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(14400);
        
        String cookieHeader = String.format(
            "%s=%s; Path=%s; Max-Age=%d; HttpOnly; SameSite=Lax",
            "jwt-token",
            data.get("cookie"),
            "/",
            14400
        );
        
        response.setHeader("Set-Cookie", cookieHeader);
        data.remove("cookie");
        return data;
    }

    @GetMapping("/authenticated")
    public Map<String, String> getAuthenticated(@CookieValue(name = "jwt-token") String cookieValue) {
        return service.verify(cookieValue);
    }

    @PostMapping("/logout")
    public Map<String, String> logout(HttpServletResponse response) {
        return service.logout(response);
    }
}
