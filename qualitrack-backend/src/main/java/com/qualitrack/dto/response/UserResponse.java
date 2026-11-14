
package com.qualitrack.dto.response;

import com.qualitrack.entity.Role;
import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String fullName,
    String email,
    Role role,
    LocalDateTime createdAt
) {
}
