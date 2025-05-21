'use client';

const frenchWords = [
  'français',
  'francais',
  'française',
  'francaise',
  'france',
  'frech',
]

const englishWords = [
  'english',
  'anglais',
  'england',
]

interface FlagProps {
  padding?: string;
}

const FrFlag = ({ padding }: FlagProps) => {
  const className = padding ? `w-5 h-5 ${padding}` : 'w-5 h-5';
  return <svg className={className} enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" fill="#f0f0f0" r="256"/>
    <path d="m512 256c0-110.071-69.472-203.906-166.957-240.077v480.155c97.485-36.172 166.957-130.007 166.957-240.078z" fill="#d80027"/>
    <path d="m0 256c0 110.071 69.473 203.906 166.957 240.077v-480.154c-97.484 36.171-166.957 130.006-166.957 240.077z" fill="#0052b4"/>
    <g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/>
  </svg>
}
const EnFlag = ({ padding }: FlagProps) => {
  const className = padding ? `w-5 h-5 ${padding}` : 'w-5 h-5';
  return <svg className={className} enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" fill="#f0f0f0" r="256"/>
    <path d="m512 256c0-110.071-69.472-203.906-166.957-240.077v480.155c97.485-36.172 166.957-130.007 166.957-240.078z" fill="#d80027"/>
    <path d="m0 256c0 110.071 69.473 203.906 166.957 240.077v-480.154c-97.484 36.171-166.957 130.006-166.957 240.077z" fill="#0052b4"/>
    <g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/>
  </svg>
}

interface LanguageFlagProps {
  language: string;
  padding?: 'pr-2' | 'pl-2' | 'pr-2 pl-2';
}

export default function LanguageFlag({ language, padding }: LanguageFlagProps) {
  const isFrench = frenchWords.some(word => language.toLowerCase().includes(word));
  const isEnglish = englishWords.some(word => language.toLowerCase().includes(word));

  if (isFrench) {
    return <FrFlag padding={padding} />;
  } else if (isEnglish) {
    return <EnFlag padding={padding} />;
  } else {
    return null;
  }
}