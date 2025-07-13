package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Blog;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Lấy tất cả blog theo thứ tự mới nhất
    List<Blog> findAllByOrderByCreatedDateDesc();

    // Lấy blog theo tác giả
    List<Blog> findByUserOrderByCreatedDateDesc(User user);


    // Tìm kiếm blog theo tiêu đề
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword% ORDER BY b.createdDate DESC")
    List<Blog> searchBlogs(@Param("keyword") String keyword);

}