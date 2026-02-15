
import Link from "next/link";
import { Check, ArrowRight, Play, LineChart, FileText, MapPin, Target, Zap, Layers, Users } from "lucide-react";

export default function Home() {
  const DEMO_VIDEO_URL = "https://www.loom.com/embed/REPLACE_ME";

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans">
      {/* A) Top Nav (sticky) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <span className="text-blue-600">Agency</span>SignalEngines
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="md:hidden text-sm font-medium text-slate-600">Login</Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 1️⃣ HERO (Above Fold) - UPDATED v1.3.2 */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
              Close More Clients With <br className="hidden sm:block" />
              <span className="text-blue-600">Live ROI Modeling</span>
              <br className="hidden sm:block" />
              <span className="text-2xl sm:text-3xl text-slate-800 font-semibold block mt-4">— Built for Performance Agencies</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-10 sm:text-xl leading-relaxed font-medium">
              Forecast profitability in real time, generate conversion-ready ad scripts, and deliver SEO clusters instantly — all inside one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:-translate-y-0.5"
              >
                Start Free
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3.5 text-lg font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
              >
                <Play className="h-4 w-4 fill-current" /> Watch 5-Minute Demo
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">
                No spreadsheets. No guesswork. No generic AI output.
              </p>
              <p className="text-xs text-slate-400">
                Designed for agencies running Meta, Google, and TikTok ads.
              </p>
            </div>
          </div>
        </section>

        {/* 2️⃣ DEMO SECTION (Moved Up) */}
        <section id="demo" className="bg-slate-900 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">See How Agencies Use This in 5 Minutes</h2>
            <div className="relative aspect-video w-full rounded-2xl bg-slate-800 overflow-hidden shadow-2xl ring-1 ring-white/10 mx-auto">
              {DEMO_VIDEO_URL.includes("REPLACE_ME") ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-800">
                  <Play className="h-20 w-20 mb-6 opacity-40 hover:opacity-60 transition-opacity cursor-pointer" />
                  <span className="text-xl font-medium">Insert Loom Embed URL in DEMO_VIDEO_URL</span>
                </div>
              ) : (
                <iframe
                  src={DEMO_VIDEO_URL}
                  frameBorder="0"
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <p className="mt-6 text-slate-400 text-sm">
              Everything shown here runs inside your dashboard with server-enforced limits.
            </p>
          </div>
        </section>

        {/* 3️⃣ PROBLEM / OUTCOME SECTION */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Stop Losing Deals to Guesswork</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Card 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Model Profitability Live</h3>
                <p className="text-slate-600">Model profitability live on sales calls instead of estimating.</p>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Ship Ads Faster</h3>
                <p className="text-slate-600">Ship high-converting ad creative without creative bottlenecks.</p>
              </div>
              {/* Card 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Scale Local SEO</h3>
                <p className="text-slate-600">Offer local SEO deliverables without adding labor.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ HOW IT WORKS (NEW SECTION) */}
        <section className="bg-slate-50 py-16 sm:py-24 border-y border-slate-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-slate-600">This enhances your strategy — it doesn’t replace it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="absolute -top-5 left-8 bg-blue-600 text-white font-bold h-10 w-10 rounded-lg flex items-center justify-center shadow-md text-lg">1</div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 mb-3">Model Profitability</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enter budget, CPC, and conversion rate to instantly calculate break-even ROAS and target profit requirements.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="absolute -top-5 left-8 bg-blue-600 text-white font-bold h-10 w-10 rounded-lg flex items-center justify-center shadow-md text-lg">2</div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 mb-3">Generate Ads</h3>
                <p className="text-slate-600 leading-relaxed">
                  Produce structured hooks, scripts, objections, and compliant messaging for paid traffic.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="absolute -top-5 left-8 bg-blue-600 text-white font-bold h-10 w-10 rounded-lg flex items-center justify-center shadow-md text-lg">3</div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 mb-3">Build SEO Clusters</h3>
                <p className="text-slate-600 leading-relaxed">
                  Create a pillar page, 30–75 supporting articles, FAQs, and internal linking map in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ FEATURES (Shortened Copy) */}
        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-20">

            {/* Feature 1 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                  <LineChart className="h-4 w-4" /> Profit Forecaster
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Stop Selling on Vanity Metrics</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "Instant break-even ROAS & CPA calculation",
                    "Target profit modeling vs. ad spend",
                    "Risk rating & client feasibility check"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700 text-lg">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/profit-forecaster" className="text-blue-600 font-semibold hover:text-blue-500 inline-flex items-center gap-1 group">
                  Open Forecaster <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-10 lg:mt-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-8 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center shadow-inner">
                <LineChart className="h-24 w-24 text-slate-300" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 mt-10 lg:mt-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-8 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center shadow-inner">
                <FileText className="h-24 w-24 text-slate-300" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                  <FileText className="h-4 w-4" /> Ad Script Engine
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">High-Performing Creative, Fast</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "5 proven hook variations per angle",
                    "Direct response & Story-based structures",
                    "Built-in objection handling"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700 text-lg">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/ad-script-engine" className="text-blue-600 font-semibold hover:text-blue-500 inline-flex items-center gap-1 group">
                  Open Script Engine <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                  <MapPin className="h-4 w-4" /> Local SEO Cluster
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Dominate Local Search</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "Generate pillar page + 30–75 support articles",
                    "Semantic FAQ generation for relevance",
                    "Instant CSV export for implementation"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700 text-lg">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/local-seo-cluster" className="text-blue-600 font-semibold hover:text-blue-500 inline-flex items-center gap-1 group">
                  Open SEO Cluster <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-10 lg:mt-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-8 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center shadow-inner">
                <MapPin className="h-24 w-24 text-slate-300" />
              </div>
            </div>

          </div>
        </section>

        {/* 6️⃣ BUILT FOR (NEW SECTION) */}
        <section className="bg-slate-900 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">Built For</h2>
            <p className="text-lg text-slate-400 mb-12">If you sell performance, this was built for you.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Meta & Facebook Agencies",
                "Google PPC Agencies",
                "TikTok Performance Teams",
                "Local Lead Gen Agencies"
              ].map((item) => (
                <div key={item} className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center hover:bg-slate-750 transition-colors">
                  <Users className="h-8 w-8 text-blue-500 mb-4" />
                  <span className="text-white font-semibold text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7️⃣ PRICING PREVIEW */}
        <section id="pricing" className="py-20 sm:py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-slate-600">Choose the plan that fits your agency's scale.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* FREE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                  <p className="mt-4 text-sm text-slate-500">For solo exploration.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$0</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 5 Profit Forecasts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 5 Ad Scripts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 10 SEO Clusters / mo</li>
                  </ul>
                </div>
                <Link href="/signup" className="mt-8 block rounded-md bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100">
                  Start Free
                </Link>
              </div>

              {/* STARTER */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
                  <p className="mt-4 text-sm text-slate-500">For growing freelancers.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$79</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 50 Profit Forecasts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 50 Ad Scripts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 50 SEO Clusters / mo</li>
                  </ul>
                </div>
                <Link href="/pricing" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  Upgrade
                </Link>
              </div>

              {/* GROWTH */}
              <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-md flex flex-col justify-between scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Growth</h3>
                  <p className="mt-4 text-sm text-slate-500">For small agencies.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$149</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 200 Profit Forecasts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 200 Ad Scripts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> 200 SEO Clusters / mo</li>
                  </ul>
                </div>
                <Link href="/pricing" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  Upgrade
                </Link>
              </div>

              {/* WHITELABEL */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Whitelabel</h3>
                  <p className="mt-4 text-sm text-slate-500">For scaling agencies.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$249</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> Unlimited Usage</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> White-label PDF Exports</li>
                    <li className="flex gap-x-3"><Check className="h-5 w-5 flex-none text-blue-600" /> Priority Support</li>
                  </ul>
                </div>
                <Link href="/pricing" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  Upgrade
                </Link>
              </div>
            </div>

            <p className="mt-12 text-center text-sm text-slate-500 border-t border-slate-200 pt-8 max-w-sm mx-auto">
              Upgrade anytime. Manage billing securely inside Stripe.
            </p>
          </div>
        </section>

        {/* 8️⃣ FINAL CTA */}
        <section className="bg-blue-600 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Built for Agencies That Sell Performance.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-lg border border-white/30 bg-transparent px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg text-slate-900"><span className="text-blue-600">Agency</span>SignalEngines</span>
            <p className="text-sm text-slate-500 mt-1">© {new Date().getFullYear()} SignalEngines. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-slate-600">
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/login" className="hover:text-blue-600">Login</Link>
            <Link href="/signup" className="hover:text-blue-600">Start Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
