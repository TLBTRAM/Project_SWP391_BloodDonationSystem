package com.swp.blooddonation.enums;



public enum BloodUnitStatus {
    COLLECTED,    // Túi máu nguyên vẹn, sẵn sàng sử dụng
    RESERVED,     // Đã được giữ cho 1 yêu cầu truyền máu
    USED,         // Đã sử dụng
    SEPARATED,    // Đã tách thành phần
    EXPIRED,      // Quá hạn
    NEARLY_EXPIRED // Gần hết hạn
}
