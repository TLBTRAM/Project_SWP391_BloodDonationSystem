package com.swp.blooddonation.dto.request;

import java.time.LocalDate;

public class ManualBloodUnitRequest {
    private String bloodType;
    private String rhType;
    private int totalVolume;
    private LocalDate collectedDate;
    private LocalDate expirationDate;

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getRhType() { return rhType; }
    public void setRhType(String rhType) { this.rhType = rhType; }
    public int getTotalVolume() { return totalVolume; }
    public void setTotalVolume(int totalVolume) { this.totalVolume = totalVolume; }
    public LocalDate getCollectedDate() { return collectedDate; }
    public void setCollectedDate(LocalDate collectedDate) { this.collectedDate = collectedDate; }
    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }
} 