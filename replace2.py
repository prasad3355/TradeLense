import os

fpath = 'src/components/LandingView.tsx'
with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

to_replace = [
    (
        '<a data-pricing-element="cta" className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-cream text-xs font-bold uppercase tracking-wider text-center block transition-colors" href="#dashboard">\n              Start Free\n            </a>',
        '<Link data-pricing-element="cta" className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-cream text-xs font-bold uppercase tracking-wider text-center block transition-colors" to="/login">\n              Start Free\n            </Link>'
    ),
    (
        '<a data-pricing-element="cta" className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] text-white text-xs font-bold font-mono uppercase tracking-wider text-center block shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all" href="#dashboard">Get Started Pro</a>',
        '<Link data-pricing-element="cta" className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] text-white text-xs font-bold font-mono uppercase tracking-wider text-center block shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all" to="/login">Get Started Pro</Link>'
    ),
    (
        '<a className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/20 transition-all duration-200" href="#dashboard">Get Started Free</a>',
        '<Link className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/20 transition-all duration-200" to="/login">Get Started Free</Link>'
    )
]

for orig, repl in to_replace:
    if orig in text:
        text = text.replace(orig, repl)
        print("Replaced additional block!")
    else:
        print("Additional block not found!")

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(text)
