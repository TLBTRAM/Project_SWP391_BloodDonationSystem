package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.BlogRequest;
import com.swp.blooddonation.dto.response.BlogResponse;
import com.swp.blooddonation.entity.Blog;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.BlogRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final AuthenticationService authenticationService;

    @Autowired
    private ModelMapper modelMapper;

    // Tạo blog mới
    @Transactional
    public BlogResponse createBlog(BlogRequest blogRequest) {
        Account currentUser = authenticationService.getCurrentAccount();

        Blog blog = new Blog();
        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        blog.setAccount(currentUser);
        blog.setCreatedDate(LocalDateTime.now());

        Blog savedBlog = blogRepository.save(blog);
        return convertToResponse(savedBlog);
    }

    // Lấy tất cả blog
    public List<BlogResponse> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAllByOrderByCreatedDateDesc();
        return blogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Lấy blog theo ID
    public BlogResponse getBlogById(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy blog với ID: " + blogId));
        return convertToResponse(blog);
    }

    // Lấy blog của user hiện tại
    public List<BlogResponse> getMyBlogs() {
        Account currentUser = authenticationService.getCurrentAccount();
        List<Blog> blogs = blogRepository.findByAccountOrderByCreatedDateDesc(currentUser);
        return blogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Cập nhật blog
    @Transactional
    public BlogResponse updateBlog(Long blogId, BlogRequest blogRequest) {
        Account currentUser = authenticationService.getCurrentAccount();
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy blog với ID: " + blogId));

        // Kiểm tra quyền sở hữu
        if (!Objects.equals(blog.getAccount().getId(), currentUser.getId())) {
            throw new BadRequestException("Bạn chỉ có thể xóa blog của chính mình");
        }

        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());

        Blog updatedBlog = blogRepository.save(blog);
        return convertToResponse(updatedBlog);
    }

    // Xóa blog
    @Transactional
    public void deleteBlog(Long blogId) {
        Account currentUser = authenticationService.getCurrentAccount();
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy blog với ID: " + blogId));

        // Kiểm tra quyền sở hữu
        if (!Objects.equals(blog.getAccount().getId(), currentUser.getId())) {
            throw new BadRequestException("Bạn chỉ có thể cập nhật blog của chính mình");
        }

        blogRepository.delete(blog);
    }

    // Tìm kiếm blog
    public List<BlogResponse> searchBlogs(String keyword) {
        List<Blog> blogs = blogRepository.searchBlogs(keyword);
        return blogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Chuyển đổi Blog entity sang BlogResponse
    private BlogResponse convertToResponse(Blog blog) {
        BlogResponse response = new BlogResponse();
        response.setBlogId(blog.getBlogId());
        response.setTitle(blog.getTitle());
        response.setContent(blog.getContent());
        response.setCreatedDate(blog.getCreatedDate());
        response.setAuthorName(blog.getAuthorName());
        response.setAuthorId(blog.getAuthorId());
        return response;
    }
}