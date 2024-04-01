package com.jaga.backend.data.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.security.PublicKey;
import java.util.Date;

@Getter
@Service
public class JwtService {


    private static final long EXPIRATION_TIME = 864000000; // 10 days

    @Value("${jwt.secret}")
    private String SECRET; //set secret key

    public String createToken(String username) {

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + EXPIRATION_TIME);

//        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(exp)
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        // ?
        try {
            Jwts.parser().verifyWith((SecretKey) getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            // Здесь можете логировать ошибку или детальнее разбираться с причиной невалидности
            return false;
        }
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /*public static Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getPublicSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }*/

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.SECRET);
            return Keys.hmacShaKeyFor(keyBytes);
    }

}
