package com.qualitrack.dto.response;

public record AuthResponse(
        Long id,
        String fullName,
        String email,
        String role,
        String token,
        String message
) {}