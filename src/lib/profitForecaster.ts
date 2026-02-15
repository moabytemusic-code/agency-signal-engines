import {
    ProfitForecasterInput,
    ProfitForecasterResult,
    ProfitMetrics,
    ProfitTargets,
    RiskRating,
    Insight,
} from "./types";

export function calculateProfitForecast(
    input: Required<ProfitForecasterInput>
): ProfitForecasterResult {
    const {
        ad_budget,
        cpc,
        conversion_rate,
        aov,
        gross_margin,
        agency_retainer,
        target_profit,
    } = input;

    // clicks = ad_budget / cpc
    const clicks = ad_budget / cpc;

    // conversions = clicks * conversion_rate
    const conversions = clicks * conversion_rate;

    // revenue = conversions * aov
    const revenue = conversions * aov;

    // gross_profit = revenue * gross_margin
    const gross_profit = revenue * gross_margin;

    // net_profit_before_retainer = gross_profit - ad_budget
    const net_profit_before_retainer = gross_profit - ad_budget;

    // net_profit_after_retainer = net_profit_before_retainer - agency_retainer
    const net_profit_after_retainer = net_profit_before_retainer - agency_retainer;

    // cpa = ad_budget / max(conversions, 0.0000001)
    const cpa = ad_budget / Math.max(conversions, 0.0000001);

    // breakeven_cpa = aov * gross_margin
    const breakeven_cpa = aov * gross_margin;

    // breakeven_roas = 1 / gross_margin
    // if gross_margin is 1, breakeven_roas is 1. If 0.5, it is 2.
    const breakeven_roas = 1 / gross_margin;

    // roas = revenue / ad_budget
    const roas = revenue / ad_budget;

    // required_revenue_for_target = ad_budget + agency_retainer + target_profit
    const required_revenue_for_target =
        ad_budget + agency_retainer + target_profit;

    // required_conversions_for_target = required_revenue_for_target / max(aov * gross_margin, 0.0000001)
    const required_conversions_for_target =
        required_revenue_for_target / Math.max(aov * gross_margin, 0.0000001);

    // required_cvr_for_target = required_conversions_for_target / max(clicks, 0.0000001)
    const required_cvr_for_target =
        required_conversions_for_target / Math.max(clicks, 0.0000001);

    // Risk Rating Logic
    // HIGH if conversions < 10 OR roas < breakeven_roas
    // MEDIUM if (10 <= conversions <= 30) OR roas within 10% above breakeven_roas
    // LOW otherwise
    let risk_rating: RiskRating = "LOW";

    // roas within 10% above breakeven_roas means: roas <= breakeven_roas * 1.10
    const roas_threshold = breakeven_roas * 1.1;

    if (conversions < 10 || roas < breakeven_roas) {
        risk_rating = "HIGH";
    } else if (
        (conversions >= 10 && conversions <= 30) ||
        (roas >= breakeven_roas && roas <= roas_threshold)
    ) {
        risk_rating = "MEDIUM";
    } else {
        risk_rating = "LOW";
    }

    const metrics: ProfitMetrics = {
        clicks: Number(clicks.toFixed(2)),
        conversions: Number(conversions.toFixed(2)),
        revenue: Number(revenue.toFixed(2)),
        gross_profit: Number(gross_profit.toFixed(2)),
        net_profit_before_retainer: Number(net_profit_before_retainer.toFixed(2)),
        net_profit_after_retainer: Number(net_profit_after_retainer.toFixed(2)),
        cpa: Number(cpa.toFixed(2)),
        breakeven_cpa: Number(breakeven_cpa.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        breakeven_roas: Number(breakeven_roas.toFixed(4)), // usually keep precision for ROAS
    };

    const targets: ProfitTargets = {
        required_revenue_for_target: Number(required_revenue_for_target.toFixed(2)),
        required_conversions_for_target: Number(
            required_conversions_for_target.toFixed(2)
        ),
        required_cvr_for_target: Number(required_cvr_for_target.toFixed(4)),
    };

    // Insights Logic
    const insights: Insight[] = [];

    // Insight 1: ROAS vs Breakeven
    if (roas < breakeven_roas) {
        insights.push({
            type: "WARNING",
            text: `Current ROAS (${roas.toFixed(2)}) is below the Break-even ROAS (${breakeven_roas.toFixed(2)}), indicating a loss on ad spend.`,
        });
    } else if (roas < roas_threshold) {
        insights.push({
            type: "WARNING",
            text: `ROAS (${roas.toFixed(2)}) is close to break-even (${breakeven_roas.toFixed(2)}). Margins are thin.`,
        });
    } else {
        insights.push({
            type: "NOTE",
            text: `ROAS (${roas.toFixed(2)}) is healthy above break-even (${breakeven_roas.toFixed(2)}).`,
        });
    }

    // Insight 2: CPA vs Target
    if (cpa > breakeven_cpa) {
        insights.push({
            type: "WARNING",
            text: `CPA ($${cpa.toFixed(2)}) exceeds Break-even CPA ($${breakeven_cpa.toFixed(2)}). Ad costs are too high relative to margin.`,
        });
    }

    // Insight 3: Volume / Stat Sig
    if (conversions < 10) {
        insights.push({
            type: "NOTE",
            text: `Volume is low (${conversions.toFixed(1)} conversions). Statistical significance is weak; risk of variance is high.`,
        });
    }

    // Insight 4: Target Feasibility
    if (required_cvr_for_target > conversion_rate * 2) {
        insights.push({
            type: "ACTION",
            text: `To reach $${target_profit} profit, you need a CVR of ${(required_cvr_for_target * 100).toFixed(2)}% (currently ${(conversion_rate * 100).toFixed(2)}%). This is a simpler optimization path than cutting CPC.`,
        });
    } else if (required_cvr_for_target > conversion_rate) {
        insights.push({
            type: "ACTION",
            text: `To achieve $${target_profit} profit, Conversion Rate must improve from ${(conversion_rate * 100).toFixed(2)}% to ~${(required_cvr_for_target * 100).toFixed(2)}% at current CPC.`,
        });
    } else {
        insights.push({
            type: "NOTE",
            text: `You are on track to exceed your target profit of $${target_profit} at current metrics.`,
        });
    }

    // Limit insights to max 6
    return {
        inputs_sanitized: input,
        metrics,
        targets,
        insights: insights.slice(0, 6),
        risk_rating,
    };
}
