package com.swp.blooddonation.exception;

import com.swp.blooddonation.exception.exceptions.ResetPasswordException;
import com.swp.blooddonation.exception.exceptions.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ValidationHandler {

    // ✅ Trả lỗi validate dạng JSON (phù hợp cho frontend)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        // Ví dụ: { "email": "Không được để trống", "password": "Phải dài ít nhất 6 ký tự" }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // ✅ Authentication Exception
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException exception) {
        return new ResponseEntity<>(Map.of("message", exception.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    // ✅ Reset Password Exception
    @ExceptionHandler(ResetPasswordException.class)
    public ResponseEntity<Map<String, String>> handleResetPasswordException(ResetPasswordException exception) {
        return new ResponseEntity<>(Map.of("message", exception.getMessage()), HttpStatus.BAD_REQUEST);
    }

    // ✅ RuntimeException (nếu bạn dùng throw new RuntimeException(...) như đăng ký email)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(Map.of("message", ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
