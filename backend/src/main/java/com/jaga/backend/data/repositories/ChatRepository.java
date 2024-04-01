package com.jaga.backend.data.repositories;

import com.jaga.backend.data.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;


@Repository
@EnableJpaRepositories
public interface ChatRepository extends JpaRepository<Chat, Long> {

}
