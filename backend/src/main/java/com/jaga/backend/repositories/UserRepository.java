package com.jaga.backend.repositories;

import com.jaga.backend.entity.User;
import org.springframework.stereotype.Repository;


//@Repository
public interface UserRepository  {

    // TODO add custom queries
    User findByUsername(String username);

}
