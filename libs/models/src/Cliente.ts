import {jsonModel} from '@alkord/json/decorators';
import Pessoa from './Pessoa';

@jsonModel
export default class Cliente extends Pessoa {}
