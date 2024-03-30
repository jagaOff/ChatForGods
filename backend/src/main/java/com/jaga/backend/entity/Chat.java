package com.jaga.backend.entity;

import lombok.*;
import java.util.Map;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Chat {

    private long id;

    private Map<Long, Role> userList;

    private boolean visibility;



}
