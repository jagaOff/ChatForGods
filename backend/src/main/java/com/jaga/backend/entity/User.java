package com.jaga.backend.entity;


import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
//@Entity
public class User {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private char[] password;

//    @ManyToMany(mappedBy = "users")
    private Set<Chat> chats = new HashSet<>();

    private boolean isAdmin;




}
