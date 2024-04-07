package com.jaga.backend.data.service;

import com.jaga.backend.data.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.IOException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.security.PublicKey;
import java.security.Security;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Service
public class JwtService {


    private static final long EXPIRATION_TIME = 864000000; // 10 days

    @Value("${jwt.secret}")
    private String SECRET; //set secret key


    // TODO isAdmin ++++
    /*public boolean getIsAdminFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("isAdmin", Boolean.class);
    }

    protected void filterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            if (jwtService.validateToken(token)) {
                String username = jwtService.extractAllClaims(token).getSubject();
                boolean isAdmin = jwtService.getIsAdminFromToken(token);

                List<GrantedAuthority> authorities = isAdmin ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN")) : List.of(new SimpleGrantedAuthority("ROLE_USER"));
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }*/

    //TODO create claims (username,  password, isAdmin)

    public String createToken(User user /*boolean isAdmin*/) {

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + EXPIRATION_TIME);

//        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);


        return Jwts.builder()
//                .id(UUID.fromString(user.getUsername()).toString())
                .subject(user.getUsername())
                .claim("username", user.getUsername())
                .claim("password", user.getPassword())
                .claim("isAdmin", user.isAdmin())
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
            //  логировать ошибку или детальнее разбираться с причиной невалидности
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
