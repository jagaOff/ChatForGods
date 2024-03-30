package com.jaga.backend.entity.user;

import lombok.*;

import java.util.ArrayList;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private long id;

    private String userName;

    private char[] password;

    private ArrayList<Long> chatList;

    private boolean isAdmin;

    


}
