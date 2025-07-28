'use client';

import { JSX } from "react";

const frenchWords = [
  'français',
  'francais',
  'française',
  'francaise',
  'france',
  'french',
]

const englishWords = [
  'english',
  'anglais',
  'anglaise',
  'england',
]

interface FlagProps {
  cssStyle?: string;
}

const FrFlag = ({ cssStyle }: FlagProps) => {
  let className = 'w-5 h-5';
  if (cssStyle && cssStyle.includes('w-')) className = className.replace('w-5 ', '');
  if (cssStyle && cssStyle.includes('h-')) className = className.replace('h-5', '');
  if (cssStyle) className += ` ${cssStyle}`;
  return <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" fill="#f0f0f0" r="256"/>
    <path d="m512 256c0-110.071-69.472-203.906-166.957-240.077v480.155c97.485-36.172 166.957-130.007 166.957-240.078z" fill="#d80027"/>
    <path d="m0 256c0 110.071 69.473 203.906 166.957 240.077v-480.154c-97.484 36.171-166.957 130.006-166.957 240.077z" fill="#0052b4"/>
  </svg>
}
const EnFlag = ({ cssStyle }: FlagProps) => {
  let className = 'w-5 h-5';
  if (cssStyle && cssStyle.includes('w-')) className = className.replace('w-5 ', '');
  if (cssStyle && cssStyle.includes('h-')) className = className.replace('h-5', '');
  
  if (cssStyle) className += ` ${cssStyle}`;
  return <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" fill="#f0f0f0" r="256"/>
    <g fill="#0052b4">
      <path d="m52.92 100.142c-20.109 26.163-35.272 56.318-44.101 89.077h133.178z"/>
      <path d="m503.181 189.219c-8.829-32.758-23.993-62.913-44.101-89.076l-89.075 89.076z"/>
      <path d="m8.819 322.784c8.83 32.758 23.993 62.913 44.101 89.075l89.074-89.075z"/>
      <path d="m411.858 52.921c-26.163-20.109-56.317-35.272-89.076-44.102v133.177z"/>
      <path d="m100.142 459.079c26.163 20.109 56.318 35.272 89.076 44.102v-133.176z"/>
      <path d="m189.217 8.819c-32.758 8.83-62.913 23.993-89.075 44.101l89.075 89.075z"/>
      <path d="m322.783 503.181c32.758-8.83 62.913-23.993 89.075-44.101l-89.075-89.075z"/>
      <path d="m370.005 322.784 89.075 89.076c20.108-26.162 35.272-56.318 44.101-89.076z"/>
    </g>
    <g fill="#d80027">
      <path d="m509.833 222.609h-220.44-.001v-220.442c-10.931-1.423-22.075-2.167-33.392-2.167-11.319 0-22.461.744-33.391 2.167v220.44.001h-220.442c-1.423 10.931-2.167 22.075-2.167 33.392 0 11.319.744 22.461 2.167 33.391h220.44.001v220.442c10.931 1.423 22.073 2.167 33.392 2.167 11.317 0 22.461-.743 33.391-2.167v-220.44-.001h220.442c1.423-10.931 2.167-22.073 2.167-33.392 0-11.317-.744-22.461-2.167-33.391z"/>
      <path d="m322.783 322.784 114.236 114.236c5.254-5.252 10.266-10.743 15.048-16.435l-97.802-97.802h-31.482z"/>
      <path d="m189.217 322.784h-.002l-114.235 114.235c5.252 5.254 10.743 10.266 16.435 15.048l97.802-97.804z"/>
      <path d="m189.217 189.219v-.002l-114.236-114.237c-5.254 5.252-10.266 10.743-15.048 16.435l97.803 97.803h31.481z"/>
      <path d="m322.783 189.219 114.237-114.238c-5.252-5.254-10.743-10.266-16.435-15.047l-97.802 97.803z"/>
    </g>
  </svg>
}

interface LanguageFlagProps {
  language: string;
  cssStyle?: string;
}

export default function LanguageFlag({ language, cssStyle }: LanguageFlagProps) {
  const isFrench = frenchWords.some(word => language.toLowerCase().includes(word)) || language.toLowerCase() === 'fr';
  const isEnglish = englishWords.some(word => language.toLowerCase().includes(word)) || language.toLowerCase() === 'en';
  
  const flags: JSX.Element[] = [];
  if (isFrench) flags.push(<FrFlag key="fr" cssStyle={cssStyle} />);
  if (isEnglish) flags.push(<EnFlag key="en" cssStyle={cssStyle} />);

  // Default case if no flags match
  if (flags.length === 0 && language) flags.push(<span key="default" className="text-gray-500">{language}</span>);

  return (
    <span title={language} className={`${cssStyle ?? ''} flex gap-1`}>
      {flags.length > 0 ? flags : null}
    </span>
  );
}