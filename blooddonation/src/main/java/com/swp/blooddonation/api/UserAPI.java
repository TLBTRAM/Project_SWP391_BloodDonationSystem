package com.swp.blooddonation.api;

import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@SecurityRequirement(name = "api")
@CrossOrigin("*")

public class UserAPI {

    @Autowired
    AuthenticationReponsitory authenticationReponsitory;
//    @PostMapping
//    public ResponseEntity<User> createUser (@Valid @RequestBody User user){
//        User users = authenticationReponsitory.save(user);
//        return ResponseEntity.ok(users);
//    }

    @GetMapping
    public ResponseEntity<List<User>> getListUser(){
        System.out.println("List of user:");
        List<User> users = authenticationReponsitory.findAll();
        return ResponseEntity.ok(users);
    }
}
