import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface FrierdikerRebbeScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const FrierdikerRebbeScreen: React.FC<FrierdikerRebbeScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['frierdiker-rebbe'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default FrierdikerRebbeScreen;
