import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface AlterRebbeScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const AlterRebbeScreen: React.FC<AlterRebbeScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['alter-rebbe'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default AlterRebbeScreen;
