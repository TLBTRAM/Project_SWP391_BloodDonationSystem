package com.swp.blooddonation.exception;

import com.swp.blooddonation.exception.exceptions.ResetPasswordException;
import com.swp.blooddonation.exception.exceptions.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice // cái này dùng để đánh dấu đây là ValidationHandler
public class ValidationHandler {

    // MethodArgumentNotValidException: là cái lỗi khi nhập sai
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidation (MethodArgumentNotValidException exception){
        String massage = "Người dùng nhập chưa đúng thông tin ";

        // Cứ mỗi thuộc tính lỗi => gắn vào biến message
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            // Name, Id, Score
            massage += fieldError.getField() + ": " + fieldError.getDefaultMessage() + "\n";
        }
        return new ResponseEntity(massage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity hadlerAuthenticationException(AuthenticationException exception) {
        return new ResponseEntity(exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResetPasswordException.class)
    public ResponseEntity handleResetPasswordException(ResetPasswordException exception) {
        return new ResponseEntity(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

