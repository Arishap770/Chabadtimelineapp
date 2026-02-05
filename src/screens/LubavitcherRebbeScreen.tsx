import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface LubavitcherRebbeScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const LubavitcherRebbeScreen: React.FC<LubavitcherRebbeScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['rebbe'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default LubavitcherRebbeScreen;
