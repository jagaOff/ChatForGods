package com.jaga.backend.data.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;

public record ErrorDto(
        @JsonProperty("message") String message,
        @JsonIgnore String destination,
        @JsonProperty("status") int status
) {
}