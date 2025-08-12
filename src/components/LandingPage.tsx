import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import JADTraxLogo from './JADTraxLogo';
import { Zap, Gauge, UserCheck } from 'lucide-react';

import { 
  MousePointerClick,
  ShieldCheck,
  Timer,
  Filter,
  Layers,
  MonitorSmartphone, 
  Globe, 
  Shield,  
  Activity,
  Search,
  CheckCircle,
  ArrowRight,
  Lock,
  Menu,
  X,
  Mail,
  User,
  AlertCircle,
  Sparkles,  
  Rocket,
} from 'lucide-react';

function LandingPage() {
  const [url, setUrl] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user,signUp, signIn, signOut } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Analytics Dashboard',
      description: 'Live visitor monitoring, real-time pageviews, instant updates, and server connection status.',
      color: 'from-green-500 to-green-600',
      stats: 'Live data'
    },
    {
      icon: Globe,
      title: 'Regional Analytics & Geographic Insights',
      description: 'Country and city-level performance with regional traffic and device breakdowns.',
      color: 'from-teal-500 to-teal-600',
      stats: '15+ countries'
    },
    {
      icon: MousePointerClick,
      title: 'Advanced User Behavior Tracking',
      description: 'Session recording, event tracking, heatmaps, and timeline-based replays.',
      color: 'from-red-500 to-red-600',
      stats: 'Full journey'
    },
    {
      icon: Search,
      title: 'SEO Analytics & Performance Metrics',
      description: 'Monitor Core Web Vitals, keyword rankings, backlinks, and page load performance.',
      color: 'from-purple-500 to-purple-600',
      stats: '50+ metrics'
    },
    {
      icon: Layers,
      title: 'Conversion Funnel Analysis',
      description: 'Visualize multi-step funnels, track conversions, and analyze drop-offs.',
      color: 'from-pink-500 to-pink-600',
      stats: 'Custom funnels'
    },
    {
      icon: MonitorSmartphone,
      title: 'Multi-Device Analytics',
      description: 'Breakdown across desktop, mobile, and tablet with cross-device user tracking.',
      color: 'from-indigo-500 to-indigo-600',
      stats: 'Responsive'
    },
    {
      icon: Timer,
      title: 'Flexible Time Range Analysis',
      description: '24h, 7d, 30d, and custom range comparisons with trend analysis.',
      color: 'from-blue-500 to-blue-600',
      stats: 'Custom ranges'
    },
    {
      icon: Filter,
      title: 'Advanced Data Filtering & Reporting',
      description: 'URL, region, and time filters with export-ready analytics tables.',
      color: 'from-orange-500 to-orange-600',
      stats: 'Fully filterable'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy-First Approach',
      description: 'Self-hosted, GDPR-compliant with encrypted storage and full data ownership.',
      color: 'from-gray-500 to-gray-600',
      stats: '100% private'
    }
  ];

  const AuthModal = ({ isOpen, onClose, type }: { isOpen: boolean; onClose: () => void; type: 'signin' | 'signup' }) => {
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAuthError(null);
      setAuthSuccess(null);
      setAuthLoading(true);

      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const fullName = formData.get('fullName') as string;

      try {
        if (type === 'signup') {
          const { error } = await signUp(email, password, fullName);
          if (error) {
            setAuthError(error.message);
          } else {
            setAuthSuccess('Account created successfully! Please check your email and click the confirmation link to activate your account.');
            setTimeout(() => {
              onClose();
              setAuthSuccess(null);
            }, 5000);
          }
        } else {
          const { error } = await signIn(email, password);
          if (error) {
            setAuthError(error.message);
          } else {
            setAuthSuccess('Signed in successfully!');
            setTimeout(() => {
              onClose();
              navigate('/dashboard');
              setAuthSuccess(null);
            }, 1500);
          }
        }
      } catch (error) {
        setAuthError('An unexpected error occurred. Please try again.');
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative transform transition-all duration-200 scale-100">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
          
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="p-5">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <JADTraxLogo width={50} height={50} className="opacity-100" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {type === 'signin' ? 'Welcome back' : 'Get started'}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">JADTrax Analytics</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {type === 'signin' 
                  ? 'Sign in to access your analytics dashboard and insights' 
                  : 'Create your account to start tracking website analytics and user behavior'
                }
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">{authSuccess}</p>
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              {type === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
              >
                {authLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{type === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  type === 'signin' ? 'Sign In to JADTrax' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                {type === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    if (type === 'signin') {
                      setShowSignIn(false);
                      setShowSignUp(true);
                    } else {
                      setShowSignUp(false);
                      setShowSignIn(true);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {type === 'signin' ? 'Sign up for free' : 'Sign in instead'}
                </button>
              </p>
            </div>

            {type === 'signup' && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  You'll receive a confirmation email to activate your account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <JADTraxLogo className="shadow-none" width={60} height={60} />
    
            </div>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Core Features</a>
              <a href="#customers" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">About JADTech</a>
              <a href="#JAD" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Why you choose JADTrax?</a>
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium">
                      Welcome, {user.user_metadata?.full_name || user.email}
                    </span>
                    <button 
                      onClick={signOut}
                      className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowSignIn(true)}
                      className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setShowSignUp(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </div>
            </nav>

            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-6 py-6 space-y-6">
              <a href="#features" className="block text-gray-700 font-medium py-2">Core Features</a>
              <a href="#customers" className="block text-gray-700 font-medium py-2">About JADTech</a>
              <a href="#JAD" className="block text-gray-700 font-medium py-2">Why you choose JADTrax?</a>
              <div className="pt-6 border-t border-gray-200 space-y-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="text-gray-700 font-medium py-2">
                      Welcome, {user.user_metadata?.full_name || user.email}
                    </div>
                    <button 
                      onClick={signOut}
                      className="block w-full text-left text-gray-700 font-medium py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowSignIn(true)}
                      className="block w-full text-left text-gray-700 font-medium py-2"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setShowSignUp(true)}
                      className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Single Viewport */}
      <section className="pt-16 min-h-screen bg-white relative overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Hero Section - Compact */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
              <Sparkles className="h-4 w-4" />
              <span>Privacy-first web analytics platform</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Welcome to JADTrax<br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Traffic & Regional Analytics 
              </span> Platform 
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track, analyze, and optimize your website performance with real-time insights, 
              regional analytics, and advanced user behavior tracking. Self-hosted and privacy-focused.
            </p>

            {/* URL Input - Compact */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your website URL..."
                  className="flex-1 px-6 py-4 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-500"
                />
                <button 
                  onClick={() => {
                    if (user) {
                      navigate('/dashboard');
                    } else {
                      setShowSignUp(true);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 font-semibold group"
                >
                  <span>Analyze</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* CTA Buttons - Compact */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 group"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={() => setShowSignUp(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 group"
                >
                  <span>Start Free Trial</span>
                  <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-bold">
                View Live Demo
              </button>
            </div>
          </div>

          {/* Features Grid - Compact 4x2 Layout */}
          <div className="mt-12 text-center"id="features">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Core Features
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{feature.description}</p>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
              </div>
              
            ))}
          </div>
          </div>
         

          <div className="mt-12 text-center">
            <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Global Reach
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            JADTrax supports comprehensive regional analytics for 15+ major countries with detailed city-level insights, making it perfect for businesses with international audiences and global reach requirements.
            </p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50" id="customers">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
        About JAD Tech
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        JAD Tech is a forward-thinking technology company that specializes in delivering innovative digital solutions. With our motto <strong>"INNOVATE . TRANSFORM . SUCCEED"</strong>, we focus on creating cutting-edge applications that drive business growth and efficiency. Our expertise spans across web development, mobile applications, digital marketing, and business consulting.
      </p>
    </div>

    <div className="text-center">
      <h2 className="text-3xl lg:text-4xl text-gray-900 mb-6">
        The JADTrax Story
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
        <strong>JADTrax = JAD Tech + Tracks/Tracking</strong>
      </p>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
        <strong>JAD</strong> → Represents your company JAD Tech, ensuring brand consistency.
      </p>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
        <strong>Trax</strong> → A modern, tech-style spelling of Tracks, implying:
      </p>
      <ul className="list-disc list-inside text-center text-gray-600 max-w-3xl mx-auto space-y-2">
        <li>Tracking website traffic</li>
        <li>Real-time data tracking</li>
        <li>Monitoring user behavior</li>
        <li>Following regional performance trends</li>
        <li>Insightful movement and flow tracking across platforms</li>
      </ul>
    </div>
  </div>
</section>


      {/* Additional Sections (Below the fold) */}
      <section className="py-20 bg-white" id="JAD">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Choose JADTrax?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your traffic analysis capabilities with JADTrax - where innovation meets efficiency in traffic monitoring and analytics. Get comprehensive insights to optimize your website globally and drive data-driven decisions for your business growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

          <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
    <Zap className="h-8 w-8 text-blue-600" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation First</h3>
  <p className="text-gray-600 leading-relaxed">Built with cutting-edge technology to provide the most advanced traffic analysis capabilities with real-time processing and comprehensive insights.</p>
</div>

<div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
    <Gauge className="h-8 w-8 text-blue-600" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-4">Efficiency Focused</h3>
  <p className="text-gray-600 leading-relaxed">Streamlined interface designed to maximize productivity with intuitive navigation, customizable dashboards, and quick data access.</p>
</div>

<div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
    <UserCheck className="h-8 w-8 text-blue-600" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-4">Client-Centric</h3>
  <p className="text-gray-600 leading-relaxed">Tailored to meet your specific traffic monitoring and analysis needs with customizable features, regional insights, and comprehensive reporting.</p>
</div>



          
            
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy-First</h3>
              <p className="text-gray-600 leading-relaxed">Self-hosted solution ensuring complete data ownership and GDPR compliance.</p>
            </div>
            
            
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Ready</h3>
              <p className="text-gray-600 leading-relaxed">Support for 15+ major countries with detailed city-level analytics for international businesses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center space-x-3">
              <JADTraxLogo width={70} height={70} />
            </div>
                <div>
                  <span className="text-xl font-bold">JADTrax</span>
                  <div className="text-xs text-gray-400 -mt-1">by JAD Tech</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Your complete traffic & regional analytics platform. Privacy-first, self-hosted, and built for modern websites.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Live Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About JAD Tech</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; 2024 JAD Tech. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <AuthModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} type="signin" />
      <AuthModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} type="signup" />
    </div>
  );
}

export default LandingPage;