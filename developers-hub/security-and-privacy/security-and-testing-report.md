---
sidebar_position: 2
description: This report demonstrates that the Intmax network has undergone thorough audits and testing, providing a clear basis for end-users to rely on its security.
---

# Security and Testing Report

This report demonstrates that the Intmax network has undergone thorough audits and testing, providing a clear basis for end-users to rely on its security. Intmax is engineered as a Layer-2 ZK Rollup with safety and reliability as top priorities. Accordingly, in addition to external audits of both its ZKP system and smart contracts, we have carried out a range of performance and fault-scenario tests. The following pages summarize those audit and testing results and explain the network’s robustness for users.

## Security Audits

Intmax underwent an exhaustive security audit by [ChainSecurity](https://www.chainsecurity.com/), a highly regarded firm that has reviewed many leading blockchain projects since 2017. The audit covered two principal areas.

### ZKP Circuit Audit

Specialists scrutinized Intmax’s ZKP circuits—the core of the rollup—and the related algorithms. The scope included the proof-generation logic and circuit design. ChainSecurity confirmed that proofs are generated and verified correctly, ensuring no forged proof can compromise network integrity. They also examined the entire proving system to rule out vulnerabilities such as counterfeit proofs or acceptance of invalid transactions.

Several improvement points were raised for the ZKP module; we addressed them immediately and **all issues are now fully resolved**. ChainSecurity’s report details every finding and the corresponding fixes. No known security issues remain outstanding.

### Smart-Contract Audit

ChainSecurity also audited the smart-contract suite that underpins the Intmax network. Targets included the core rollup contracts—deposit/withdrawal bridge, state-management logic, ZKP verification—and the surrounding auxiliary contracts. Line-by-line code review covered generic risks (privilege errors, re-entrancy, integer overflows) as well as rollup-specific logic flaws.

Particular attention was paid to the bridge contract linking Ethereum and Intmax, verifying that asset transfers and unlocks are validated correctly. The auditors confirmed that no invalid transactions or state transitions can be accepted and that only ZKP-verified updates are applied.

Although a few issues were identified, **all contract-level vulnerabilities have been remediated**. ChainSecurity’s report lists every finding and fix, and the Intmax team supplements these external reviews with rigorous internal code review and unit testing before each release.

For full details, please refer to the ChainSecurity audit PDF.

- **ZKP Circuits Audit Report**
  - [Read the full audit by ChainSecurity](https://www.chainsecurity.com/security-audit/intmax-2-zkp-circuits) – Covers the integrity and correctness of zero-knowledge proof generation and validation.

- **Smart Contracts Audit Report**
  - [Read the full audit by ChainSecurity](https://www.chainsecurity.com/security-audit/intmax-2-smart-contracts) – Reviews the security and robustness of core smart contracts deployed on INTMAX.

## Load-Testing Report

To evaluate scalability and stability, we performed load tests that simulated peak transaction volumes and measured maximum throughput and latency.

### Peak Test

- A large burst of transactions was submitted within a span of several minutes to measure transactions per second (TPS). By gradually increasing the submission rate, we observed the network approaching its capacity threshold.
- Even under peak load, no critical errors occurred; block production and verification continued uninterrupted.

### Sustained-Load Test

- High—but below-peak—load was maintained for more than 24 hours to assess long-term stability.
- Transaction latency rose in line with concurrent access, yet all transactions were finalized successfully, and normal performance returned once the load subsided.

These results show that Intmax can reliably process transactions under sustained load and point to further avenues for throughput optimization. Detailed metrics are provided in the accompanying load-test report.

[View Load Testing Report](./load-testing-report.md)

## Fault-Scenario Testing

We subjected the network to abnormal and adversarial scenarios to validate its resilience.

### Malicious Data Submission

- We attempted to submit tampered ZK proofs on-chain.
- All invalid transactions were correctly rejected, confirming that the ZKP verification layer maintains network consistency.

### Resource-Exhaustion Scenario

- Excessive transaction requests and computational demand were generated to saturate node CPU and memory.
- An automatic throttling mechanism activated when resource limits were reached, maintaining stability. No data inconsistency or network outage occurred. Although transaction delays can arise during overload, we are refining the system to minimize user impact.

These tests confirm that Intmax tolerates a wide range of failure modes. Even in the unlikely event of a severe incident, on-chain records and per-user backups enable state recovery. Real-time anomaly monitoring and alerting are in place, ensuring swift incident response and providing users with confidence that safety is preserved.

## Ongoing Security Initiatives

Security and reliability improvements continue beyond the audits and tests outlined above. Following industry best practices, we maintain a **continuous monitoring and improvement cycle**:

- **Bug-bounty program:** Incentivizes external researchers to disclose vulnerabilities promptly, strengthening security through community participation.
- **Regular follow-up audits:** Major upgrades or new features trigger additional third-party reviews—spot audits of code diffs or re-audits of critical components—to uphold the latest security standards.
- **Network monitoring & incident response:** 24/7 monitoring with predefined response procedures and simulation drills ensures rapid mitigation and recovery should an incident occur.

These measures keep Intmax secure well after launch.

## Conclusion

This report has outlined the audits and tests conducted to ensure Intmax’s safety and reliability. ChainSecurity’s meticulous review of the ZKP circuits and smart contracts confirmed the absence of critical vulnerabilities. Load tests revealed some challenges under extreme transaction volumes that will be addressed in future optimizations, while fault-scenario tests demonstrated robustness against diverse failures. Continuous monitoring, bug bounties, and periodic audits will uphold and enhance security levels in production.

The Intmax team remains dedicated to providing a dependable Layer-2 platform and will keep evolving in line with industry best practices. We invite users to enjoy Intmax with confidence.
