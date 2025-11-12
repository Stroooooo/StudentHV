package com.api.api.dto;

public class AuthDTO {
    private String username;
    private String password;
    
    public AuthDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }
}
