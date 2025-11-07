package com.api.api.helpers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(String username, String displayName, String isAdmin) throws IllegalArgumentException, JWTCreationException {
        return JWT.create()
            .withSubject("User Details")
            .withClaim("username", username)
            .withClaim("displayName", displayName)
            .withClaim("isAdmin", isAdmin)
            .withIssuedAt(new Date())
            .withIssuer("HYPERV")
            .sign(Algorithm.HMAC256(secret));
    }

    public Map<String, String> validateTokenAndRetrieveSubject(String token) {
        Map<String, String> verifyedReturn = new HashMap<>();

        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("HYPERV")
                .build();

            DecodedJWT jwt = verifier.verify(token);

            verifyedReturn.put("username", jwt.getClaim("username").asString());
            verifyedReturn.put("displayName", jwt.getClaim("displayName").asString());
            verifyedReturn.put("isAdmin", jwt.getClaim("isAdmin").asString());
            verifyedReturn.put("sucsess", "true");
            
            return verifyedReturn;            
        } catch (Exception e) {
            System.out.println(e);
            verifyedReturn.put("sucsess", "false");
            return verifyedReturn;
        }
    }
}