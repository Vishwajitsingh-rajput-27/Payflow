import { useState } from 'react';
import {
  Github,
  Smartphone,
  Copy,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  GitBranch,
  Zap,
  Settings,
  Play,
  Star,
  ArrowRight,
  Terminal,
  Package,
  Upload,
  Eye,
} from 'lucide-react';

interface DeployGuideProps {
  onNavigate: (page: string) => void;
}

const REPO_URL = 'https://github.com/vishwajitsingh-rajput-27/Payflow';
const LIVE_URL = 'https://vishwajitsingh-rajput-27.github.io/Payflow/';
const GITHUB_USER = 'vishwajitsingh-rajput-27';
const REPO_NAME = 'Payflow';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-white/10 hover:bg-white/20 text-white'
      }`}
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden mt-3 mb-1">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-xs ml-2 font-mono">{language}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function Step({
  number,
  icon: Icon,
  title,
  subtitle,
  children,
  color = 'indigo',
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  color?: string;
}) {
  const [open, setOpen] = useState(number <= 2);
  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500 to-purple-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-pink-600',
    teal: 'from-teal-500 to-cyan-600',
  };
  const gradient = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {number}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-0.5">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
        </div>
        <div className="flex-shrink-0">
          {open ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-5 border-t border-gray-50 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc, color }: { icon: React.ElementType; title: string; desc: string; color: string }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl ${color}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm opacity-80 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function DeployGuide({ onNavigate }: DeployGuideProps) {
  const [activeMethod, setActiveMethod] = useState<'github-actions' | 'manual'>('github-actions');

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 pt-8 pb-12 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Github className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Deploy to GitHub Pages
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base max-w-md mx-auto">
            Deploy <strong>Payflow</strong> live from your Android phone — no laptop needed!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            <a
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <Globe className="w-4 h-4" />
              View Live Demo
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/15 backdrop-blur text-white px-4 py-2.5 rounded-xl font-semibold text-sm border border-white/20 hover:bg-white/25 transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub Repo
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-6">

        {/* Live URL Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">🔗 Your Live URL</p>
          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-3">
            <Globe className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="text-indigo-700 font-mono text-sm break-all flex-1">{LIVE_URL}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(LIVE_URL).catch(() => {});
              }}
              className="flex-shrink-0 bg-indigo-500 text-white p-1.5 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">GitHub User</p>
              <p className="font-semibold text-sm text-gray-800 break-all">{GITHUB_USER}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Repository</p>
              <p className="font-semibold text-sm text-gray-800">{REPO_NAME}</p>
            </div>
          </div>
        </div>

        {/* Method Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">Choose Deployment Method:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveMethod('github-actions')}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                activeMethod === 'github-actions'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Zap className={`w-5 h-5 mb-1.5 ${activeMethod === 'github-actions' ? 'text-indigo-500' : 'text-gray-400'}`} />
              <p className={`font-bold text-sm ${activeMethod === 'github-actions' ? 'text-indigo-700' : 'text-gray-700'}`}>
                Auto Deploy
              </p>
              <p className="text-xs text-gray-400 mt-0.5">GitHub Actions</p>
              <span className="inline-block mt-1.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                ⭐ Recommended
              </span>
            </button>
            <button
              onClick={() => setActiveMethod('manual')}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                activeMethod === 'manual'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Terminal className={`w-5 h-5 mb-1.5 ${activeMethod === 'manual' ? 'text-orange-500' : 'text-gray-400'}`} />
              <p className={`font-bold text-sm ${activeMethod === 'manual' ? 'text-orange-700' : 'text-gray-700'}`}>
                Manual Deploy
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Termux / CLI</p>
              <span className="inline-block mt-1.5 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                For Termux
              </span>
            </button>
          </div>
        </div>

        {/* GitHub Actions Method */}
        {activeMethod === 'github-actions' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 mb-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-gray-800">Auto Deploy via GitHub Actions</h2>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              <p className="font-bold mb-1">✅ How it works</p>
              <p>Every time you push code to GitHub, the app <strong>automatically builds and deploys</strong> to GitHub Pages. No commands needed after setup!</p>
            </div>

            <Step number={1} icon={Github} title="Create GitHub Account" subtitle="Sign up at github.com (free)" color="indigo">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">If you don't have a GitHub account yet:</p>
                <a
                  href="https://github.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5" />
                    <span className="font-semibold text-sm">github.com/signup</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
                <InfoCard
                  icon={CheckCircle}
                  title="Already have an account?"
                  desc="Skip this step and go to Step 2."
                  color="bg-blue-50 text-blue-800"
                />
              </div>
            </Step>

            <Step number={2} icon={Package} title="Create New Repository" subtitle="Name it exactly: Payflow" color="blue">
              <div className="space-y-3">
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5" />
                    <span className="font-semibold text-sm">github.com/new</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
                <div className="space-y-2">
                  {[
                    { label: 'Repository name', value: 'Payflow', note: '⚠️ Must be exactly this!' },
                    { label: 'Visibility', value: 'Public ✅', note: 'Required for free Pages' },
                    { label: 'Initialize', value: 'No (leave unchecked)', note: '' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500">{item.label}: </span>
                        <span className="font-semibold text-sm text-gray-800">{item.value}</span>
                        {item.note && <p className="text-xs text-orange-600 mt-0.5">{item.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">Then click <strong>"Create repository"</strong>.</p>
              </div>
            </Step>

            <Step number={3} icon={Smartphone} title="Install GitHub Mobile App" subtitle="Upload files from your Android" color="green">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Install the GitHub app on your Android phone:</p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.github.android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-sm">GitHub for Android</p>
                      <p className="text-xs opacity-80">Google Play Store</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                  <p className="font-bold mb-1">📱 Alternative: Use Browser</p>
                  <p>You can also use GitHub from Chrome/Firefox on Android without installing the app.</p>
                </div>
              </div>
            </Step>

            <Step number={4} icon={Upload} title="Upload Project Files" subtitle="Add all project files to GitHub" color="orange">
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-bold text-blue-800 text-sm mb-2">Method A: Upload via GitHub Website (Easiest)</p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <span className="font-bold w-5 flex-shrink-0">1.</span>
                      <span>Go to your new Payflow repo on GitHub</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold w-5 flex-shrink-0">2.</span>
                      <span>Click <strong>"uploading an existing file"</strong> link</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold w-5 flex-shrink-0">3.</span>
                      <span>Drag & drop or select all project files</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold w-5 flex-shrink-0">4.</span>
                      <span>Click <strong>"Commit changes"</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="font-bold text-purple-800 text-sm mb-2">Method B: Use Termux (Power Users)</p>
                  <p className="text-xs text-purple-600 mb-2">See "Manual Deploy" tab for Termux instructions</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                  <p className="font-bold text-orange-800 text-sm mb-1">⚠️ Important File Structure</p>
                  <p className="text-xs text-orange-700 font-mono">
                    Make sure <code>.github/workflows/deploy.yml</code> is included — this is the auto-deploy file!
                  </p>
                </div>
              </div>
            </Step>

            <Step number={5} icon={Settings} title="Enable GitHub Pages" subtitle="Turn on automatic hosting" color="purple">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">After uploading files, wait ~2 minutes for the Action to run, then:</p>
                <a
                  href={`https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl"
                >
                  <span className="font-mono text-xs break-all">Settings → Pages</span>
                  <ExternalLink className="w-4 h-4 opacity-60 flex-shrink-0 ml-2" />
                </a>
                <div className="space-y-2">
                  {[
                    'Source: "Deploy from a branch"',
                    'Branch: gh-pages → / (root)',
                    'Click Save',
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Step>

            <Step number={6} icon={Eye} title="Watch Auto-Deploy Run" subtitle="See it deploy in real-time" color="teal">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Monitor your deployment:</p>
                <a
                  href={`https://github.com/${GITHUB_USER}/${REPO_NAME}/actions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-indigo-600 text-white rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5" />
                    <span className="font-semibold text-sm">View GitHub Actions</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="font-bold text-green-800 text-sm mb-1">🎉 Your app goes live at:</p>
                  <a
                    href={LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 font-mono text-xs break-all underline"
                  >
                    {LIVE_URL}
                  </a>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                  <p className="font-bold mb-1">🔄 Future Updates</p>
                  <p>Just upload new files or push to GitHub — it auto-deploys every time!</p>
                </div>
              </div>
            </Step>
          </div>
        )}

        {/* Manual / Termux Method */}
        {activeMethod === 'manual' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 mb-2">
              <Terminal className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-gray-800">Manual Deploy via Termux</h2>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
              <p className="font-bold mb-1">📱 Termux on Android</p>
              <p>Termux lets you run Linux commands on Android. You can build and deploy directly from your phone!</p>
            </div>

            <Step number={1} icon={Package} title="Install Termux" subtitle="Get the Linux terminal for Android" color="orange">
              <div className="space-y-3">
                <a
                  href="https://f-droid.org/packages/com.termux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-orange-500 text-white rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-sm">Download Termux</p>
                      <p className="text-xs opacity-80">From F-Droid (recommended)</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                  ⚠️ Use F-Droid version, not Play Store (Play Store version is outdated)
                </div>
              </div>
            </Step>

            <Step number={2} icon={Settings} title="Setup Termux" subtitle="Install Node.js and Git" color="blue">
              <p className="text-sm text-gray-600 mb-2">Run these commands in Termux:</p>
              <CodeBlock code={`# Update packages
pkg update && pkg upgrade -y

# Install Node.js and Git
pkg install nodejs git -y

# Verify installation
node --version
npm --version
git --version`} />
            </Step>

            <Step number={3} icon={GitBranch} title="Configure Git" subtitle="Set your identity" color="indigo">
              <CodeBlock code={`git config --global user.name "vishwajitsingh-rajput-27"
git config --global user.email "your-email@example.com"`} />
              <div className="mt-3 bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                <p className="font-bold mb-1">🔑 GitHub Personal Access Token</p>
                <p className="text-xs mb-2">You need a token to push from Termux:</p>
                <ol className="text-xs space-y-1 list-decimal list-inside">
                  <li>Go to GitHub.com → Settings</li>
                  <li>Developer settings → Personal access tokens</li>
                  <li>Generate new token (classic)</li>
                  <li>Select: <strong>repo</strong> scope</li>
                  <li>Copy the token (save it!)</li>
                </ol>
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-2 text-blue-600 underline text-xs"
                >
                  Create token here <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Step>

            <Step number={4} icon={Upload} title="Get Project Files" subtitle="Download and set up the project" color="green">
              <p className="text-sm text-gray-600 mb-2">Option A - Clone existing repo:</p>
              <CodeBlock code={`git clone https://github.com/${GITHUB_USER}/${REPO_NAME}.git
cd ${REPO_NAME}
npm install`} />
              <p className="text-sm text-gray-600 mt-3 mb-2">Option B - Initialize new repo:</p>
              <CodeBlock code={`# Navigate to your project folder
cd /sdcard/Payflow   # or wherever project is

git init
git remote add origin https://${GITHUB_USER}:YOUR_TOKEN@github.com/${GITHUB_USER}/${REPO_NAME}.git
npm install`} />
            </Step>

            <Step number={5} icon={Play} title="Build & Deploy" subtitle="Build for GitHub Pages and push" color="purple">
              <p className="text-sm text-gray-600 mb-2">Build the project:</p>
              <CodeBlock code={`# Build for GitHub Pages
npm run build:github

# The built files are in ./dist/`} />
              <p className="text-sm text-gray-600 mt-3 mb-2">Deploy to GitHub Pages:</p>
              <CodeBlock code={`# Push source code to main branch
git add .
git commit -m "Deploy Payflow v1.0"
git push origin main

# If GitHub Actions is set up, it auto-deploys!
# OR manually deploy with:
npm run deploy`} />
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
                <p className="font-bold mb-1">⚡ Quick Deploy Script</p>
                <p className="text-xs mb-2">Run everything in one command:</p>
                <CodeBlock code={`bash deploy.sh`} language="bash" />
              </div>
            </Step>

            <Step number={6} icon={Globe} title="Enable GitHub Pages" subtitle="Activate hosting in settings" color="teal">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Go to your repo settings:</p>
                <a
                  href={`https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl"
                >
                  <span className="text-sm">Repository → Settings → Pages</span>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
                <div className="space-y-2">
                  {['Set branch to: gh-pages', 'Set folder to: / (root)', 'Click Save'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Step>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Quick Links
          </h3>
          <div className="space-y-2">
            {[
              { label: '🌐 Live App', url: LIVE_URL, color: 'bg-indigo-50 text-indigo-700' },
              { label: '📦 GitHub Repo', url: REPO_URL, color: 'bg-gray-50 text-gray-700' },
              { label: '⚙️ Repo Settings → Pages', url: `https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages`, color: 'bg-blue-50 text-blue-700' },
              { label: '🔄 GitHub Actions (Deployments)', url: `https://github.com/${GITHUB_USER}/${REPO_NAME}/actions`, color: 'bg-green-50 text-green-700' },
              { label: '🔑 Create Access Token', url: 'https://github.com/settings/tokens/new', color: 'bg-yellow-50 text-yellow-700' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-3 rounded-xl ${link.color} hover:opacity-80 transition-opacity`}
              >
                <span className="font-medium text-sm">{link.label}</span>
                <ExternalLink className="w-4 h-4 opacity-60" />
              </a>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className="mt-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Demo Credentials
          </h3>
          <div className="space-y-2">
            {[
              { role: '👤 User', user: 'john_doe', pass: 'password123', pin: '1234' },
              { role: '🛡️ Admin', user: 'admin', pass: 'admin123', pin: '—' },
              { role: '👤 User 2', user: 'jane_smith', pass: 'password123', pin: '5678' },
            ].map((cred) => (
              <div key={cred.role} className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="font-semibold text-sm mb-1">{cred.role}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="opacity-60">Username</span>
                    <p className="font-mono font-bold mt-0.5">{cred.user}</p>
                  </div>
                  <div>
                    <span className="opacity-60">Password</span>
                    <p className="font-mono font-bold mt-0.5">{cred.pass}</p>
                  </div>
                  <div>
                    <span className="opacity-60">PIN</span>
                    <p className="font-mono font-bold mt-0.5">{cred.pin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-white/10 rounded-xl p-3 text-xs text-indigo-100">
            ⚠️ <strong>Simulation Only</strong> — No real money. All data stored in browser (localStorage).
          </div>
        </div>

        {/* Back button */}
        <div className="mt-6 mb-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
