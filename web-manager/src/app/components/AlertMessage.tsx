'use client';

interface AlertMessageProps {
  message: string;
  type: 'success' | 'warning' | 'error';
}

export default function AlertMessage({ message, type }: AlertMessageProps) {
{/* <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
  <p class="font-bold">Be Warned</p>
  <p>Something not ideal might be happening.</p>
</div> */}
  let alertClass = '';
  switch (type) {
    case 'success':
      alertClass = 'bg-green-100 border-l-4 border-green-500 text-green-700';
      break;
    case 'warning':
      alertClass = 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700';
      break;
    case 'error':
      alertClass = 'bg-red-100 border-l-4 border-red-500 text-red-700';
      break;
  }

  return (
    <div className={`p-4 ${alertClass}`} role="alert">
      <p>{message}</p>
    </div>
  );
}