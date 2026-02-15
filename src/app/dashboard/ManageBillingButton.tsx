"use client";

import { useState } from "react";

export default function ManageBillingButton() {
    const [loading, setLoading] = useState(false);

    const handleManageBilling = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Failed to load billing portal.");
            }
        } catch (error) {
            console.error("Portal error:", error);
            alert("Error loading billing portal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleManageBilling}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
            {loading ? "Loading..." : "Manage Billing"}
        </button>
    );
}
