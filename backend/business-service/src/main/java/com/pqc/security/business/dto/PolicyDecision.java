package com.pqc.security.business.dto;

public record PolicyDecision(
        String decisionId,
        String inputRiskLevel,
        String effectiveRiskLevel,
        double riskScore,
        String riskExplanation,
        String selectedMode,
        String algorithmProfile,
        String reason,
        String policyVersion,
        String modelVersion,
        String correlationId) {
}
