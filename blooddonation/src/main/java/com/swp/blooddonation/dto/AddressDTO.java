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
//    private String wardName;


    @NotNull(message = "Quận / huyện không được để trống")
    private Long districtId;
//    private String districtName;


    @NotNull(message = "Tỉnh / thành phố không được để trống")

    private Long provinceId;
//    private String provinceName;


}
