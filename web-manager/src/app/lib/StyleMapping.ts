import { MessageType } from "@/types/MessageType";

const typeStyles: Record<MessageType, {
  bg: string;
  text: string;
  border: string;
  iconColor: string;
  hoverBg: string;
}> = {
  success: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
    iconColor: 'text-green-600',
    hoverBg: 'hover:bg-green-200',
  },
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    iconColor: 'text-yellow-600',
    hoverBg: 'hover:bg-yellow-200',
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    iconColor: 'text-red-600',
    hoverBg: 'hover:bg-red-200',
  },
};

export class StyleMapping {
  static getStyles(type: MessageType) {
    return typeStyles[type] || null;
  }
}