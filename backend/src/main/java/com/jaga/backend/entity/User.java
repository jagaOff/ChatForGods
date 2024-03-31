package com.jaga.backend.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    private Long id;

    private String userName;

    private char[] password;

    @ManyToMany(mappedBy = "users")
    private Set<Chat> chats = new HashSet<>();

    private boolean isAdmin;




}
