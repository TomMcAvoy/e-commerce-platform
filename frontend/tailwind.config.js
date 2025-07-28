/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'50': '#eff6ff',
  				'100': '#dbeafe',
  				'200': '#bfdbfe',
  				'300': '#93c5fd',
  				'400': '#60a5fa',
  				'500': '#3b82f6',
  				'600': '#2563eb',
  				'700': '#1d4ed8',
  				'800': '#1e40af',
  				'900': '#1e3a8a'
  			},
  			security: {
  				electronics: {
  					from: 'from-blue-600',
  					to: 'to-cyan-600',
  					bg: 'bg-blue-500'
  				},
  				tactical: {
  					from: 'from-slate-700',
  					to: 'to-gray-800',
  					bg: 'bg-slate-600'
  				},
  				surveillance: {
  					from: 'from-purple-600',
  					to: 'to-indigo-600',
  					bg: 'bg-purple-500'
  				},
  				communications: {
  					from: 'from-green-600',
  					to: 'to-emerald-600',
  					bg: 'bg-green-500'
  				},
  				protective: {
  					from: 'from-orange-600',
  					to: 'to-red-600',
  					bg: 'bg-orange-500'
  				},
  				medical: {
  					from: 'from-red-600',
  					to: 'to-pink-600',
  					bg: 'bg-red-500'
  				},
  				training: {
  					from: 'from-yellow-600',
  					to: 'to-amber-600',
  					bg: 'bg-yellow-500'
  				},
  				automotive: {
  					from: 'from-gray-700',
  					to: 'to-slate-800',
  					bg: 'bg-gray-600'
  				}
  			},
  			mens: {
  				'50': '#f8fafc',
  				'500': '#475569',
  				'600': '#334155',
  				'700': '#1e293b'
  			},
  			sports: {
  				'50': '#f0fdf4',
  				'100': '#dcfce7',
  				'200': '#bbf7d0',
  				'300': '#86efac',
  				'400': '#4ade80',
  				'500': '#22c55e',
  				'600': '#16a34a',
  				'700': '#15803d',
  				'800': '#166534',
  				'900': '#14532d'
  			},
  			hardware: {
  				'50': '#fef2f2',
  				'500': '#ef4444',
  				'600': '#dc2626',
  				'700': '#b91c1c'
  			},
  			social: {
  				'50': '#f0f9ff',
  				'500': '#0ea5e9',
  				'600': '#0284c7',
  				'700': '#0369a1'
  			},
  			affiliate: {
  				'50': '#fdf4ff',
  				'500': '#c084fc',
  				'600': '#a855f7',
  				'700': '#9333ea'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Poppins',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		animation: {
  			blob: 'blob 7s infinite',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'bounce-slow': 'bounce 2s infinite'
  		},
  		keyframes: {
  			blob: {
  				'0%': {
  					transform: 'translate(0px, 0px) scale(1)'
  				},
  				'33%': {
  					transform: 'translate(30px, -50px) scale(1.1)'
  				},
  				'66%': {
  					transform: 'translate(-20px, 20px) scale(0.9)'
  				},
  				'100%': {
  					transform: 'translate(0px, 0px) scale(1)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
