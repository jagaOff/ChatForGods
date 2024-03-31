package com.jaga.backend.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(value = AccessLevel.NONE)
    private Long id;

    private String username;

    private char[] password;

    @ManyToMany(mappedBy = "users")
    private Set<Chat> chats = new HashSet<>();

    private boolean isAdmin;

    public User(String userName, char[] password, Set<Chat> chats, boolean isAdmin) {
        this.username = userName;
        this.password = password;
        this.chats = chats;
        this.isAdmin = isAdmin;
    }

}
