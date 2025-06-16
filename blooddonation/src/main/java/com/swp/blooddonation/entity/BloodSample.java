package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class BloodSample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã mẫu máu duy nhất: ví dụ "SMP-DNR001-20250616"
    @Column(unique = true, nullable = false)
    private String sampleCode;

    // Ngày lấy mẫu
    private LocalDate sampleDate;

    // Tổng thể tích mẫu máu (ml)
    private int totalVolume;

    // Trạng thái mẫu: Processing, Tested, Rejected, Stored
    private String status;

    // Vị trí lưu trữ mẫu (nếu còn lưu trữ)
    private String storageLocation;

    // Ghi chú thêm nếu có
    private String note;

    // Người hiến máu
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    // Nhân viên y tế lấy mẫu
    @ManyToOne
    @JoinColumn(name = "collected_by")
    private MedicalStaff collectedBy;

    // Kết quả xét nghiệm
    @OneToOne(mappedBy = "sample", cascade = CascadeType.ALL)
    private TestResult testResult;

    // Danh sách các túi máu tạo từ mẫu này
    @OneToMany(mappedBy = "sample", cascade = CascadeType.ALL)
    private List<BloodUnit> bloodUnits;
}
