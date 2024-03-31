package com.jaga.backend.entity;


import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
//@Entity
public class Chat {

    //Association 'com.jaga.backend.entity.Chat.usersId' targets the type 'java.lang.Long' which is not an '@Entity' type
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(value = AccessLevel.NONE)
    private Long id;

//    @ManyToMany
//    @JoinTable(
//            name = "chat_users",
//            joinColumns = @JoinColumn(name = "chat_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new HashSet<>();

    private boolean isPrivate;


}
