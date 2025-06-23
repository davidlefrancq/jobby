'use client';

import Link from 'next/link';
import { RefreshCcw } from "lucide-react";
import BtnLoading from "./Btn/BtnLoading";
import NotificationsPanel from "./NotificationsPanel";
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setIsStartedWorkflows } from '@/app/store/n8nReducer';
import { MenuTargetEnum, selectMenuTarget } from '@/app/store/menuReducer';
import Btn from './Btn/Btn';

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
        isActive={target === MenuTargetEnum.Jobs}
        width={'80px'}
        onClick={() => dispatch(selectMenuTarget(MenuTargetEnum.Jobs))}
      />

      {/* CVs Button */}
      <Btn
        title="CVs"
        isActive={target === MenuTargetEnum.CVs}
        width={'80px'}
        onClick={() => dispatch(selectMenuTarget(MenuTargetEnum.CVs))}
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
        <img src="n8n.png" alt="Rocket" className="w-10 h-10 rounded-full" />
      </Link>

      {/* Notifications Button */}
      <NotificationsPanel />

    </div>
  );
}