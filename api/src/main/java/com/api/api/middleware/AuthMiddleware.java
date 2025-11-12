package com.api.api.middleware;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.api.api.helpers.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthMiddleware extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;

    public AuthMiddleware(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
        @SuppressWarnings("null") HttpServletRequest request,
        @SuppressWarnings("null") HttpServletResponse response,
        @SuppressWarnings("null") FilterChain filterChain
    ) throws ServletException, IOException {
        String jwt = extractJwtFromCookie(request);
        
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Map<String, String> validationResult = jwtUtil.validateTokenAndRetrieveSubject(jwt);
        
        if ("true".equals(validationResult.get("sucsess"))) {
            String username = validationResult.get("username");
            String displayName = validationResult.get("displayName");
            String isAdmin = validationResult.get("isAdmin");
            
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    new ArrayList<>()
                );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            
            request.setAttribute("username", username);
            request.setAttribute("displayName", displayName);
            request.setAttribute("isAdmin", isAdmin);
        }
        
        filterChain.doFilter(request, response);
    }

    private String extractJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt-token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}