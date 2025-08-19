"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Diamond,
  CreditCard,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Shield,
  Headphones,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { VivecruitTextLoader } from '@/components/ui/vivecruit-loader';

export default function BillingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('Base');
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          toast.error('Error loading user data');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const plans = [
    {
      name: 'Base',
      icon: <Zap className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      price: billingCycle === 'monthly' ? 29 : 290,
      originalPrice: billingCycle === 'monthly' ? 39 : 390,
      features: [
        'Up to 10 interviews per month',
        'Basic AI interviewer',
        'Standard question templates',
        'Email support',
        'Basic analytics',
        'Interview scheduling'
      ],
      popular: false,
      recommended: false
    },
    {
      name: 'Silver',
      icon: <Star className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-600',
      price: billingCycle === 'monthly' ? 79 : 790,
      originalPrice: billingCycle === 'monthly' ? 99 : 990,
      features: [
        'Up to 50 interviews per month',
        'Advanced AI interviewer',
        'Custom question templates',
        'Priority email support',
        'Advanced analytics',
        'Interview scheduling',
        'Candidate scoring',
        'Export reports'
      ],
      popular: true,
      recommended: false
    },
    {
      name: 'Gold',
      icon: <Crown className="h-8 w-8" />,
      color: 'from-yellow-500 to-yellow-600',
      price: billingCycle === 'monthly' ? 149 : 1490,
      originalPrice: billingCycle === 'monthly' ? 199 : 1990,
      features: [
        'Up to 200 interviews per month',
        'Premium AI interviewer',
        'Unlimited custom templates',
        'Phone & email support',
        'Advanced analytics & insights',
        'Interview scheduling',
        'Candidate scoring',
        'Export reports',
        'Team collaboration',
        'Custom branding',
        'API access'
      ],
      popular: false,
      recommended: true
    },
    {
      name: 'Platinum',
      icon: <Diamond className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      price: billingCycle === 'monthly' ? 299 : 2990,
      originalPrice: billingCycle === 'monthly' ? 399 : 3990,
      features: [
        'Unlimited interviews',
        'Enterprise AI interviewer',
        'Unlimited custom templates',
        '24/7 dedicated support',
        'Enterprise analytics',
        'Interview scheduling',
        'Candidate scoring',
        'Export reports',
        'Team collaboration',
        'Custom branding',
        'API access',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false,
      recommended: false
    }
  ];

  const handleSubscribe = (planName) => {
    toast.success(`Subscribing to ${planName} plan...`);
    // Here you would integrate with your payment processor
    console.log(`Subscribing to ${planName} plan`);
  };

  const handleUpgrade = (planName) => {
    toast.success(`Upgrading to ${planName} plan...`);
    // Here you would integrate with your payment processor
    console.log(`Upgrading to ${planName} plan`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <VivecruitTextLoader size="large" text="Loading billing..." />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your hiring needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-violet-600"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Save 25%
              </span>
            )}
          </div>
        </div>

        {/* Current Plan Status */}
        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                <p className="text-gray-600">You are currently on the {currentPlan} plan</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Next billing date</p>
                  <p className="font-medium text-gray-900">March 15, 2024</p>
                </div>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-violet-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    RECOMMENDED
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                {plan.originalPrice > plan.price && (
                  <p className="text-sm text-gray-500 line-through">
                    ${plan.originalPrice} / {billingCycle === 'monthly' ? 'month' : 'year'}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  {currentPlan === plan.name ? (
                    <Button 
                      className="w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => currentPlan === 'None' ? handleSubscribe(plan.name) : handleUpgrade(plan.name)}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-violet-600 hover:bg-violet-700' 
                          : plan.recommended 
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {currentPlan === 'None' ? 'Subscribe' : 'Upgrade'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Base</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Silver</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Gold</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Platinum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 font-medium">Interviews per month</td>
                    <td className="text-center py-4 px-6">10</td>
                    <td className="text-center py-4 px-6">50</td>
                    <td className="text-center py-4 px-6">200</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">AI Interviewer</td>
                    <td className="text-center py-4 px-6">Basic</td>
                    <td className="text-center py-4 px-6">Advanced</td>
                    <td className="text-center py-4 px-6">Premium</td>
                    <td className="text-center py-4 px-6">Enterprise</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Support</td>
                    <td className="text-center py-4 px-6">Email</td>
                    <td className="text-center py-4 px-6">Priority Email</td>
                    <td className="text-center py-4 px-6">Phone & Email</td>
                    <td className="text-center py-4 px-6">24/7 Dedicated</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Analytics</td>
                    <td className="text-center py-4 px-6">Basic</td>
                    <td className="text-center py-4 px-6">Advanced</td>
                    <td className="text-center py-4 px-6">Advanced & Insights</td>
                    <td className="text-center py-4 px-6">Enterprise</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">API Access</td>
                    <td className="text-center py-4 px-6">❌</td>
                    <td className="text-center py-4 px-6">❌</td>
                    <td className="text-center py-4 px-6">✅</td>
                    <td className="text-center py-4 px-6">✅</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">White-label</td>
                    <td className="text-center py-4 px-6">❌</td>
                    <td className="text-center py-4 px-6">❌</td>
                    <td className="text-center py-4 px-6">❌</td>
                    <td className="text-center py-4 px-6">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">Yes, we offer a 14-day free trial on all plans. No credit card required to start.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
