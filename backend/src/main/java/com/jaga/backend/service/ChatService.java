package com.jaga.backend.service;

import com.jaga.backend.entity.Chat;
import com.jaga.backend.entity.User;
import com.jaga.backend.repositories.ChatRepository;
import com.jaga.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public Chat createChat(Long userId, Long user2Id) {
        User user1 = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(user2Id).orElseThrow(() -> new RuntimeException("User not found"));

        Chat chat = new Chat();
        chat.setUsers(new HashSet<>(Arrays.asList(user1, user2)));
        chat.setVisibility(true); // change this to false if you want to make the chat private

        return chatRepository.save(chat);
    }
}
