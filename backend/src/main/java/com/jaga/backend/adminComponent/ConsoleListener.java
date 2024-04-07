package com.jaga.backend.adminComponent;

import com.jaga.backend.data.service.MessageSendingService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
@RequiredArgsConstructor
public class ConsoleListener implements CommandLineRunner {

    private final MessageSendingService messageSendingService; // предполагается, что у вас есть такой сервис

    @Override
    public void run(String... args) throws Exception {
        // Здесь можно добавить сканер для чтения команд из консоли
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a command in the format 'send [message] ?[destination]'");

        while (scanner.hasNextLine()) {
            String input = scanner.nextLine();
            if (input.startsWith("send ")) {
                // Парсим введенную строку, чтобы извлечь сообщение и, возможно, destination
                String[] parts = input.split("\\s+", 3); // Разделяем строку на части
                String message = parts.length > 1 ? parts[1] : "";
                String destination = parts.length > 2 ? parts[2] : "/asd"; // destination по умолчанию

                if (destination.startsWith("?")) {
                    // Убираем '?' из destination
                    destination = destination.substring(1);
                } else {
                    // Если '?' не указан, используем destination по умолчанию
                    destination = "/topic/public";
                }

                // Вызываем метод отправки сообщения
                messageSendingService.sendMessage(message, destination);
            } else {
                System.out.println("Invalid command format. Please use 'send [message] ?[destination]'");
            }
        }
    }

}
