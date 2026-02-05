import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface MittelerRebbeScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const MittelerRebbeScreen: React.FC<MittelerRebbeScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['mitteler-rebbe'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default MittelerRebbeScreen;
