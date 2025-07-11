package com.swp.blooddonation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressDTO {

    @NotBlank(message = "Số nhà / đường không được để trống")
    private String street;

    @NotNull(message = "Phường / xã không được để trống")
    private Long wardId;

    @NotNull(message = "Quận / huyện không được để trống")
    private Long districtId;

    @NotNull(message = "Tỉnh / thành phố không được để trống")
    private Long provinceId;
}
