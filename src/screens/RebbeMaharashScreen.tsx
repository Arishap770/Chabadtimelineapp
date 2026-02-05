import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface RebbeMaharashScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const RebbeMaharashScreen: React.FC<RebbeMaharashScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['maharash'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default RebbeMaharashScreen;
