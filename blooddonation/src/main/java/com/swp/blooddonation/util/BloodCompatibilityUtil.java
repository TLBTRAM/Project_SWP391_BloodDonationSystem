package com.swp.blooddonation.util;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import java.util.*;

public class BloodCompatibilityUtil {
    // Truyền máu toàn phần và hồng cầu
    public static List<String> getCompatibleWholeBloodDonors(BloodType recipient, RhType rh) {
        List<String> result = new ArrayList<>();
        for (BloodType donorType : BloodType.values()) {
            for (RhType donorRh : RhType.values()) {
                if (isCompatibleWholeBlood(donorType, donorRh, recipient, rh)) {
                    result.add(donorType.name() + "-" + (donorRh == RhType.POSITIVE ? "+" : "-"));
                }
            }
        }
        return result;
    }

    // Logic mapping truyền máu toàn phần/hồng cầu
    private static boolean isCompatibleWholeBlood(BloodType donor, RhType donorRh, BloodType recipient, RhType recipientRh) {
        // Rh logic
        if (recipientRh == RhType.NEGATIVE && donorRh == RhType.POSITIVE) return false;
        // ABO logic
        switch (recipient) {
            case O:
                return donor == BloodType.O;
            case A:
                return donor == BloodType.O || donor == BloodType.A;
            case B:
                return donor == BloodType.O || donor == BloodType.B;
            case AB:
                return true;
        }
        return false;
    }

    // Hồng cầu: giống truyền toàn phần
    public static List<String> getCompatibleRedCellDonors(BloodType recipient, RhType rh) {
        return getCompatibleWholeBloodDonors(recipient, rh);
    }

    // Huyết tương: logic ngược lại
    public static List<String> getCompatiblePlasmaDonors(BloodType recipient, RhType rh) {
        List<String> result = new ArrayList<>();
        for (BloodType donorType : BloodType.values()) {
            for (RhType donorRh : RhType.values()) {
                if (isCompatiblePlasma(donorType, donorRh, recipient, rh)) {
                    result.add(donorType.name() + "-" + (donorRh == RhType.POSITIVE ? "+" : "-"));
                }
            }
        }
        return result;
    }

    private static boolean isCompatiblePlasma(BloodType donor, RhType donorRh, BloodType recipient, RhType recipientRh) {
        // Rh logic
        if (recipientRh == RhType.NEGATIVE && donorRh == RhType.POSITIVE) return false;
        // ABO logic (chuẩn y khoa)
        switch (recipient) {
            case AB:
                return donor == BloodType.AB;
            case A:
                return donor == BloodType.A || donor == BloodType.AB;
            case B:
                return donor == BloodType.B || donor == BloodType.AB;
            case O:
                return true;
        }
        return false;
    }

    // Tiểu cầu: thường dùng logic giống hồng cầu
    public static List<String> getCompatiblePlateletDonors(BloodType recipient, RhType rh) {
        return getCompatibleWholeBloodDonors(recipient, rh);
    }
} 