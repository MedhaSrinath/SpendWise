import React, { Component } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

/**
 * BudgetSummaryCard - Implemented as a React Class Component to satisfy
 * CIE-2 Requirement #2 (Demonstrating React Class Components, lifecycle methods,
 * and state/props in a class-based architecture).
 */
export class BudgetSummaryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      currentTipIndex: 0,
    };

    this.tips = [
      'Follow the 50/30/20 rule: 50% Needs, 30% Wants, and 20% Savings.',
      'Review recurring subscriptions monthly to cut unneeded charges.',
      'Cook meals at home more frequently to reduce food expenses.',
      'Maintain an emergency fund covering at least 3 months of basic living costs.',
    ];

    this.toggleDetails = this.toggleDetails.bind(this);
    this.nextTip = this.nextTip.bind(this);
  }

  componentDidMount() {
    // Lifecycle demonstration: Periodic tip rotation
    this.tipTimer = setInterval(this.nextTip, 10000);
  }

  componentWillUnmount() {
    if (this.tipTimer) {
      clearInterval(this.tipTimer);
    }
  }

  toggleDetails() {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

  nextTip() {
    this.setState((prevState) => ({
      currentTipIndex: (prevState.currentTipIndex + 1) % this.tips.length,
    }));
  }

  render() {
    const { totalExpense = 0, monthlyBudgetLimit = 25000, totalIncome = 0 } = this.props;
    const { isExpanded, currentTipIndex } = this.state;

    const remainingBudget = monthlyBudgetLimit - totalExpense;
    const percentageUsed = Math.min(
      100,
      Math.max(0, monthlyBudgetLimit > 0 ? (totalExpense / monthlyBudgetLimit) * 100 : 0)
    );

    const isOverBudget = totalExpense > monthlyBudgetLimit;
    const isNearBudget = percentageUsed >= 80 && !isOverBudget;

    let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let statusText = 'Within Budget';
    let progressBarColor = 'bg-teal-500';

    if (isOverBudget) {
      statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
      statusText = 'Budget Exceeded';
      progressBarColor = 'bg-rose-500';
    } else if (isNearBudget) {
      statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
      statusText = 'Approaching Limit';
      progressBarColor = 'bg-amber-500';
    }

    return (
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-gray-800 text-base">
                Monthly Budget Health
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge}`}>
                {isOverBudget ? (
                  <AlertCircle size={12} className="mr-1" />
                ) : (
                  <CheckCircle size={12} className="mr-1" />
                )}
                {statusText}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Target Monthly Limit: ₹{monthlyBudgetLimit.toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={this.toggleDetails}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle details"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-gray-700">
              Spent: ₹{Number(totalExpense).toLocaleString('en-IN')} ({percentageUsed.toFixed(1)}%)
            </span>
            <span className={remainingBudget < 0 ? 'text-rose-600 font-semibold' : 'text-gray-500'}>
              {remainingBudget >= 0 ? 'Remaining: ' : 'Over by: '}
              ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
        </div>

        {/* Warning if over budget */}
        {isOverBudget && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>
              <strong>Budget Warning:</strong> You've exceeded your monthly limit by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}.
            </span>
          </div>
        )}

        {/* Tip */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1.5 truncate">
            <Lightbulb size={14} className="text-amber-500 shrink-0" />
            <span className="truncate">{this.tips[currentTipIndex]}</span>
          </div>
          <button
            onClick={this.nextTip}
            className="text-teal-600 hover:underline shrink-0 ml-2 font-medium text-[11px]"
          >
            Next Tip →
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <span className="text-gray-500 block text-[11px]">Monthly Budget</span>
              <span className="font-bold text-gray-800 text-sm">
                ₹{monthlyBudgetLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <span className="text-gray-500 block text-[11px]">Total Income</span>
              <span className="font-bold text-emerald-600 text-sm">
                ₹{Number(totalIncome).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BudgetSummaryCard;
