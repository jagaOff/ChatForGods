package com.jaga.backend.data.repositories;

import com.jaga.backend.data.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
@EnableJpaRepositories
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findAllByUsername(String username);

    /*@Query("SELECT u.username FROM User u WHERE u.username LIKE %:query%")
    List<User> findAllUsersByQuery(@Param("query") String query);*/

    @Query("SELECT u FROM User u WHERE u.username LIKE %:query%")
    List<User> findAllUsersByQuery(@Param("query") String query);

}
