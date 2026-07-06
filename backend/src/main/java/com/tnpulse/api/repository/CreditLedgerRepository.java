package com.tnpulse.api.repository;

import com.tnpulse.api.model.CreditLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CreditLedgerRepository extends JpaRepository<CreditLedger, UUID> {
}
