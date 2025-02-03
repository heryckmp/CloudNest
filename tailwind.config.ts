import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'100': '#3B82F6',
  				DEFAULT: '#3B82F6',
  				dark: {
  					'100': '#60A5FA',
  					DEFAULT: '#2563EB'
  				}
  			},
  			red: '#FD366E',
  			error: '#b80000',
  			green: '#3DD9B3',
  			blue: '#3B82F6',
  			pink: '#FD366E',
  			orange: '#F9AB72',
  			light: {
  				'100': '#F8FAFC',
  				'200': '#E2E8F0',
  				'300': '#CBD5E1',
  				'400': '#94A3B8'
  			},
  			dark: {
  				'100': '#1E293B',
  				'200': '#0F172A',
  				'300': '#1E293B',
  				'400': '#334155',
  				accent: {
  					'100': '#475569',
  					'200': '#64748B',
  					'300': '#94A3B8'
  				}
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
  			poppins: ["var(--font-poppins)"]
  		},
  		boxShadow: {
  			'drop-1': '0px 10px 30px 0px rgba(66, 71, 97, 0.1)',
  			'drop-2': '0 8px 30px 0 rgba(65, 89, 214, 0.3)',
  			'drop-3': '0 8px 30px 0 rgba(65, 89, 214, 0.1)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'caret-blink': {
  				'0%,70%,100%': {
  					opacity: '1'
  				},
  				'20%,50%': {
  					opacity: '0'
  				}
  			}
  		},
  		animation: {
  			'caret-blink': 'caret-blink 1.25s ease-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
