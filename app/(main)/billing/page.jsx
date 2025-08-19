"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/provider';
import { useSearchParams } from 'next/navigation';
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
  Sparkles,
  IndianRupee
} from 'lucide-react';
import { VivecruitTextLoader } from '@/components/ui/vivecruit-loader';

export default function BillingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [processingPayment, setProcessingPayment] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      setLoading(false);
      // Check for payment status in URL params
      const status = searchParams.get('status');
      const plan = searchParams.get('plan');
      const error = searchParams.get('error');

      if (status === 'success' && plan) {
        toast.success(`Successfully subscribed to ${plan} plan!`);
        setCurrentPlan(plan);
        // Refresh user data to get updated plan
        window.location.href = '/billing';
      } else if (status === 'failed') {
        toast.error(`Payment failed: ${error || 'Unknown error'}`);
      }
    }
  }, [user, searchParams]);

  const plans = [
    {
      name: 'Free',
      icon: <Zap className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      price: 0,
      originalPrice: 0,
      features: [
        'Create only 1 interview',
        'Basic AI interviewer',
        'Standard question templates',
        'Email support',
        'Basic analytics',
        'Interview scheduling'
      ],
      popular: false,
      recommended: false,
      interviewsLimit: 1
    },
    {
      name: 'Silver',
      icon: <Star className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-600',
      price: 1999,
      originalPrice: 2499,
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
      recommended: false,
      interviewsLimit: 50
    },
    {
      name: 'Gold',
      icon: <Crown className="h-8 w-8" />,
      color: 'from-yellow-500 to-yellow-600',
      price: 3999,
      originalPrice: 4999,
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
      recommended: true,
      interviewsLimit: 200
    },
    {
      name: 'Platinum',
      icon: <Diamond className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      price: 6999,
      originalPrice: 8999,
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
      recommended: false,
      interviewsLimit: 'Unlimited'
    }
  ];

  const loadPayUScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://securegw.payumoney.com/checkout/assets/lib/custom.js';
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planName) => {
    if (planName === 'Free') {
      toast.success('You are already on the Free plan!');
      return;
    }

    setProcessingPayment(true);
    try {
      // Load PayU script
      await loadPayUScript();

      // Create order on your backend
      const response = await fetch('/api/create-payu-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          amount: plans.find(p => p.name === planName)?.price || 0,
          userEmail: user?.email,
          userId: user?.id,
          userName: user?.name || ''
        }),
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Initialize PayU
      const payUConfig = {
        key: process.env.NEXT_PUBLIC_PAYU_KEY,
        salt: process.env.NEXT_PUBLIC_PAYU_SALT,
        txnid: orderData.txnid,
        amount: orderData.amount,
        productinfo: `${planName} Plan Subscription`,
        firstname: user?.name || 'User',
        email: user?.email || '',
        phone: user?.phone || '',
        surl: `${window.location.origin}/api/payu-success`,
        furl: `${window.location.origin}/api/payu-failure`,
        hash: orderData.hash,
        service_provider: 'payu_paisa',
        udf1: planName,
        udf2: user?.email,
        udf3: user?.id
      };

      // Open PayU payment form
      const payUForm = document.createElement('form');
      payUForm.method = 'POST';
      payUForm.action = 'https://securegw.payumoney.com/checkout/post';
      payUForm.target = '_blank';

      Object.keys(payUConfig).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payUConfig[key];
        payUForm.appendChild(input);
      });

      document.body.appendChild(payUForm);
      payUForm.submit();
      document.body.removeChild(payUForm);

      // Show success message
      toast.success('Payment window opened. Please complete the payment.');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const updateUserPlan = async (planName) => {
    try {
      const { error } = await supabase
        .from('Users')
        .update({ 
          plan: planName,
          plan_updated_at: new Date().toISOString()
        })
        .eq('email', user?.email);

      if (error) {
        console.error('Error updating user plan:', error);
      }
    } catch (error) {
      console.error('Error updating user plan:', error);
    }
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
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <IndianRupee className="h-6 w-6 text-gray-900" />
                      <span className="text-3xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
                    </>
                  )}
                </div>
                {plan.originalPrice > plan.price && (
                  <p className="text-sm text-gray-500 line-through">
                    ₹{plan.originalPrice.toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {plan.interviewsLimit === 'Unlimited' ? 'Unlimited interviews' : `${plan.interviewsLimit} interviews/month`}
                </p>
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
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={processingPayment}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-violet-600 hover:bg-violet-700' 
                          : plan.recommended 
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : plan.price === 0
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {processingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          {plan.price === 0 ? 'Current Plan' : 'Subscribe Now'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
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
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Silver</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Gold</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Platinum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 font-medium">Interviews per month</td>
                    <td className="text-center py-4 px-6">1</td>
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
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">Yes, we offer a free plan that allows you to create 1 interview to test our platform.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">We accept all major credit cards, debit cards, UPI, net banking, and digital wallets through Razorpay.</p>
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
