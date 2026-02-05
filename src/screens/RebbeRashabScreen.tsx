import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface RebbeRashabScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const RebbeRashabScreen: React.FC<RebbeRashabScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['rashab'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default RebbeRashabScreen;
