package com.swp.blooddonation.exception.exceptions;

public class AuthenticationException extends RuntimeException{

    public AuthenticationException(String message){
        super(message);
    }
}