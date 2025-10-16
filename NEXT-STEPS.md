# Next Steps - CALM Architecture Restructuring

## Immediate Actions Required

### 1. Validation & Testing
```bash
# Test with CALM tooling (if available)
calm validate experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json

# Test in VS Code CALM Preview
# Open file in VS Code with CALM extension installed
# Should not show errors (unlike previous version)
```

### 2. Review Control Metadata
Some controls are missing complete metadata. Review and update:
- `reference-url` fields (many are empty)
- `threats-mitigated` arrays (some are empty)
- Populate from FINOS AIR framework documentation

Example files to update:
- `controls/configurations/air-prev-003-config.json` (missing reference-url)
- `controls/configurations/air-prev-018-config.json` (missing reference-url)
- `controls/configurations/air-prev-020-config.json` (missing reference-url)

### 3. Decide on PR #6 Integration

**Option A: Merge and Update** (Recommended)
```bash
# Switch to PR #6 branch
git checkout cursor/prepare-osff-workshop-documentation-and-controls-6d21

# Merge restructuring changes
git merge cursor/review-and-restructure-calm-architecture-for-controls-0a5d

# Update workshop files to reference restructured CALM
# Update: OSFF Workshop Prep/README.md
# Update: OSFF Workshop Prep/MCP-Architecture-Augmentation-Guide.md
```

**Option B: Separate PRs**
- Keep restructuring separate
- Reference from PR #6 as "production-ready evolution"
- Use as teaching tool in workshop

### 4. Generate Docusaurus Documentation
```bash
# Generate documentation portal
calm docify experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json

# Install and run
cd website && npm install && npm run start

# Customize for workshop
# - Add MCP-specific branding
# - Cross-reference controls
# - Add threat-to-control mapping
```

## Files to Review

### New Files Created:
1. `controls/requirements/air-control-requirement.json` - Control schema
2. `controls/configurations/*.json` - 17 control configs
3. `file-mappings.json` - Tooling mappings
4. `experimental-aigf-embedded-controls-enterprise-mcp-reference-restructured.calm.json` - Restructured CALM
5. `PR7-FEEDBACK-ANALYSIS.md` - Analysis document
6. `RESTRUCTURING-SUMMARY.md` - Summary document
7. `FINAL-REPORT.md` - Comprehensive report
8. `NEXT-STEPS.md` - This file

### Modified Files:
1. `experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json` - Updated with restructured version

## Questions for Maintainer

1. **Control Naming**: Confirm AIR-PREV-018, AIR-PREV-020, AIR-DET-021 naming is correct (vs MI-18, MI-20, MI-21)

2. **Reference URLs**: Confirm canonical URL scheme:
   - `https://air-governance-framework.finos.org/calm/{CONTROL-ID}`

3. **Docusaurus**: Include in this PR or separate follow-up?

4. **PR #6 Integration**: Which integration strategy to use?

## Workshop Preparation

### For OSFF Workshop:

1. **Update Documentation**
   - Add controls migration guide
   - Document new structure benefits
   - Prepare demo of CALM tooling

2. **Prepare Demos**
   - Show VS Code CALM Preview (working now!)
   - Demonstrate control externalization
   - Walk through file mappings

3. **Create Exercises**
   - Add new control exercise
   - Modify existing control exercise
   - Generate Docusaurus docs exercise

## Success Criteria

- [ ] CALM validation passes
- [ ] VS Code CALM Preview works without errors
- [ ] All controls have complete metadata
- [ ] Docusaurus portal generated successfully
- [ ] PR #6 integration completed
- [ ] Workshop materials updated
- [ ] Maintainer questions answered

## Timeline

**Immediate** (Today):
- Review this document
- Validate CALM file
- Answer maintainer questions

**Short-term** (This week):
- Complete metadata for controls
- Generate Docusaurus portal
- Integrate with PR #6

**Before Workshop**:
- Update all workshop materials
- Test all demos
- Prepare exercises

## Support Resources

- **CALM Spec**: https://github.com/finos/architecture-as-code
- **FINOS AIR**: https://air-governance-framework.finos.org/
- **PR #7 Feedback**: https://github.com/karlmoll/codegen_sandbox/pull/7
- **PR #6 Context**: https://github.com/karlmoll/codegen_sandbox/pull/6

## Contact

For questions about this restructuring:
- Review `FINAL-REPORT.md` for comprehensive details
- Review `PR7-FEEDBACK-ANALYSIS.md` for conflict analysis
- Review `RESTRUCTURING-SUMMARY.md` for technical summary
