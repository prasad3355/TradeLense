import os

fpath = 'src/components/LandingView.tsx'
with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

if 'import { Link } from' not in text:
    text = text.replace('import { useRef } from "react";', 'import { useRef } from "react";\nimport { Link } from "react-router-dom";')

to_replace = [
    (
        '<a className="text-sm font-medium text-slate-300 hover:text-cream transition-colors" href="#dashboard">\n              Log In\n            </a>',
        '<Link className="text-sm font-medium text-slate-300 hover:text-cream transition-colors" to="/login">\n              Log In\n            </Link>'
    ),
    (
        '<a className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-electricViolet to-softPink hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/10 transition-all duration-200" href="#dashboard">\n              <span>Get Started</span>\n              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">\n                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />\n              </svg>\n            </a>',
        '<Link className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-electricViolet to-softPink hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/10 transition-all duration-200" to="/login">\n              <span>Get Started</span>\n              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">\n                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />\n              </svg>\n            </Link>'
    ),
    (
        '<a className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-cyan-glow text-obsidian-950 hover:bg-cyan-bright transition-all duration-200 cyan-glow-sm hover:scale-[1.02] active:scale-[0.98] text-center shadow-lg shadow-cyan-glow/20" href="#dashboard">\n              Start Journaling\n            </a>',
        '<Link className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-cyan-glow text-obsidian-950 hover:bg-cyan-bright transition-all duration-200 cyan-glow-sm hover:scale-[1.02] active:scale-[0.98] text-center shadow-lg shadow-cyan-glow/20" to="/login">\n              Start Journaling\n            </Link>'
    )
]

for orig, repl in to_replace:
    if orig in text:
        text = text.replace(orig, repl)
        print("Replaced one block!")
    else:
        print("Block not found!")

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(text)
