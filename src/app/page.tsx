
import Link from "next/link";
import { Check, ArrowRight, Play, LineChart, FileText, MapPin } from "lucide-react";

export default function Home() {
  const DEMO_VIDEO_URL = "https://www.loom.com/embed/REPLACE_ME";

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans">
      {/* A) Top Nav (sticky) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            {/* Simple logo icon or just text */}
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
        {/* B) Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
              Client Profit Intelligence for <br className="hidden sm:block" />
              <span className="text-blue-600">Performance Agencies</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-8 sm:text-xl">
              Forecast profitability live. Generate conversion-first ads. Build local SEO clusters instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Start Free
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Play className="h-4 w-4 fill-current" /> Watch Demo
              </Link>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Built for agencies running Meta, Google, and TikTok ads.
            </p>
          </div>
        </section>

        {/* C) Problem / Outcome */}
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Stop Guessing Profit</h3>
                <p className="text-slate-600">Stop guessing profitability on sales calls. Know your exact ROAS targets instantly.</p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ship Ads Faster</h3>
                <p className="text-slate-600">Ship ad creative faster with structured scripts designed for high conversion.</p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Scale Local SEO</h3>
                <p className="text-slate-600">Upsell local SEO without adding labor using automated cluster generation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* D) Features / Modules */}
        <section id="features" className="py-20 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">

            {/* Feature 1 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Profit Forecaster</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Instantly calculate the metrics that matter. Stop selling on vanity metrics and start selling on profit.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Break-even ROAS & CPA Calculation",
                    "Target profit requirements modeling",
                    "Risk rating + strategic insights"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/profit-forecaster" className="text-blue-600 font-semibold hover:text-blue-500 inline-flex items-center gap-1">
                  Open Profit Forecaster <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 lg:mt-0 rounded-2xl bg-slate-100 p-8 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center text-slate-400">
                {/* Placeholder or Screenshot */}
                <LineChart className="h-24 w-24 opacity-20" />
              </div>
            </div>

            {/* Feature 2 (Reversed) */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 mt-10 lg:mt-0 rounded-2xl bg-slate-100 p-8 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center text-slate-400">
                <FileText className="h-24 w-24 opacity-20" />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Ad Script Engine</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Generate high-performing ad scripts in seconds. Never start from a blank page again.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "5 proven hook variations per angle",
                    "2 full script structures (Direct & Story)",
                    "Built-in objection handling & compliance"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/ad-script-engine" className="text-blue-600 font-semibold hover:text-blue-500 inline-flex items-center gap-1">
                  Open Ad Script Engine <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Local SEO Cluster</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Dominate local search with comprehensive content clusters generated in one click.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Pillar page + 30–75 support pages",
                    "Semantic FAQ cluster generation",
                    "Internal link map + CSV export"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/local-seo-cluster" className="text-blue-600 font-semibold hover:text-blue-500 inline-flex items-center gap-1">
                  Open Local SEO Cluster <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 lg:mt-0 rounded-2xl bg-slate-100 p-8 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center text-slate-400">
                <MapPin className="h-24 w-24 opacity-20" />
              </div>
            </div>

          </div>
        </section>

        {/* E) Demo Section */}
        <section id="demo" className="bg-slate-900 py-20 sm:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-12">5-minute walkthrough</h2>
            <div className="relative aspect-video w-full rounded-2xl bg-slate-800 overflow-hidden shadow-2xl ring-1 ring-white/10">
              {DEMO_VIDEO_URL.includes("REPLACE_ME") ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <Play className="h-16 w-16 mb-4 opacity-50" />
                  <span className="text-lg font-medium">Add Loom embed URL</span>
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
          </div>
        </section>

        {/* F) Pricing Preview */}
        <section id="pricing" className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-slate-600">Choose the plan that fits your agency's scale.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* FREE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                  <p className="mt-4 text-sm text-slate-500">For solo exploration.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$0</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 5 Profit Forecasts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 5 Ad Scripts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 10 SEO Clusters / mo</li>
                  </ul>
                </div>
                <Link href="/signup" className="mt-8 block rounded-md bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100">
                  Start Free
                </Link>
              </div>

              {/* STARTER */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
                  <p className="mt-4 text-sm text-slate-500">For growing freelancers.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$79</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 50 Profit Forecasts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 50 Ad Scripts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 50 SEO Clusters / mo</li>
                  </ul>
                </div>
                <Link href="/pricing" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  Upgrade
                </Link>
              </div>

              {/* GROWTH */}
              <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-md flex flex-col justify-between">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
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
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 200 Profit Forecasts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 200 Ad Scripts / mo</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 200 SEO Clusters / mo</li>
                  </ul>
                </div>
                <Link href="/pricing" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  Upgrade
                </Link>
              </div>

              {/* WHITELABEL */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Whitelabel</h3>
                  <p className="mt-4 text-sm text-slate-500">For scaling agencies.</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$249</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> Unlimited Usage</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> White-label PDF Exports</li>
                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> Priority Support</li>
                  </ul>
                </div>
                <Link href="/pricing" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  Upgrade
                </Link>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Manage billing anytime in the customer portal.
            </p>
          </div>
        </section>

        {/* G) Final CTA */}
        <section className="bg-blue-600 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Built for agencies that sell performance.
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

      {/* H) Footer */}
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
