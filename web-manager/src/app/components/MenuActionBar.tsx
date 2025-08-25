'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RefreshCcw } from "lucide-react";
import BtnLoading from "./Btn/BtnLoading";
import NotificationsPanel from "./NotificationsPanel";
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setIsStartedWorkflows } from '@/app/store/n8nReducer';
import { MenuTargetEnum, selectMenuTarget } from '@/app/store/menuReducer';
import Btn from './Btn/Btn';
import png_n8n from '../../../public/n8n.png';

export default function MenuActionBar() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows } = useAppSelector(state => state.n8nReducer)
  const { target } = useAppSelector(state => state.menuReducer)

  const startWorkflowsHandler = () => {
    if (!isStartedWorkflows) {
      dispatch(setIsStartedWorkflows(true));
    }
  }
  
  return (        
    <div className="flex items-center gap-2">
      
      {/* Jobs Button */}
      <Btn
        title="Jobs"
        isActive={target === MenuTargetEnum.jobs}
        width={'80px'}
        onClick={() => dispatch(selectMenuTarget(MenuTargetEnum.jobs))}
      />

      {/* CVs Button */}
      <Btn
        title="CVs"
        isActive={target === MenuTargetEnum.cvs}
        width={'80px'}
        onClick={() => dispatch(selectMenuTarget(MenuTargetEnum.cvs))}
      />

      {/* Worflows Button */}
      <BtnLoading
        title={<RefreshCcw size={18} />}
        width={'40px'}
        loading={isStartedWorkflows}
        onClick={startWorkflowsHandler}
      />
      
      {/* N8N Button */}
      <Link
        href={"http://localhost:5678"}
        target="_blank"
        className="bg-red-400 text-white p-0 rounded-full opacity-75 hover:opacity-100"
      >
        <Image src={png_n8n} priority={false} alt="N8N" className="w-10 h-10 rounded-full" />
      </Link>

      {/* Notifications Button */}
      <NotificationsPanel />

    </div>
  );
}