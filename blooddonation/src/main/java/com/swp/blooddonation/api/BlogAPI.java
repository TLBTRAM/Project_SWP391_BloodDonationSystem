package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.BlogRequest;
import com.swp.blooddonation.dto.response.BlogResponse;
import com.swp.blooddonation.service.BlogService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class BlogAPI {

    private final BlogService blogService;

    // Tạo blog mới (chỉ user đã đăng nhập)
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<BlogResponse> createBlog(@Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse blog = blogService.createBlog(blogRequest);
        return ResponseEntity.ok(blog);
    }

    // Lấy tất cả blog (public)
    @GetMapping
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        List<BlogResponse> blogs = blogService.getAllBlogs();
        return ResponseEntity.ok(blogs);
    }

    // Lấy blog theo ID (public)
    @GetMapping("/{blogId}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long blogId) {
        BlogResponse blog = blogService.getBlogById(blogId);
        return ResponseEntity.ok(blog);
    }

    // Lấy blog của user hiện tại
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my-blogs")
    public ResponseEntity<List<BlogResponse>> getMyBlogs() {
        List<BlogResponse> blogs = blogService.getMyBlogs();
        return ResponseEntity.ok(blogs);
    }

    // Cập nhật blog (chỉ chủ sở hữu)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{blogId}")
    public ResponseEntity<BlogResponse> updateBlog(
            @PathVariable Long blogId,
            @Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse blog = blogService.updateBlog(blogId, blogRequest);
        return ResponseEntity.ok(blog);
    }

    // Xóa blog (chỉ chủ sở hữu)
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{blogId}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long blogId) {
        blogService.deleteBlog(blogId);
        return ResponseEntity.noContent().build();
    }

    // Tìm kiếm blog (public)
    @GetMapping("/search")
    public ResponseEntity<List<BlogResponse>> searchBlogs(@RequestParam String keyword) {
        List<BlogResponse> blogs = blogService.searchBlogs(keyword);
        return ResponseEntity.ok(blogs);
    }
}