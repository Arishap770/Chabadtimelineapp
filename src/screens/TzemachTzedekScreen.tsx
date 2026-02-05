import React from 'react';
import RebbeScreen from '../components/RebbeScreen';
import { REBBEIM_MAP } from '../../rebbeim-data';

interface TzemachTzedekScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const TzemachTzedekScreen: React.FC<TzemachTzedekScreenProps> = ({ onClose, onEventPress }) => {
  const rebbeData = REBBEIM_MAP['tzemach-tzedek'];
  
  return <RebbeScreen rebbeData={rebbeData} onClose={onClose} onEventPress={onEventPress} />;
};

export default TzemachTzedekScreen;
